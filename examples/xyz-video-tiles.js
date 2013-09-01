goog.require('ol.control.FullScreen');
goog.require('ol.control.defaults');
goog.require('ol.Map');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.TileLayer');
goog.require('ol.layer.VideoTileLayer');
goog.require('ol.source.DebugTileSource');
goog.require('ol.tilegrid.XYZ');
goog.require('ol.source.ImageTileSource');
goog.require('ol.source.VideoTileSource');

goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.ui.Slider');

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
function getVideos() {
  var map = document.getElementById('map');
  var videos = map.getElementsByTagName('video');
  return videos;
}
function play() {
  var videos = getVideos();
  var ii = videos.length;
  while (ii--) {
    videos[ii].play();
  }
}
var view = new ol.View2D({
    center: [20000000,20001000],
    zoom: 1,    
    maxZoom: 6
  });
var extent = [1000000, 4700000.0000001, 2200000, 6300000];
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
        origin: [1000000, 4700000.0000001],
        resolutions: resolutions
      }),
      tileUrlFunction: function(opt) {
        return createVideoUrl(opt.x, opt.y, opt.z);
      },
      extent: extent
    });
//source.tileGrid.resolutions_ = resolutions; // HACK
var layer = new ol.layer.VideoTileLayer({
      source: videoSource
    });
var map = new ol.Map({
  controls: ol.control.defaults({}, [
    new ol.control.FullScreen()
  ]),
  layers: [
    layer
  ],
  renderer: ol.RendererHint.DOM,
  //renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: view
});

//window.map = map;
//window.view = view;
var playButton = document.querySelectorAll('a.play')[0];

playButton.onclick = play;

var el = document.getElementById('s1');
var s = new goog.ui.Slider;
s.decorate(el);
s.setMinimum(2009);
s.setMaximum(2039);
s.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
  var value = s.getValue();
  var videos = getVideos();
  var ii = videos.length;
  var time = (value - 2009) / 6;
  while (ii--) {
    videos[ii].currentTime = time;
  }
  document.querySelectorAll('.year')[0].innerHTML = value;
  console.log(time);
});
