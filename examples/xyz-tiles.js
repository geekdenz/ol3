goog.require('ol.Map');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.TileLayer');
goog.require('ol.projection');
goog.require('ol.source.DebugTileSource');
goog.require('ol.source.OSM');
goog.require('ol.tilegrid.XYZ');


var view = new ol.View2D({
    center: [-20000000,20001000],
    zoom: 10
  });
var map = new ol.Map({
  layers: [
    new ol.layer.TileLayer({
      source: new ol.source.OSM()
    }),
    new ol.layer.TileLayer({
      source: new ol.source.DebugTileSource({
        projection: 'EPSG:3857',
        tileGrid: new ol.tilegrid.XYZ({
          maxZoom: 22
        })
      })
    })
  ],
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: view
});

window.map = map;
window.view = view;
