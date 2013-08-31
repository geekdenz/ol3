goog.provide('ol.layer.VideoTileLayer');

goog.require('ol.layer.Layer');
goog.require('ol.source.VideoTileSource');


/**
 * @enum {string}
 */
ol.layer.VideoTileLayerProperty = {
  PRELOAD: 'preload'
};



/**
 * @constructor
 * @extends {ol.layer.Layer}
 * @param {ol.layer.TileLayerOptions} options Tile layer options.
 */
ol.layer.VideoTileLayer = function(options) {

  goog.base(this, options);

  this.setPreload(
      goog.isDef(options.preload) ? options.preload : 0);

};
goog.inherits(ol.layer.VideoTileLayer, ol.layer.Layer);


/**
 * @return {number} Preload.
 */
ol.layer.VideoTileLayer.prototype.getPreload = function() {
  return /** @type {number} */ (this.get(ol.layer.VideoTileLayerProperty.PRELOAD));
};
goog.exportProperty(
    ol.layer.VideoTileLayer.prototype,
    'getPreload',
    ol.layer.VideoTileLayer.prototype.getPreload);


/**
 * @return {ol.source.VideoTileSource} Source.
 */
ol.layer.VideoTileLayer.prototype.getTileSource = function() {
  return /** @type {ol.source.VideoTileSource} */ (this.getSource());
};


/**
 * @param {number} preload Preload.
 */
ol.layer.VideoTileLayer.prototype.setPreload = function(preload) {
  this.set(ol.layer.VideoTileLayerProperty.PRELOAD, preload);
};
goog.exportProperty(
    ol.layer.VideoTileLayer.prototype,
    'setPreload',
    ol.layer.VideoTileLayer.prototype.setPreload);
