function setStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function getWebcamVideo() {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);
  var video = document.getElementById('webcam-video');
  var canvas = document.getElementById('webcam-canvas');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  function errorCallback() {
    setStatus('Some error.');
  }

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0);
      // "image/webp" works in Chrome.
      // Other browsers will fall back to image/png.
      document.getElementById('webcam-image').src = canvas.toDataURL('image/webp');
    }
  }

  video.addEventListener('click', snapshot, false);

  navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }, errorCallback);
}

document.addEventListener('DOMContentLoaded', function() {
  getWebcamVideo();
});
