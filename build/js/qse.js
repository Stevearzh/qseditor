function $id(id) {
  return document.getElementById(id);
}

HTMLElement.prototype.hasClass = function(className) {
  
}

Object.defineProperty(HTMLElement.prototype, 'hasClass', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function(className) {
    return !!this.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));   
  }
});

Object.defineProperty(HTMLElement.prototype, 'addClass', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function(className) {
    if (!this.hasClass(className)) {
      this.className += ' ' + className;
    }
  }
});

Object.defineProperty(HTMLElement.prototype, 'removeClass', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function(className) {
    if (this.hasClass(className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      this.className = this.className.replace(reg, ' ');
    }
  }
});

function newNode(parentNodeId, param) {
  var element;
  
  if (param['isTextNode']) {
    element = document.createTextNode(param['text']);
  } else {
    element = document.createElement(param['nodeType']);
    param['className'] ? element.className = param['className'] : '';
    param['id'] ? element.id = param['id'] : '';
    param['enctype'] ? element.enctype = param['enctype'] : '';
    param['method'] ? element.method = param['method'] : '';
    param['name'] ? element.name = param['name'] : '';
    param['type'] ? element.type = param['type'] : '';
    param['value'] ? element.value = param['value'] : '';
  }
  
  $id(parentNodeId).appendChild(element);
}

// generate editor
(function() {
  $id('qse').className = 'qse';

  newNode('qse', {
    'nodeType': 'div',
    'className': 'qse-nav',
    'id': 'qseNav'
  });

  newNode('qseNav', {
    'nodeType': 'div',
    'className': 'qse-mode qse-md',
    'id': 'qseMd'
  });

  newNode('qseMd', {
    'isTextNode': true,
    'text': 'Markdown'
  });

  newNode('qseNav', {
    'nodeType': 'div',
    'className': 'qse-mode qse-bbc qse-mode-clear',
    'id': 'qseBBC'
  });

  newNode('qseBBC', {
    'isTextNode': true,
    'text': 'BBCode'
  });

  newNode('qseNav', {
    'nodeType': 'div',
    'className': 'qse-action qse-preview',
    'id': 'qsePreview'
  });

  newNode('qsePreview', {
    'isTextNode': true,
    'text': '预览'
  });

  newNode('qseNav', {
    'nodeType': 'div',
    'className': 'qse-action qse-fullscreen',
    'id': 'qseFullscreen'
  });

  newNode('qseFullscreen', {
    'isTextNode': true,
    'text': '全屏'
  });

  newNode('qse', {
    'nodeType': 'div',
    'className': 'qse-face',
    'id': 'qseFace'
  });

  newNode('qseFace', {
    'nodeType': 'div',
    'className': 'qse-main',
    'id': 'qseMain'
  });

  newNode('qseMain', {
    'nodeType': 'textarea',
    'className': 'qse-area',
    'id': 'qseArea'
  });

  newNode('qseMain', {
    'nodeType': 'form',
    'className': 'qse-img-uploader',
    'id': 'qseImgUploader',
    'enctype': 'multipart/form-data',
    'method': 'POST'
  });

  newNode('qseImgUploader', {
    'nodeType': 'fieldset',
    'id': 'innerUploader'
  });

  newNode('innerUploader', {
    'nodeType': 'input',
    'className': 'qse-img-uploader-hidden',
    'id': 'MAX_FILE_SIZE',
    'name': 'MAX_FILE_SIZE',
    'type': 'hidden',
    'value': 3000
  });

  newNode('innerUploader', {
    'nodeType': 'div',
    'id': 'innerDiv'
  });

  newNode('innerDiv', {
    'nodeType': 'input',
    'className': 'qse-img-uploader-drag',
    'id': 'qseFileSelect',
    'multiple': 'multiple',
    'name': 'fileselect[]',
    'type': 'file'
  });

  newNode('innerDiv', {
    'nodeType': 'div',
    'className': 'qse-img-uploader-information',
    'id': 'qseImgUploaderInfo'
  });

  newNode('qseImgUploaderInfo', {
    'isTextNode': true,
    'text': '拖动图片至此处，复制粘贴，或点击'
  });

  newNode('qseImgUploaderInfo', {
    'nodeType': 'span',
    'className': 'qse-img-uploader-click-here',
    'id': 'qseClickHere'
  });

  newNode('qseClickHere', {
    'isTextNode': true,
    'text': '这里'
  });

  newNode('qseImgUploaderInfo', {
    'isTextNode': true,
    'text': '上传'
  });

  newNode('qseFace', {
    'nodeType': 'button',
    'className': 'qse-submit',
    'id': 'qseSubmit'
  });

  newNode('qseSubmit', {
    'isTextNode': true,
    'text': '提交'
  });
})();

// qseditor UI
(function() {
  var qseMd = $id('qseMd');
  var qseBBC = $id('qseBBC');

  qseMd.onclick = function() {
    qseMd.removeClass('qse-mode-clear');
    qseBBC.addClass('qse-mode-clear');
  }

  qseBBC.onclick = function() {
    qseBBC.removeClass('qse-mode-clear');
    qseMd.addClass('qse-mode-clear');
  }
})();

//qseImgUploader
function Output(msg) {
  var m = $id("messages");
  m.innerHTML = msg + m.innerHTML;
}

if (window.File && window.FileList && window.FileReader) {
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
  event.type === 'dragover' ? $id('qseMain').addClass('hover') : $id('qseMain').removeClass('hover');
  event.type === 'dragover' ? $id('qseImgUploader').addClass('hover') : $id('qseImgUploader').removeClass('hover');
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
