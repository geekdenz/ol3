goog.provide('ol.VideoTile');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
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
   * @type {HTMLVideoElement|Element}
   */
  /** @type {HTMLVideoElement} @suppress {checkTypes} */ var video = /** @type {HTMLVideoElement} */ (document.createElement('video'));
  this.image_ = video;
  this.image_.preload = 'metadata';

  if (!goog.isNull(crossOrigin)) {
    this.image_.crossOrigin = crossOrigin;
  }

  /**
   * @private
   * @type {Object.<number, HTMLVideoElement>|Object.<number, Image>}
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
 */
ol.VideoTile.prototype.getImage = function(opt_context) {
  if (goog.isDef(opt_context)) {
    var image;
    var key = goog.getUid(opt_context);
    if (key in this.imageByContext_) {
      return this.imageByContext_[key];
    } else if (goog.object.isEmpty(this.imageByContext_)) {
      image = this.image_;
    } else {
      image = /** @type {Image|HTMLVideoElement} */ (this.image_.cloneNode(false));
    }
    this.imageByContext_[key] = image;
    return image;
  } else {
    return this.image_;
  }
};

/**
 * Tracks successful image load.
 *
 * @private
 */
ol.VideoTile.prototype.handleImageLoad_ = function() {
  var video = this.image_;
  if (video.videoWidth && video.videoHeight) {
    this.state = ol.TileState.LOADED;
  } else {
    this.state = ol.TileState.EMPTY;
  }
  this.unlistenImage_();
  this.dispatchChangeEvent();
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
 * Load not yet loaded URI.
 */
ol.VideoTile.prototype.load = function() {
  if (this.state == ol.TileState.IDLE) {
    this.state = ol.TileState.LOADING;
    goog.asserts.assert(goog.isNull(this.imageListenerKeys_));
    this.imageListenerKeys_ = [
      goog.events.listenOnce(this.image_, goog.events.EventType.ERROR,
          this.handleImageError_, false, this),
      goog.events.listenOnce(this.image_, "loadedmetadata",
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

/**
 * Play the video
 */
ol.VideoTile.prototype.play = function() {
  var video = this.getImage();
  video.play();
};
