goog.provide('ol.VideoTile');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
//goog.require('ol.ImageTile');
goog.require('ol.Tile');
goog.require('ol.TileCoord');
goog.require('ol.TileState');



/**
 * @constructor
 * @extends {ol.Tile}
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @param {ol.TileState} state State.
 * @param {string} src Image source URI.
 * @param {?string} crossOrigin Cross origin.
 */
ol.VideoTile = function(tileCoord, state, src, crossOrigin) {

  goog.base(this, tileCoord, state);

  /**
   * Image URI
   *
   * @private
   * @type {string}
   */
  this.src_ = src;

  /**
   * @private
   * @type {HTMLVideoElement|Element|Image}
   */
  this.image_ = document.createElement('video'); // This line does the trick
  this.image_.naturalHeight = 100;
  //this.image_ = new Image();//document.createElement('video'); // This line does the trick

  if (!goog.isNull(crossOrigin)) {
    this.image_.crossOrigin = crossOrigin;
  }

  /**
   * @private
   * @type {Object.<number, Element>}
   */
  this.imageByContext_ = {};

  /**
   * @private
   * @type {Array.<number>}
   */
  this.imageListenerKeys_ = null;

};
goog.inherits(ol.VideoTile, ol.Tile);


/**
 * @inheritDoc
 * @return {HTMLVideoElement|Image}
 */
ol.VideoTile.prototype.getImage = function(opt_context) {
  if (goog.isDef(opt_context)) {
    var image;
    var key = goog.getUid(opt_context);
    if (key in this.imageByContext_) {
      return /** @type {HTMLVideoElement} */ this.imageByContext_[key];
    } else if (goog.object.isEmpty(this.imageByContext_)) {
      image = this.image_;
    } else {
      image = /** @type {HTMLVideoElement} */ (this.image_.cloneNode(false));
    }
    this.imageByContext_[key] = image;
    return /** @type {HTMLVideoElement} */ image;
  } else {
    return /** @type {HTMLVideoElement} */ this.image_;
  }
};


/**
 * @inheritDoc
 */
ol.VideoTile.prototype.getKey = function() {
  return this.src_;
};


/**
 * Tracks loading or read errors.
 *
 * @private
 */
ol.VideoTile.prototype.handleImageError_ = function() {
  this.state = ol.TileState.ERROR;
  this.unlistenImage_();
  this.dispatchChangeEvent();
};


/**
 * Tracks successful image load.
 *
 * @private
 */
ol.VideoTile.prototype.handleImageLoad_ = function() {
  if (this.image_.naturalWidth && this.image_.naturalHeight) {
    this.state = ol.TileState.LOADED;
  } else {
    this.state = ol.TileState.EMPTY;
  }
  this.unlistenImage_();
  this.dispatchChangeEvent();
};


/**
 * Load not yet loaded URI.
 */
ol.VideoTile.prototype.load = function() {
  if (this.state == ol.TileState.IDLE) {
    this.state = ol.TileState.LOADING;
    goog.asserts.assert(goog.isNull(this.imageListenerKeys_));
    this.imageListenerKeys_ = [
      goog.events.listenOnce(this.image_, goog.events.EventType.ERROR,
          this.handleImageError_, false, this),
      goog.events.listenOnce(this.image_, goog.events.EventType.LOAD,
          this.handleImageLoad_, false, this)
    ];
    this.image_.src = this.src_;
  }
};


/**
 * Discards event handlers which listen for load completion or errors.
 *
 * @private
 */
ol.VideoTile.prototype.unlistenImage_ = function() {
  goog.asserts.assert(!goog.isNull(this.imageListenerKeys_));
  goog.array.forEach(this.imageListenerKeys_, goog.events.unlistenByKey);
  this.imageListenerKeys_ = null;
};
