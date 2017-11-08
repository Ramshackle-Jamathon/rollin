# Keep Rollin'
[![Keep Rollin'](https://img.youtube.com/vi/RYnFIRc0k6E/0.jpg)](https://www.youtube.com/watch?v=RYnFIRc0k6E&feature=youtu.be&t=31)
## Installation

```
$ npm install keep-rollin
```

## Usage

```javascript
var Webcam = require("keep-rollin");

var webcam = new Webcam();

var webcamTexture;
function renderLoop(){
	if(webcam.video.readyState === webcam.video.HAVE_ENOUGH_DATA) {
		if(webcamTexture) {
			webcamTexture.setPixels(webcam.video);
		} else {
			webcamTexture = funcThatMakesATextureFromAStream(webcam.video);
		} 
		this.shader.uniforms.uWebcamTexture = this.webcamTexture.bind();
	}
	/*

		...doing neat things

	*/
	window.requestAnimationFrame(renderLoop);
}
window.requestAnimationFrame(renderLoop);
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-developing-yellow.svg)
