goog.require('ol.Attribution');
goog.require('ol.Map');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.ImageLayer');
goog.require('ol.projection');
goog.require('ol.source.SingleImageWMS');
goog.require('ol.source.TiledWMS');

/*
var projection = ol.projection.configureProj4jsProjection({
  code: 'EPSG:21781',
  extent: [485869.5728, 837076.5648, 76443.1884, 299941.7864]
});

var extent = [420000, 900000, 30000, 350000];
var layers = [
  new ol.layer.ImageLayer({
    source: new ol.source.SingleImageWMS({
      url: 'http://wms.geo.admin.ch/',
      crossOrigin: 'anonymous',
      attributions: [new ol.Attribution(
          '&copy; ' +
          '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
          'Pixelmap 1:1000000 / geo.admin.ch</a>')],
      params: {
        'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        'FORMAT': 'image/jpeg'
      },
      extent: extent
    })
  }),
  new ol.layer.ImageLayer({
    source: new ol.source.SingleImageWMS({
      url: 'http://wms.geo.admin.ch/',
      crossOrigin: 'anonymous',
      attributions: [new ol.Attribution(
          '&copy; ' +
          '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
          'National parks / geo.admin.ch</a>')],
      params: {'LAYERS': 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'},
      extent: extent
    })
  })
];

var map = new ol.Map({
  layers: layers,
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    projection: projection,
    center: [660000, 190000],
    zoom: 2
  })
});
*/

// http://maps.scinfo.org.nz/basemaps/wms?LAYERS=landscape_eco_painted_relief&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&FORMAT=image%2Fpng&TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetMap&STYLES=&SRS=EPSG%3A2193&BBOX=1385381.5590272,5169683.7750644,1397424.7327468,5181726.948784&WIDTH=256&HEIGHT=256
var extent = [1000000, 4700000.0000001, 2200000, 6300000];
var projection = ol.projection.configureProj4jsProjection({
  code: 'EPSG:2193',
  extent: extent,
  units: 'm'
});
var layers = [
  new ol.layer.TileLayer({
    source: new ol.source.TiledWMS({
      url: 'http://maps.scinfo.org.nz/basemaps/wms?',
      params: {
          'LAYERS': 'landscape_eco_painted_relief', 
          'TILED': true,
          'VERSION': '1.1.1'
      },
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
    zoom: 2
  })
});
