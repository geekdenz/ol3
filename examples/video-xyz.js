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
//var minx = Number.MAX_VALUE, maxx = Number.MIN_VALUE, miny 
function getUrl(coord) {
	var url = 'http://npm.landcareresearch.co.nz/videos/{z}/000/000/{x}/000/000/{y}.mp4';
	//         http://npm.landcareresearch.co.nz/videos/ 00/000/000/001/000/000/001.mp4
	var y = -coord[2] - 1;
	return url.replace('{z}', coord[0].padLeft(2)).replace('{x}', coord[1].padLeft(3)).replace('{y}', y.padLeft(3));
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
/*
var resolutions = reverse([
        3.527775872778806, 8.819439681947015,
        17.63887936389403, 35.27775872778806,
        88.19439681947017, 176.38879363894034,
        352.7775872778807, 705.5551745557614,
        1411.1103491115227, 2822.2206982230455
    ]);
	*/

var resolutions = [8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.07],
	matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var originCoord = [-4020900.0, 19998100];
var source = new ol.source.XYZ({
	tileGrid: new ol.tilegrid.TileGrid({
		//maxZoom: 9,
		//origin: [1000000, 4700000.0000001],
		origin: originCoord,
		resolutions: resolutions
	}),
	crossOrigin: 'Anonymous',
	url: 'http://npm.landcareresearch.co.nz/videos/{z}/{x}/{y}.mp4',
	tileLoadFunction: function(imageTile, src) {
		console.log('imageTile',imageTile.tileCoord)
		var coord = imageTile.tileCoord;
		var y = -coord[2] - 1;
		//coord[2] = y;
		//console.log('src',src,y)
		// http://npm.landcareresearch.co.nz/videos/00/000/000/001/000/000/001.mp4
		imageTile.getImage().src = getUrl(coord);
	},
	tileUrlFunction: function(coord) {
		console.log('COORD', coord);
		return getUrl(coord);
	}
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


//var parser = new ol.format.WMTSCapabilities();
var map;
proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu");

// Set transform functions, taken from proj4
var forward = proj4('EPSG:4326','EPSG:2193').forward,
	inverse = proj4('EPSG:4326','EPSG:2193').inverse;

// Create new projection
var proj2193 = new ol.proj.Projection({
	code: 'EPSG:2193',
	units: 'm',
	//extent: [1000000, 4700000, 2200000, 6300000]
	extent: [274000, 3087000, 3327000, 7173000]
});

// Add projection to global ol object
ol.proj.addProjection(proj2193);

// Add transforms
ol.proj.addCoordinateTransforms('EPSG:4326', proj2193,
    forward,
    inverse
);
//var projection = ol.proj.get('EPSG:2193');
//var projectionExtent = [-4062457.5262811976, 1461859.0976713542, 7068246.316059387, 8771210.999982666];
//var originCoord = [-4020900.0, 19998100];
//projection.setExtent(projectionExtent);
//var resolutions = [4891.96981024998, 2445.98490512499, 1222.992452562495, 611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324, 38.21851414253662, 19.10925707126831, 9.554628535634155, 4.77731426794937, 2.388657133974685, 1.1943285668550503, 0.5971642835598172, 0.29858214164761665, 0.14929144441622216, 0.07464439928879858];
//var matrixIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
var tileGridOptions = {
	// origin: ol.extent.getTopLeft(projectionExtent),
	origin: originCoord,
	resolutions: resolutions,
	matrixIds: matrixIds
};
var tileGrid = new ol.tilegrid.WMTS(tileGridOptions);
var view = new ol.View({
	projection: proj2193,
	center: [1600000, 5450000],
	zoom: 0,
	//minZoom: 0,
	//maxZoom: 11
	resolution: 2240,
	resolutions: [8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8]
	//resolutions: [8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.07]
});

var projExtent = proj2193.getExtent();
/*
view = new ol.View({
			center: [19412406.33, -5050500.21],
			zoom: 5
		});
		*/

var tileGrid = new ol.tilegrid.WMTS({
	origin: ol.extent.getTopLeft(projExtent),
	extent: projExtent,
	resolutions: resolutions,
	matrixIds: matrixIds
});

var src = new ol.source.WMTS({
	url: 'https://smap.landcareresearch.co.nz/mapcache/portals/wmts/?',
	layer: 'topobasemap_notext',
	matrixSet: 'NZTM2000',
	tileGrid: tileGrid,
	format: 'jpeng',
	style: 'default',
	units: 'm',
	tilePixelRatio: 1,
	attributions: ['Hello Map']
});

var lyr = new ol.layer.Tile({
	//title: layer.wmtsName,
	//type: layer.type,
	//services: layer.services,
	source: src,
	visible: true
});

map = new ol.Map({
	layers: [
		lyr,
		new ol.layer.Tile({
			source: source
		})
	],
	target: 'map',
	view: view /*new ol.View({
			center: [19412406.33, -5050500.21],
			zoom: 5
		})*/
});
