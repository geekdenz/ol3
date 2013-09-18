goog.provide('ol.source.VideoTileSource');

goog.require('ol.VideoTile');
goog.require('ol.source.TileImage');



/**
 * @constructor
 * @extends {ol.source.TileImage}
 * @param {ol.source.TileImageOptions} options Image tile options.
 */
ol.source.VideoTileSource = function(options) {
  return goog.base(this, options);
};
goog.inherits(ol.source.VideoTileSource, ol.source.TileImage);


/**
 * @inheritDoc
 */
ol.source.VideoTileSource.prototype.getTile = function(z, x, y, projection) {
  var tileCoordKey = this.getKeyZXY(z, x, y);
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


