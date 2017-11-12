var webcam = function(opts) {
  if (!opts) opts = {};
  this.video = document.createElement("video");
};

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.msGetUserMedia;

webcam.prototype.fallBack = function() {
  this.video.crossOrigin = "anonymous";
  this.video.loop = true;
  this.video.src = "https://i.imgur.com/RoRyYhy.mp4";
  this.video.type = "video/mp4";
  this.video.play();
};

webcam.prototype.handleUserMedia = function(stream) {
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

webcam.prototype.requestUserMedia = function() {
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
        this.fallBack();
      });
  } else {
    navigator.getUserMedia(
      constraints,
      stream => {
        this.handleUserMedia(stream);
      },
      error => {
        this.fallBack();
      }
    );
  }
};

module.exports = webcam;
