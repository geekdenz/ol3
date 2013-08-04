goog.require('ol.Map');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.TileLayer');
goog.require('ol.projection');
goog.require('ol.source.DebugTileSource');
goog.require('ol.source.OSM');
goog.require('ol.tilegrid.XYZ');
goog.require('ol.source.ImageTileSource');

function pad(n) {
    var len = (""+n).length;
    var s="";
    for (var i = 3-len; i > 0; i--) {
      s+="0";
    }
    return s+n;
}
function createUrl(x, y, z) {
    var url = 'http://proxy.zen.landcareresearch.co.nz/possums/cache/possum_2009_cache_nztm/portalgridnztm1/';
    var zeros = '000';
    var s = '0'+ z +'/'+ zeros +'/'+ zeros +'/'+ pad(x) +'/'+ zeros +'/'+ zeros +'/'+ pad(y) +'.png';
    return url + s;
}
var view = new ol.View2D({
    center: [20000000,20001000],
    zoom: 1,
    maxZoom: 6
  });
var map = new ol.Map({
  layers: [
    new ol.layer.TileLayer({
      source: new ol.source.ImageTileSource({
        tileUrlFunction: function(opt) {
          return createUrl(opt.x, opt.y, opt.z);
        }
      })
    })
  ],
  renderer: ol.RendererHint.DOM,
  //renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: view
});

//window.map = map;
//window.view = view;
