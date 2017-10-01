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

ol.VideoTile = function(tileCoord, state, src, crossOrigin, tileLoadFunction) {

  ol.Tile.call(this, tileCoord, state);

  /**
   * Image URI
   *
   * @private
   * @type {string}
   */
  this.src_ = src;

  /**
   * @private
   * @type {Image|HTMLCanvasElement|HTMLVideoElement}
   */
  this.image_ = document.createElement('video');
	this.image_.autoplay = 'autoplay';
	this.image_.loop = 'loop';
  if (crossOrigin !== null) {
    this.image_.crossOrigin = crossOrigin;
  }

  /**
   * @private
   * @type {Array.<ol.EventsKey>}
   */
  this.imageListenerKeys_ = null;

  /**
   * @private
   * @type {ol.TileLoadFunctionType}
   */
  this.tileLoadFunction_ = tileLoadFunction;

};
ol.inherits(ol.VideoTile, ol.ImageTile);
/*
function reset() {
	videos.map((v) => v.currentTime = 1/6);
}
*/
ol.VideoTile.prototype.handleImageLoad_ = function() {
  if (this.image_.videoWidth && this.image_.videoHeight) {
	this.image_.width = this.image_.videoWidth;
	this.image_.height = this.image_.videoHeight;
    this.state = ol.TileState.LOADED;
	  //this.image_.play();
	ol.events.listen(this.image_, 'timeupdate', this.timeUpdated, this);
	  //reset();
  } else {
    this.state = ol.TileState.EMPTY;
  }
  this.unlistenImage_();
  this.changed();
};
//oncanplaythrough
ol.VideoTile.prototype.load = function() {
  if (this.state == ol.TileState.IDLE || this.state == ol.TileState.ERROR) {
    this.state = ol.TileState.LOADING;
    this.changed();
    this.imageListenerKeys_ = [
      ol.events.listenOnce(this.image_, ol.events.EventType.ERROR,
          this.handleImageError_, this),
	//ol.events.listen(this.image_, 'progress', this.progress, this),
	//ol.events.listenOnce(this.image_, 'loadeddata', this.loadedData, this),
	//ol.events.listen(this.image_, 'timeupdate', this.timeUpdated, this),
      ol.events.listenOnce(this.image_, 'canplay',
      //ol.events.listenOnce(this.image_, ol.events.EventType.LOAD,
          this.handleImageLoad_, this)
    ];
    this.tileLoadFunction_(this, this.src_);
  }
};
ol.VideoTile.prototype.someLoaded = function(event) {
	var seekable = this.image_.seekable;
	var len = seekable && seekable.length;
	//console.log('synching?');
	if (!seekable) {
		return;
	}
	var layer = this.layer;
	var time = layer && layer.currentTime % this.image_.duration || 0;
	if (layer && layer.currentDate) {
		time += ((new Date()).getTime() - layer.currentDate) / 1000; // account for passed in code until now
	}
	for (var i = 0; i < len; ++i) {
		if (seekable.start(i) <= time && time <= seekable.end(i)) {
			this.image_.currentTime = time;
			//console.log('synced', this.image_.currentTime);
			return;
		}
	}
};
ol.VideoTile.prototype.timeUpdated = function(event) {
	//console.log('timeupdate');
	let video = this.getImage();
	var currentTime = video.currentTime;
	var videos = this.layer && this.layer.videos;
	if (videos && videos.length) {
		let duration = video.duration || 0;
		let latestTime = videos.map((v) => v.currentTime).reduce((a, time) => time && Math.max(a, time % duration) || currentTime, currentTime);
		if (latestTime < duration && latestTime > currentTime + 1/30) { // assume close enough HACK
			//videos.filter((v) => v !== video).map((v) => v.currentTime = latestTime);
			video.currentTime = latestTime;
		} else if (latestTime === 0 && duration > 0) {
			video.currentTime = 0; // need to reset
		}
	}
};
ol.VideoTile.prototype.progress = function(event) {
	return this.someLoaded(event, false);
};
ol.VideoTile.prototype.loadedData = function(event) {
	return this.someLoaded(event, false);
};
ol.source.VideoXYZ = function(opt_options) {
  var options = opt_options || {};
  //options.tileClass = ol.VideoTile;
  var projection = options.projection !== undefined ?
    options.projection : 'EPSG:3857';

  var tileGrid = options.tileGrid !== undefined ? options.tileGrid :
    ol.tilegrid.createXYZ({
      extent: ol.tilegrid.extentFromProjection(projection),
      maxZoom: options.maxZoom,
      minZoom: options.minZoom,
      tileSize: options.tileSize
    });

  ol.source.TileImage.call(this, {
    attributions: options.attributions,
    cacheSize: options.cacheSize,
    crossOrigin: options.crossOrigin,
    logo: options.logo,
    opaque: options.opaque,
    projection: projection,
    reprojectionErrorThreshold: options.reprojectionErrorThreshold,
    tileGrid: tileGrid,
    tileLoadFunction: options.tileLoadFunction,
    tilePixelRatio: options.tilePixelRatio,
    tileUrlFunction: options.tileUrlFunction || this.tileUrlFunction,
    url: options.url,
    urls: options.urls,
    wrapX: options.wrapX !== undefined ? options.wrapX : true,
	tileClass: ol.VideoTile
  });

};
ol.inherits(ol.source.VideoXYZ, ol.source.XYZ);
/*
ol.source.VideoXYZ.prototype.tileLoadFunction = function(tile, url) {

}
*/
ol.source.VideoXYZ.prototype.tileUrlFunction = function(coord) {
	var url = 'https://npm.landcareresearch.co.nz/videos/{z}/000/000/{x}/000/000/{y}.mp4';
	var y = coord[2];
	var x = coord[1];
	var z = coord[0];
	var myUrl = url.replace('{z}', z.padLeft(2)).replace('{x}', x.padLeft(3)).replace('{y}', y.padLeft(3));
	//return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
	return myUrl;
};
ol.layer.VideoTile = function(opt_options) {
  var options = opt_options ? opt_options : {};

  var baseOptions = ol.obj.assign({}, options);

  delete baseOptions.preload;
  delete baseOptions.useInterimTilesOnError;
	//baseOptions.preload = 9999;
  ol.layer.Layer.call(this,  /** @type {olx.layer.LayerOptions} */ (baseOptions));

  this.setPreload(options.preload !== undefined ? options.preload : 0);
  this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ?
    options.useInterimTilesOnError : true);

  /**
   * The layer type.
   * @protected
   * @type {ol.LayerType}
   */
  this.type = ol.LayerType.TILE;

	this.currentTime = 0;
	//var videos = [];
	this.videos = [];
	//var highestTime = 0;
	//var paused = this.isPaused();
	var that = this;
	this.timePerFrame = 1/60;
	this.on('postcompose', function(event) {
		var frameState = event.frameState;
		var source = this.getSource();
		var tileGrid = source.getTileGrid();
		var extent = frameState.extent;
		var ctx = event.context;
		var tileSize = source.tileGrid.getTileSize();
		var halfSize = tileSize / 2;
		that.videos.length = 0;
		ctx.save();
		ctx.scale(frameState.pixelRatio, frameState.pixelRatio);
		tileGrid.forEachTileCoord(extent, view.getZoom(), function(tileCoord) {
			var tileCoordCenter = source.tileGrid.getTileCoordCenter(tileCoord);
			var middlePixel = map.getPixelFromCoordinate(tileCoordCenter);
			var topLeft = ol.coordinate.add(middlePixel, [-halfSize, -halfSize]);
			var tile = source.getTile(tileCoord[0], tileCoord[1], tileCoord[2], 1, proj2193);
			var video = tile.getImage();
			//that.currentTime = Math.max(video.currentTime, that.currentTime);
			//that.currentDate = (new Date()).getTime();
			//video.currentTime += 1000/30;
			that.videos.push(video);
			tile.layer = that;
			//highestTime = Math.max(video.currentTime, highestTime);
			ctx.drawImage(video, topLeft[0], topLeft[1]);
		});
		ctx.restore();
	});
	//setInterval(() => videos.map((v) => v.currentTime = highestTime), 1000);
};
ol.inherits(ol.layer.VideoTile, ol.layer.Tile);
ol.layer.VideoTile.prototype.isPaused = function() {
	return this.paused;
};
ol.layer.VideoTile.prototype.pause = function() {
	this.paused = true;
}


