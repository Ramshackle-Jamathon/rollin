var webcam = function(opts){
	if ( !opts ) opts = {};
	this.stream = undefined;
	this.hasUserMedia = false;
	this.video = document.createElement("video");
	this.audioSource = opts.audioSource || undefined;
	this.videoSource = opts.videoSource || undefined;
	this.minWidth = opts.minWidth || 1280;
	this.minHeight = opts.minHeight || 720;
	this.minFrameRate = opts.minFrameRate || 60;
}

webcam.prototype.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

webcam.prototype.handleUserMedia = function(error, stream){
	if (error) {
		console.error(error);
		return;
	}
	this.video.src = window.URL.createObjectURL(stream);
	this.stream = stream;
	this.hasUserMedia = true;
}

webcam.prototype.sourceSelected = function(){
	var constraints = {
		video: {
			mandatory: {},
			optional: [
				{sourceId: this.videoSource},
				{minWidth: 1280},
				{minHeight: 720},
				{minFrameRate: 60}
			]
		}
	};

	if (false) {
		constraints.audio = {
			optional: [{sourceId: this.audioSource}]
		};
	}

	this.getUserMedia(constraints,(stream) => {
		this.handleUserMedia(null, stream);
	}, (e) => {
		this.handleUserMedia(e);
	});
}

webcam.prototype.requestUserMedia = function(){
	if (this.audioSource && this.videoSource) {
		this.sourceSelected();
	} 
	else {
		if ("mediaDevices" in navigator) {
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				devices.forEach((device) => {
					if (device.kind === "audio") {
						this.audioSource = device.id;
					} 
					else if (device.kind === "video") {
						this.videoSource = device.id;
					}
				});
				this.sourceSelected();
			})
			.catch((error) => {
				console.log(`${error.name}: ${error.message}`); // eslint-disable-line no-console
			});
		} 
		else {
			MediaStreamTrack.getSources((sources) => {
				sources.forEach((source) => {
					if (source.kind === "audio") {
						this.audioSource = source.id;
					} 
					else if (source.kind === "video") {
						this.videoSource = source.id;
					}
				});
				this.sourceSelected();
			});
		}
	}
}

module.exports = webcam;
