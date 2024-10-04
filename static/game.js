var userOpenedAlert = false;

function setInnerText(element, value) {
  if (element.innerText) {
    element.innerText = value;
  } else {
    element.textContent = value;
  }
}

function levelSolved() {
  if (!userOpenedAlert) {
    return;
  }

  var oReq = new XMLHttpRequest();
  oReq.onload = function () { 
    if (oReq.readyState != 4) return;
    document.getElementById('next-controls').style.display = "block";
    eval(oReq.responseText);
  };
  oReq.open("GET", window.location.toString() + '/record', true);
  oReq.send();
}

window.addEventListener("message", function(event) {
  let data = event.data;

  // Handle cases where event.data might be an object
  if (typeof data === 'object' && data !== null) {
    if (data.type === "success") {
      userOpenedAlert = true;
      levelSolved();
      return;
    }
    if (data.url) {
      updateURLBar('1', data.url);
    }
  } else {
    if (data === "success") {
      userOpenedAlert = true;
      levelSolved();
      return;
    }
    updateURLBar('1', data);
  }
}, false);


function updateURLBar(frameNum, value) {
  var urlbar = document.getElementById('input' + frameNum);
  urlbar.value = unescape(value);
}

function updateFrame(frameNum, url) {
  if (!url) {
    var urlbar = document.getElementById('input' + frameNum); 
    url = urlbar.value;
  };

  // Make sure that the URL points to the frame of the current level
  var frameLink = document.createElement('a');
  frameLink.href = url;

  if (!url.match(/^https?:/) ||
      frameLink.protocol != location.protocol ||
      frameLink.hostname != location.hostname ||
      frameLink.pathname.replace(/^\//, '').search(location.pathname.replace(/^\//, '')) != 0 ||
      frameLink.pathname.search('(\\.|%2[eE])(\\.|%2[eE])') >= 0) {
        alert("Sorry, I can't navigate the frame to that URL.");
    return;
  } else {
    var frame = document.querySelector('iframe');
    frame.src = url; 
    frame.contentWindow.postMessage(url, "*");
  }
};

function toggleCode() {
  var codeFrame = document.getElementById('source-frame');
  if (getComputedStyle(codeFrame, '').display != "none") {
    codeFrame.style.display = "none";
    logXHR('/code/0')
  } else {
    codeFrame.style.display = "inline";
    logXHR('/code/1')
  }

  
  return false;
}

function logXHR(path) {
  // window.location.toString().match(/level(\d+)/);
  // var lNum = RegExp.$1 || "0";

  // var oReq = new XMLHttpRequest();
  // oReq.open("GET", '/feedback/level' + lNum + path, true);
  // oReq.send();
}


function showHint() {
  var firstHiddenHint = document.querySelector('#hints li[data-hidden]');
  if (!firstHiddenHint)
    return;

  firstHiddenHint.style.display = "block";
  firstHiddenHint.removeAttribute('data-hidden');
  window.scroll(0, document.body.clientHeight);

  var hintNumEl = document.getElementById('hint-num');
  var hintNum = parseInt(hintNumEl.innerHTML, 10) + 1;
  setInnerText(hintNumEl, hintNum);

  logXHR('/hint/' + hintNum)
}

function sendFeedbackResponse(question, value) {

  var oReq = new XMLHttpRequest();
  oReq.open("GET", '/feedback/' + question + '/' + value, true);
  oReq.send();

  setInnerText(document.getElementById('question-' + question), "Thanks!");

}

function selectFile(el, file_name) {
  var selector_container = el.parentNode;
  for (var i = 0; i < selector_container.children.length; i++) {
    var child = selector_container.children[i];
    if (child == el) {
      child.className = child.className + " selected";
    } else {
      child.className = child.className.replace(/ selected/g, "");
    }
  }

  var container = document.getElementById('multi-examples');
  for (var i = 0; i < container.children.length; i++) {
    var child = container.children[i];
    if (child.id == file_name) {
      child.className = "selected";
    } else {
      child.className = "";
    }
  }

  document.getElementById(file_name).className = "selected";
  logXHR("/file/" + file_name);
}

function setInputFieldReturnHandler() {
  var inputField = document.getElementById('input1');
  if (!inputField) {
    return;
  }
  inputField.value = document.querySelector('iframe').src;
  inputField.onkeyup = function (e) {
    if (e.keyCode == 13) {
      updateFrame(1);
      return false;
    }
  }
}