Number.prototype.padLeft = function (n,str){
    return Array(n-String(this).length+1).join(str||'0')+this;
}
var tiles = {};
function getUrl(coord) {
	var url = 'https://npm.landcareresearch.co.nz/videos/{z}/000/000/{x}/000/000/{y}.mp4';
	var x = coord[1];
	var y = coord[2];
	var z = coord[0];
	var myUrl = url.replace('{z}', z.padLeft(2)).replace('{x}', x.padLeft(3)).replace('{y}', y.padLeft(3));
	return myUrl;
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
    var url = 'https://npm.landcareresearch.co.nz/videos/';
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

var extent = [1000000, 4700000.0000001, 2200000, 6300000];
var proj2193 = new ol.proj.Projection({
  code: 'EPSG:2193',
  extent: extent,
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
var source = new ol.source.VideoXYZ({
	crossOrigin: 'anonymous',
	url: 'https://npm.landcareresearch.co.nz/videos/{z}/{x}/{y}.mp4',
	/*
	tileLoadFunction: function(imageTile, src) {
		//console.log('imageTile',imageTile.tileCoord)
		var coord = imageTile.tileCoord;
		var y = -coord[2] - 1;
		imageTile.getImage().src = getUrl(coord);
	},
	tileUrlFunction: function(coord) {
		//console.log('COORD', coord);
		return getUrl(coord);
	},
	*/
	projection: proj2193,
	tileGrid: new ol.tilegrid.TileGrid({
		origin: ol.extent.getBottomLeft(extent),
		extent: extent,
		resolutions: resolutions
	})
});

var map;

var videoLayer = new ol.layer.VideoTile({
	source: source,
	extent: extent
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
/*
videoLayer.on('postcompose', function(event) {
	var frameState = event.frameState;
	var resolution = frameState.viewState.resolution;
});
*/
var timeSlider = document.getElementById('time');
var time = 0;
var timePerFrame = 1/60;
var currentDate = new Date();
var f = function() {
	var newDate = new Date();
	timePerFrame = (newDate.getTime() - currentDate.getTime()) / 1000;
	currentDate = newDate;
	videoLayer.timePerFrame = timePerFrame;
	map.render();
	requestAnimationFrame(f);
	//var index = videos.length - 1;
	//time = videos[index] && videos[index].currentTime || 0;
	//time += 1/30;
	//time %= 30;
	//console.log(time);
	//timeSlider.value = time;
};
/*
setInterval(f, 1000/30);
*/
f();
/*
map.on('moveend', function() {
	//videos.map((v) => v.currentTime = videos[videos.length - 1].currentTime);
});
*/
//document.getElementById('reset').addEventListener('click', reset);
//document.getElementById('pause').addEventListener('click', () => videos.map((v) => v.pause()));
//document.getElementById('start').addEventListener('click', () => videos.map((v) => v.play()));

