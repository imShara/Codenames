// Global ----------------------------------

/**
 * Launch fullscreen mode
 * @param {Element} element - Which element should be
 *                            opened in fullscreen mode
 */
function launchFullScreen(element) {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}


/**
 * Exit fullscreen mode
 */
function cancelFullScreen() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}


function toggleFullScreen() {
  if (document.fullScreenElement || 
      document.mozFullScreenElement ||
      document.webkitFullScreenElement) {
    cancelFullScreen();
  } else {
    launchFullScreen(document.body);
  }
}


/**
 * Load JSON from url
 * @param {string} path - path to file
 * @param {function} success - callback with JSON object
 * @param {error} error - callback with error response
 */
function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) {
          success(JSON.parse(xhr.responseText));
        }
      } else {
        if (error) {
           error(xhr);
        }
      }
    }
  }

  xhr.open("GET", path, true);
  xhr.send();
}


/**
 * Returns random integer from diapason
 * @param {integer} min - Minimal random value (include)
 * @param {integer} max - Maximal random value (not inc)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function parseId(id) {
  return parseInt(id.substr(1));
}


function clickedInsideId(target, id) {
  var parent = target;

  do {
    if (parent.id == id) {
      return true;
    }
  } while (parent = parent.parentNode);

  return false;
}