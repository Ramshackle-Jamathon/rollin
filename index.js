var webcam = function(opts){
	if ( !opts ) opts = {};
	this.stream = undefined;
	this.hasUserMedia = false;
	this.video = document.createElement("video");
	this.video.muted = true;
	this.audioSource = opts.audioSource || undefined;
	this.videoSource = opts.videoSource || undefined;
	this.minWidth = opts.minWidth || 1280;
	this.minHeight = opts.minHeight || 720;
	this.minFrameRate = opts.minFrameRate || 60;
}


// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
	navigator.mediaDevices = {};
  }
  
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
	navigator.mediaDevices.getUserMedia = function(constraints) {
  
	  // First get ahold of the legacy getUserMedia, if present
	  var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
	  // Some browsers just don't implement it - return a rejected promise with an error
	  // to keep a consistent interface
	  if (!getUserMedia) {
		return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	  }
  
	  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
	  return new Promise(function(resolve, reject) {
		getUserMedia.call(navigator, constraints, resolve, reject);
	  });
	}
  }

webcam.prototype.handleUserMedia = function(error, stream){
	if (error) {
		console.error(error);
		return;
	}
	try {
		this.video.srcObject = stream;
	} catch (error) {
		this.video.src = URL.createObjectURL(stream);
	}
	this.stream = stream;
	this.hasUserMedia = true;
	this.video.play();
}

webcam.prototype.requestUserMedia = function(){
	var constraints = {
		video: {
			width: { ideal: this.minWidth },
			height: { ideal: this.minHeight },
			frameRate: { ideal: this.minFrameRate }, 
		}
	};

	navigator.mediaDevices.getUserMedia(constraints)
		.then((stream) => {
			this.handleUserMedia(null, stream);
		})
		.catch(this.handleUserMedia);
}

module.exports = webcam;
