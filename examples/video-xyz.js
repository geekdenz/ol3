goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.XYZ');
goog.require('ol.format.WMTSCapabilities');
goog.require('ol.source.OSM');
goog.require('ol.source.WMTS');

//var extent = [1000000, 4700000.0000001, 2200000, 6300000];
//var projection = new ol.proj.Projection({
//  code: 'EPSG:2193',
//  extent: extent,
//  units: 'm'
//});
//ol.proj.addProjection(projection);
// -20722863.033888973, -4961350.41607024
Number.prototype.padLeft = function (n,str){
    return Array(n-String(this).length+1).join(str||'0')+this;
}
function getUrl(coord) {
	var url = 'http://npm.landcareresearch.co.nz/videos/{z}/000/000/{x}/000/000/{y}.mp4';
	//         http://npm.landcareresearch.co.nz/videos/ 00/000/000/001/000/000/001.mp4
	return url.replace('{z}', coord[0].padLeft(2)).replace('{x}', coord[1].padLeft(3)).replace('{y}', coord[2].padLeft(3));
}
function pad(n, num) {
    var len = (""+n).length;
    var s="";
    for (var i = num-len; i > 0; i--) {
      s+="0";
    }
    return (s+n);
}
function createVideoUrl(coord) {
	var x = coord[0];
	var y = coord[1];
	var z = coord[2];
    if (x < 0 || y < 0) {
        return null;
    }
    var url = 'http://npm.landcareresearch.co.nz/videos/';
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
var view = new ol.View({
	//center: [20000000,60000000],
	zoom: 0,
	//projection: projection,
	maxZoom: 6
});
var source = new ol.source.XYZ({
	tileGrid: new ol.tilegrid.TileGrid({
		maxZoom: 9,
		origin: [1000000, 4700000.0000001],
		resolutions: resolutions
	}),
	crossOrigin: 'Anonymous',
	url: 'http://npm.landcareresearch.co.nz/videos/{z}/{x}/{y}.mp4',
	tileLoadFunction: function(imageTile, src) {
		console.log('imageTile',imageTile.tileCoord)
		var coord = imageTile.tileCoord;
		var y = -coord[2] - 1;
		//coord[2] = y;
		console.log('src',src,y)
		//imageTile.getImage().src = createVideoUrl(coord);
	},
	origin: [1000000, 4700000.0000001]
});
//var parser = new ol.format.WMTSCapabilities();
//var url = 'https://openlayers.org/en/v4.3.3/examples/data/WMTSCapabilities.xml';
//// http://maps.scinfo.org.nz/cached/wmts?SERVICE=wmts&REQUEST=getcapabilities&VERSION=1.0.0
//fetch(url).then(function(response) {
//	return response.text();
//}).then(function(text) {
//	var result = parser.read(text);
//	var options = ol.source.WMTS.optionsFromCapabilities(result, {
//		layer: 'layer-7328',
//		matrixSet: 'EPSG:3857'
//	});
//	var layers = [
//			/*
//	new ol.layer.Tile({
//	  source: new ol.source.XYZ({
//		url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
//			'?apikey=0e6fc415256d4fbb9b5166a718591d71'
//	  })
//	})
//	*/
//			/*new ol.layer.Tile({
//				source: source
//			}),*/new ol.layer.Tile({
//              source: new ol.source.OSM(),
//              opacity: 0.7
//            }), new ol.layer.Tile({
//              opacity: 1,
//              source: new ol.source.WMTS(options)
//            })
//		];
//	var map = new ol.Map({
//		target: 'map',
//		//renderer: ol.RendererHint.DOM, // doesn't work
//		layers: layers//,
//		//view: view
//	});
//});


var parser = new ol.format.WMTSCapabilities();
var map;
view = new ol.View({
			center: [19412406.33, -5050500.21],
			zoom: 5
		});

fetch('https://openlayers.org/en/v4.3.3/examples/data/WMTSCapabilities.xml').then(function(response) {
	return response.text();
}).then(function(text) {
	var result = parser.read(text);
	var options = ol.source.WMTS.optionsFromCapabilities(result, {
		layer: 'layer-7328',
		matrixSet: 'EPSG:3857'
	});

	map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM(),
				opacity: 0.7
			})/*,
			new ol.layer.Tile({
				source: source
			})*/
		],
		target: 'map',
		view: view /*new ol.View({
			center: [19412406.33, -5050500.21],
			zoom: 5
		})*/
	});
});
