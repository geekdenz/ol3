goog.provide('ol.layer.VideoLayer');

goog.require('ol.layer.Layer');
goog.require('ol.source.VideoTileSource');



/**
 * @constructor
 * @extends {ol.layer.Layer}
 * @param {ol.layer.LayerOptions} options Layer options.
 */
ol.layer.VideoLayer = function(options) {
  goog.base(this, options);
};
goog.inherits(ol.layer.VideoLayer, ol.layer.Layer);


/**
 * @return {ol.source.ImageSource} Single image source.
 */
ol.layer.VideoLayer.prototype.getImageSource = function() {
  return /** @type {ol.source.VideoTileSource} */ (this.getSource());
};
