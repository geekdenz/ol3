goog.require('ol.Attribution');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control');
goog.require('ol.layer.Tile');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.source.TileWMS');

var attribution = new ol.Attribution({
  html: 'Tiles &copy; <a href="http://maps.nls.uk/townplans/glasgow_1.html">' +
      'National Library of Scotland</a>'
});

var extent = [1000000, 4700000.0000001, 2200000, 6300000];
var projection = new ol.proj.Projection({
  code: 'EPSG:2193',
  extent: extent,
  units: 'm'
});
ol.proj.addProjection(projection);
function reverse(ar) {
  var reversed = [];
  for (var i = ar.length; --i >= 0; ) {
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
  new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://maps.scinfo.org.nz/basemaps/wms?',
      projection: projection,
      params: {
        'LAYERS': 'landscape_eco_painted_relief',
        'TILED': true,
        'VERSION': '1.1.1',
        'SRS': 'EPSG:2193'
      },
      extent: extent,
      serverType: 'mapserver'
    })
  })
];
var map = new ol.Map({
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }),
  layers: layers,
  view: new ol.View({
    center: [1600000, 5500000],
    projection: projection,
    scales: [100000, 250000, 500000, 1000000, 2000000, 4000000, 8000000],
    zoom: 2
  })
});
