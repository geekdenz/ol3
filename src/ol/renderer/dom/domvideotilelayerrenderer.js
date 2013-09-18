goog.provide('ol.renderer.dom.VideoTileLayer');

goog.require('ol.renderer.dom.TileLayer');


/**
 * @constructor
 * @extends {ol.renderer.dom.TileLayer}
 * @param {ol.renderer.Map} mapRenderer Map renderer.
 * @param {ol.layer.Tile} tileLayer Tile layer.
 */
ol.renderer.dom.VideoTileLayer = function(mapRenderer, tileLayer) {
  goog.base(this, mapRenderer, tileLayer);
};

goog.inherits(ol.renderer.dom.VideoTileLayer, ol.renderer.dom.TileLayer);
