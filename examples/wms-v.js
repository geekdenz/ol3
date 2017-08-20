goog.require('ol.Attribution');
goog.require('ol.Map');
//goog.require('ol.Extent');
//goog.require('ol.RendererHints');
//goog.require('ol.View2D');
//goog.require('ol.layer.ImageLayer');
//goog.require('ol.projection');
//goog.require('ol.source.SingleImageWMS');
goog.require('ol.source.TiledVideoWMS');
goog.require('ol.source.TileWMS');

var extent = [1000000, 4700000.0000001, 2200000, 6300000];
var projection = ol.projection.configureProj4jsProjection({
  code: 'EPSG:2193',
  extent: extent,
  units: 'm'
});
function reverse(ar) {
  var reversed = [];
  for (var i = ar.length; --i >= 0;) {
    reversed.push(ar[i]);
  }
  return reversed;
}
var resolutions = reverse([
        3.527775872778806, 8.819439681947015,
        17.63887936389403, 35.27775872778806,
        88.19439681947017, 176.38879363894034,
        352.7775872778807, 705.5551745557614,
        1411.1103491115227, 2822.2206982230455
    ]);
var layers = [
  new ol.layer.TileLayer({
    source: new ol.source.TileWMS({
      url: 'http://maps.scinfo.org.nz/basemaps/wms?',
      params: {
          'LAYERS': 'landscape_eco_painted_relief', 
          'TILED': true,
          'VERSION': '1.1.1'
      },
      extent: extent
    })
  }),
  new ol.layer.TileLayer({
    source: new ol.source.TiledVideoWMS({
      url: 'http://npm.landcareresearch.co.nz/possums/anim/videoproxy.php?',
      params: {
          'LAYERS': 'possum_videos_cache_nztm', 
          'TILED': true,
          'VERSION': '1.1.1'
      },
      tileGrid: new ol.tilegrid.TileGrid({
        origin: [1000000, 4700000.0000001],
        resolutions: resolutions
      }),
      extent: extent
    })
  })
];
var map = new ol.Map({
  //renderer: ol.RendererHint.CANVAS,
  renderer: ol.RendererHint.DOM,
  layers: layers,
  target: 'map',
  view: new ol.View2D({
    center: [1600000, 5500000],
    projection: projection,
    scales: [100000, 250000, 500000, 1000000, 2000000, 4000000, 8000000],
    zoom: 2
  })
});
function getVids() {
  return document.getElementsByTagName('video');
}
function applyAll(vs, func) {
  for (var i = -1, leni = vs.length; ++i < leni;){
    vs[i][func]();
  }
}
function setAll(vs, prop, value) {
  for (var i = -1, leni = vs.length; ++i < leni;){
    vs[i][prop] = value;
  }
}
function playAll() {
  applyAll(getVids(), 'play');
}
function pauseAll() {
  applyAll(getVids(), 'pause');
}
function rewindAll() {
  setAll(getVids(), 'currentTime', 0);
}
