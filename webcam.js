var mirrorWriterMediaStream = null;

function setStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function startWebcamVideo() {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);
  var video = document.getElementById('webcam-video');
  var canvas = document.getElementById('webcam-canvas');
  var ctx = canvas.getContext('2d');

  function errorCallback() {
    setStatus('Some error.');
  }

  function snapshot() {
    if (mirrorWriterMediaStream) {
      ctx.drawImage(video, 0, 0);
      // "image/webp" works in Chrome.
      // Other browsers will fall back to image/png.
      document.getElementById('webcam-image').src = canvas.toDataURL('image/webp');
    }
  }

  //video.addEventListener('click', snapshot, false);

  navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    mirrorWriterMediaStream = stream;
  }, errorCallback);
}

function stopWebcamVideo() {
  stopStream(mirrorWriterMediaStream);
}

function stopStream(stream) {
  stream.getVideoTracks().forEach(function (track) {
    track.stop();
  });
}

function addSidebar() {
  var sidebar;
  $('body').css({
   'padding-right': '350px'
  });
  sidebar = $("<div id='mirror-author-sidebar'></div>");
  sidebar.css({
   'position': 'fixed',
   'right': '0px',
   'top': '0px',
   'z-index': 9999,
   'width': '290px',
   'height': '100%',
   'background-color': 'black'  // Confirm it shows up
  });
  $('body').append(sidebar);
}

function addWebcamToSidebar() {
  $('#mirror-author-sidebar')
  .append('<div id="status"></div>')
  .append('<video id="webcam-video" autoplay></video>')
  .append('<img id="webcam-image" src="">')
  .append('<canvas id="webcam-canvas" style="display:none;"></canvas>')

  $('#webcam-video').css({
    'max-width': '290px',
  });

  $('#mirror-author-sidebar').click(function() {
    closeWebcamSidebar();
  });
}

function openWebcamSidebar() {
  if ($('#mirror-author-sidebar').length) {
    closeWebcamSidebar();
  } else {
    addSidebar();
    addWebcamToSidebar();
    startWebcamVideo();
  }
}

function closeWebcamSidebar() {
  stopWebcamVideo();
  removeSidebar();
}
function removeSidebar() {
  $('#mirror-author-sidebar').remove();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.message) {
          case 'openWebcamSidebar':
            openWebcamSidebar();
            sendResponse({message: "success"});
            break;
          default:
            break;
        }
});
