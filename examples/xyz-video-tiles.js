goog.require('ol.Map');
//goog.require('ol.interaction.DragRotateAndZoom');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.TileLayer');
goog.require('ol.layer.VideoTileLayer');
goog.require('ol.source.DebugTileSource');
//goog.require('ol.source.OSM');
goog.require('ol.tilegrid.XYZ');
goog.require('ol.source.ImageTileSource');
goog.require('ol.source.VideoTileSource');
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
function slashify(s) {
    var paddedThree = pad(s, 3);
    return s.match(/.{3}/g).join('/');
}
function pad(n, num) {
    var len = (""+n).length;
    var s="";
    for (var i = num-len; i > 0; i--) {
      s+="0";
    }
    return (s+n);
}
function createVideoUrl(x, y, z) {
    if (x < 0 || y < 0) {
        return null;
    }
    var url = 'http://projects.local/mapcache/';
    var s = '0'+ z +'/'+ 
            pad(Math.floor(x/1000000),3) +'/'+ 
            pad(Math.floor(x/1000) % 1000,3) +'/'+ 
            pad(x % 1000,3) +'/'+
            pad(Math.floor(y/1000000),3) +'/'+ 
            pad(Math.floor(y/1000) % 1000,3) +'/'+ 
            pad(y % 1000,3) +'.mp4';
    //var s = '0'+ z +'/'+ slashify(pad(x, 9)) +'/'+ slashify(pad(y, 9)) +'.png';
    return url + s;
}
function createVideUrl(x, y, z) {
    if (x < 0 || y < 0) {
        return null;
    }
    var url = 'http://projects.local/mapcache/';
    var s = '0'+ z +'/'+ 
            pad(Math.floor(x/1000000),3) +'/'+ 
            pad(Math.floor(x/1000) % 1000,3) +'/'+ 
            pad(x % 1000,3) +'/'+
            pad(Math.floor(y/1000000),3) +'/'+ 
            pad(Math.floor(y/1000) % 1000,3) +'/'+ 
            pad(y % 1000,3) +'.mp4';
    //var s = '0'+ z +'/'+ slashify(pad(x, 9)) +'/'+ slashify(pad(y, 9)) +'.png';
    return url + s;
}
var view = new ol.View2D({
    center: [20000000,20001000],
    zoom: 1,    
    maxZoom: 6
  });
var source = new ol.source.ImageTileSource({
      tileGrid: new ol.tilegrid.XYZ({
        //origin: [1000000, 4700000.0000001],
        //origin: [-ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE],
        //origin: [0, 0],
        maxZoom: 9,
        resolutions: resolutions
      }),
      tileUrlFunction: function(opt) {
        return createUrl(opt.x, opt.y, opt.z);
      }
    });
var videoSource = new ol.source.VideoTileSource({
      tileGrid: new ol.tilegrid.XYZ({
        maxZoom: 6,
        resolutions: resolutions
      }),
      tileUrlFunction: function(opt) {
        return createVideoUrl(opt.x, opt.y, opt.z);
      }
    });
//source.tileGrid.resolutions_ = resolutions; // HACK
var map = new ol.Map({
  layers: [
    new ol.layer.VideoTileLayer({
      source: videoSource
    })
  ],
  renderer: ol.RendererHint.DOM,
  //renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: view
});

//window.map = map;
//window.view = view;
