goog.provide('ol.VideoTile');

goog.require('ol.ImageTile');

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
   * @type {Object.<number, Element>}
   */
  this.imageByContext_ = {};

  /**
   * @private
   * @type {Array.<number>}
   */
  this.imageListenerKeys_ = null;

};

goog.inherits(ol.VideoTile, ol.ImageTile);


ol.VideoTile.prototype.getImage_ = ol.ImageTile.prototype.getImage;
/**
 * @inheritDoc
 * @return {HTMLVideoElement}
 * @suppress {checkTypes}
 */
ol.VideoTile.prototype.getImage = function(opt_context) {
    var /** @type {HTMLVideoElement} */ image;
    image = this.getImage_(opt_context);
    return image;
};

/**
 * Tracks successful image load.
 *
 * @private
 */
ol.VideoTile.prototype.handleImageLoad_ = function() {
  if (this.image_.videoWidth && this.image_.videoHeight) {
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
      goog.events.listenOnce(this.image_, "loadedmetadata",
          this.handleImageLoad_, false, this)
    ];
    this.image_.src = this.src_;
  }
};

/**
 * Play the video
 */
ol.VideoTile.prototype.play = function() {
  var video = this.getImage();
  video.play();
};
