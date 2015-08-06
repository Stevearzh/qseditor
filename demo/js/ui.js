function $id(id) {
  return document.getElementById(id);
}

function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

// qseditor UI

var qseMd = $id('qseMd');
var qseBBC = $id('qseBBC');

qseMd.onclick = function() {
  removeClass(qseMd, 'qse-mode-clear');
  addClass(qseBBC, 'qse-mode-clear');
}

qseBBC.onclick = function() {
  removeClass(qseBBC, 'qse-mode-clear');
  addClass(qseMd, 'qse-mode-clear');
}

//qseImgUploader
function Output(msg) {
  var m = $id("messages");
  m.innerHTML = msg + m.innerHTML;
}

if (window.File && window.FileList && window.FileReader) {
  Init();
}

function Init() {
  var fileselect = $id('qseFileSelect'),
    filedrag = $id('qseMain');

  fileselect.addEventListener('change', FileSelectHandler, false);

  if (typeof XMLHttpRequest !== 'undefined') {
    xhr = new XMLHttpRequest();
  } else {
    var versions = ["MSXML2.XmlHttp.5.0", 
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0", 
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"]
 
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch(e) {}
    } // end for
  }
  
  if (xhr.upload) {
    filedrag.addEventListener('dragover', FileDragHover, false);
    filedrag.addEventListener('dragleave', FileDragHover, false);
    filedrag.addEventListener('drop', FileSelectHandler, false);
  }
}

function FileDragHover(event) {
  event.stopPropagation();
  event.preventDefault();
  event.type === 'dragover' ? addClass($id('qseMain'), 'hover') : removeClass($id('qseMain'), 'hover');
  event.type === 'dragover' ? addClass($id('qseImgUploader'), 'hover') : removeClass($id('qseImgUploader'), 'hover');
}

function FileSelectHandler(e) {
  FileDragHover(e);

  var files = e.target.files || e.dataTransfer.files;

  for (var i = 0, f; f = files[i]; i++) {
    ParseFile(f);
  }
}

function ParseFile(file) {
  Output(
    '<p>File information: <strong>' + file.name +
      '</strong> type: <strong>' + file.type +
      '</strong> size: <strong>' + file.size +
      '</strong> bytes</p>'
  );
}
