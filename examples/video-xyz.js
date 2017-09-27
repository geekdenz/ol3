goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.XYZ');
goog.require('ol.format.WMTSCapabilities');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.source.OSM');
goog.require('ol.source.TileWMS');
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
var tiles = {};
function getUrl(coord) {
	var url = 'http://npm.landcareresearch.co.nz/videos/{z}/000/000/{x}/000/000/{y}.mp4';
	//         http://npm.landcareresearch.co.nz/videos/ 00/000/000/001/000/000/001.mp4
	var x = coord[1];//-coord[2] - 1;
	//var y = -coord[2] - 1;
	var y = -coord[2];
	var z = coord[0];//-coord[2] - 1;
	var myUrl = url.replace('{z}', z.padLeft(2)).replace('{x}', x.padLeft(3)).replace('{y}', y.padLeft(3));
	tiles['' + x] = tiles['' + x] || {};
	tiles['' + x]['' + y] = tiles['' + x]['' + y] || {};
	tiles['' + x]['' + y]['' + z] = myUrl;
	return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // blank image
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
var resolutions = [8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.07],
	matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var originCoord = [-4020900.0, 19998100];
*/
var proj2193 = new ol.proj.Projection({
  code: 'EPSG:2193',
  //extent: extent,
  units: 'm'
});

// Add projection to global ol object
ol.proj.addProjection(proj2193);
var projExtent = proj2193.getExtent();
var resolutions = [2822.22069822304547415115, 1411.11034911152273707557, 705.55517455576136853779, 352.77758727788068426889, 176.38879363894034213445, 88.19439681947017106722, 35.27775872778806132146, 17.63887936389403066073, 8.81943968194701533037, 3.52777587277880622096]
var view = new ol.View({
	projection: proj2193,
	center: [1600000, 5500000],
	zoom: 0,
	//resolution: 2240,
	resolutions: resolutions
});

var extent = [1000000, 4700000.0000001, 2200000, 6300000];
var wmsSource = new ol.source.TileWMS({
		url: 'http://maps.scinfo.org.nz/cached/?',
		params: {'LAYERS': 'landscape_eco_painted_relief', 'TILED': true, VERSION: '1.1.1'},
		projection: proj2193,
		serverType: 'mapserver'
	});
var wmsLayer = new ol.layer.Tile({
	extent: extent,
	source: wmsSource
});
var source = new ol.source.XYZ({
	//crossOrigin: 'anonymous',
	url: 'http://npm.landcareresearch.co.nz/videos/{z}/{x}/{y}.mp4',
	/*
	tileLoadFunction: function(imageTile, src) {
		//console.log('imageTile',imageTile.tileCoord)
		var coord = imageTile.tileCoord;
		var y = -coord[2] - 1;
		imageTile.getImage().src = getUrl(coord);
	},
	*/
	tileUrlFunction: function(coord) {
		//console.log('COORD', coord);
		return getUrl(coord);
	},
	projection: proj2193,
	tileGrid: new ol.tilegrid.TileGrid({
		origin: ol.extent.getTopLeft(extent),
		extent: extent,
		resolutions: resolutions
	})
});

var map;
//proj4.defs("EPSG:2193","+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu");

// Set transform functions, taken from proj4
/*
var forward = proj4('EPSG:4326','EPSG:2193').forward,
	inverse = proj4('EPSG:4326','EPSG:2193').inverse;
	*/

// Create new projection
//var proj2193 = new OpenLayers.Projection("EPSG:2193");


// Add transforms
/*
ol.proj.addCoordinateTransforms('EPSG:4326', proj2193,
    forward,
    inverse
);
var tileGridOptions = {
	origin: originCoord,
	resolutions: resolutions,
	matrixIds: matrixIds
};
var tileGrid = new ol.tilegrid.WMTS(tileGridOptions);
*/
//var resolutions = [2822.2278666779557, 1411.1139333389779, 705.5569666694889, 352.77848333474446, 176.38924166737223, 88.19462083368612, 35.277848333474445, 17.638924166737223, 8.819462083368611, 3.5277848333474453];

/*
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
	source: src,
	visible: true
});
*/

var videoLayer = new ol.layer.Tile({
			source: source
		});
map = new ol.Map({
	layers: [
		//lyr,
		wmsLayer,
		videoLayer
	],
	target: 'map',
	view: view
});
videoLayer.on('postcompose', function(event) {

	var frameState = event.frameState;
	var resolution = frameState.viewState.resolution;
	//console.log('FS', frameState, resolution);
	console.log('postcompose', event);
	//var origin = map.getPixelFromCoordinate(topLeft);

	/*

  var context = event.context;
  context.save();

  context.scale(frameState.pixelRatio, frameState.pixelRatio);
  context.translate(origin[0], origin[1]);
  context.rotate(rotation);
  context.drawImage(video, 0, 0, dx / resolution, height / resolution);

  context.restore();
  */
});
