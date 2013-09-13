goog.provide('ol.source.VideoTileSource');

goog.require('ol.VideoTile');
goog.require('ol.source.ImageTileSource');



/**
 * @constructor
 * @extends {ol.source.TileSource}
 * @param {ol.source.ImageTileOptions} options Image tile options.
 */
ol.source.VideoTileSource = function(options) {

  goog.base(this, {
    attributions: options.attributions,
    extent: options.extent,
    logo: options.logo,
    opaque: options.opaque,
    projection: options.projection,
    tileGrid: options.tileGrid
  });

  /**
   * @protected
   * @type {ol.TileUrlFunctionType}
   */
  this.tileUrlFunction = goog.isDef(options.tileUrlFunction) ?
      options.tileUrlFunction :
      ol.TileUrlFunction.nullTileUrlFunction;

  /**
   * @private
   * @type {?string}
   */
  this.crossOrigin_ =
      goog.isDef(options.crossOrigin) ? options.crossOrigin : null;

  /**
   * @private
   * @type {ol.TileCache}
   */
  this.tileCache_ = new ol.TileCache();

};
goog.inherits(ol.source.VideoTileSource, ol.source.ImageTileSource);


/**
 * @inheritDoc
 */
ol.source.VideoTileSource.prototype.getTile = function(z, x, y, projection) {
  var tileCoordKey = ol.TileCoord.getKeyZXY(z, x, y);
  if (this.tileCache_.containsKey(tileCoordKey)) {
    return /** @type {!ol.Tile} */ (this.tileCache_.get(tileCoordKey));
  } else {
    goog.asserts.assert(projection);
    var tileCoord = new ol.TileCoord(z, x, y);
    var tileUrl = this.tileUrlFunction(tileCoord, projection);
    var tile = new ol.VideoTile(
        tileCoord,
        goog.isDef(tileUrl) ? ol.TileState.IDLE : ol.TileState.EMPTY,
        goog.isDef(tileUrl) ? tileUrl : '',
        this.crossOrigin_);
    this.tileCache_.set(tileCoordKey, tile);
    return tile;
  }
};
