function $id(id) {
  return document.getElementById(id);
}

function Create(element) {
  return document.createElement(element);
}

function Text(text) {
  return document.createTextNode(text);
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

// generate editor

var qse = $id('qse');
qse.className = 'qse';

  var qseNav = Create('div');
  qseNav.className = "qse-nav";
  qse.appendChild(qseNav);

    var qseMd = Create('div');
    qseMd.className = 'qse-mode qse-md';
    qseMd.id = 'qseMd';
    qseNav.appendChild(qseMd);

      var textMd = Text('Markdown');
      qseMd.appendChild(textMd);

    var qseBBC = Create('div');
    qseBBC.className = 'qse-mode qse-bbc qse-mode-clear';
    qseBBC.id = 'qseBBC';
    qseNav.appendChild(qseBBC);

      var textBBC = Text('BBCode');
      qseBBC.appendChild(textBBC);

    var qsePreview = Create('div');
    qsePreview.className = 'qse-action qse-preview';
    qsePreview.id = 'qsePreview';
    qseNav.appendChild(qsePreview);

      var textPreview = Text('预览');
      qsePreview.appendChild(textPreview);

    var qseFullscreen = Create('div');
    qseFullscreen.className = 'qse-action qse-fullscreen';
    qseFullscreen.id = 'qseFullscreen';
    qseNav.appendChild(qseFullscreen);

      var textFullscreen = Text('全屏');
      qseFullscreen.appendChild(textFullscreen);

  var qseFace = Create('div');
  qseFace.className = "qse-face";
  qse.appendChild(qseFace);

    var qseMain = Create('div');
    qseMain.className = 'qse-main';
    qseMain.id = 'qseMain';
    qseFace.appendChild(qseMain);

      var qseArea = Create('textarea');
      qseArea.className = 'qse-area';
      qseArea.id = 'qseArea';
      qseMain.appendChild(qseArea);

      var qseImgUploader = Create('form');
      qseImgUploader.className = 'qse-img-uploader';
      qseImgUploader.id = 'qseImgUploader';
      qseImgUploader.enctype = 'multipart/form-data';
      qseImgUploader.method = 'POST';
      qseMain.appendChild(qseImgUploader);

        var innerUploader = Create('fieldset');
        qseImgUploader.appendChild(innerUploader);

          var hiddenInput = Create('input');
          hiddenInput.className = 'qse-img-uploader-hidden';
          hiddenInput.id = 'MAX_FILE_SIZE';
          hiddenInput.name = 'MAX_FILE_SIZE';
          hiddenInput.type = 'hidden';
          hiddenInput.value = 3000;
          innerUploader.appendChild(hiddenInput);

          var innerDiv = Create('div');
          innerUploader.appendChild(innerDiv);

            var qseFileSelect = Create('input');
            qseFileSelect.className = 'qse-img-uploader-drag';
            qseFileSelect.id = 'qseFileSelect';
            qseFileSelect.multiple = 'multiple';
            qseFileSelect.name = 'fileselect[]';
            qseFileSelect.type = 'file';
            innerDiv.appendChild(qseFileSelect);

            var qseImgUploaderInfo = Create('div');
            qseImgUploaderInfo.className = 'qse-img-uploader-information';
            qseImgUploaderInfo.id = 'qseImgUploaderInfo';
            innerDiv.appendChild(qseImgUploaderInfo);

              var textUploaderInfo = Text('拖动图片至此处，复制粘贴，或点击');
              qseImgUploaderInfo.appendChild(textUploaderInfo);

              var qseClickHere = Create('span');
              qseClickHere.className = 'qse-img-uploader-click-here';
              qseClickHere.id = 'qseClickHere';
              qseImgUploaderInfo.appendChild(qseClickHere);

                var textClickHere = Text('这里');
                qseClickHere.appendChild(textClickHere);

              var textUploaderInfob = Text('上传');
              qseImgUploaderInfo.appendChild(textUploaderInfob);

    var qseSubmit = Create('button');
    qseSubmit.className = 'qse-submit';
    qseSubmit.id = 'qseSubmit';
    qseFace.appendChild(qseSubmit);

      var textSubmit = Text('提交');
      qseSubmit.appendChild(textSubmit);

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
    document.body.addEventListener('dragover', DocumentListener, false);    
    document.body.addEventListener('dragleave', DocumentListener, false);    
    document.body.addEventListener('drop', DocumentListener, false);    
    filedrag.addEventListener('dragover', FileDragHover, false);
    filedrag.addEventListener('dragleave', FileDragHover, false);
    filedrag.addEventListener('drop', FileSelectHandler, false);
  }
}

function DocumentListener(event) {
  event.preventDefault();
  return false;
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

$id('qseClickHere').onclick = function() {
  $id('qseFileSelect').click();
}
