var webcam = function(opts) {
  if (!opts) opts = {};
  this.stream = undefined;
  this.hasUserMedia = false;
  this.video = document.createElement("video");
  this.source = document.createElement("source");
  this.audioSource = opts.audioSource || undefined;
  this.videoSource = opts.videoSource || undefined;
  this.minWidth = opts.minWidth || 1280;
  this.minHeight = opts.minHeight || 720;
  this.minFrameRate = opts.minFrameRate || 60;
};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

webcam.prototype.handleUserMedia = function(stream) {
  this.source = stream;
  if (navigator.mozGetUserMedia) {
    this.video.mozSrcObject = stream;
  } else {
    var vendorURL = window.URL || window.webkitURL;
    this.video.src = vendorURL.createObjectURL(stream);
  }
  this.video.play();
  this.stream = stream;
  this.hasUserMedia = true;
};

webcam.prototype.sourceSelected = function() {
  var constraints = {
    audio: false,
    video: { width: 1280, height: 720 }
  };
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        this.handleUserMedia(stream);
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    navigator.getUserMedia(
      constraints,
      stream => {
        this.handleUserMedia(stream);
      },
      error => {
        console.error(error);
      }
    );
  }
};

webcam.prototype.requestUserMedia = function() {
  if (this.audioSource && this.videoSource) {
    this.sourceSelected();
  } else {
    if ("mediaDevices" in navigator) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          devices.forEach(device => {
            if (device.kind === "audio") {
              this.audioSource = device.id;
            } else if (device.kind === "video") {
              this.videoSource = device.id;
            }
          });
          this.sourceSelected();
        })
        .catch(error => {
          console.log(`${error.name}: ${error.message}`); // eslint-disable-line no-console
        });
    } else {
      MediaStreamTrack.getSources(sources => {
        sources.forEach(source => {
          if (source.kind === "audio") {
            this.audioSource = source.id;
          } else if (source.kind === "video") {
            this.videoSource = source.id;
          }
        });
        this.sourceSelected();
      });
    }
  }
};

module.exports = webcam;
