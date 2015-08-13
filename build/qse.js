var upConfig = {
  Bucket: 'up-loader',

  API: 'DIbaBDVZDMqFRBAtGA5G5yLz8z8=',     //表单 API，登录 UPYUN 官网获取
  
  Param: {     //表单 API 参数，可依据 http://docs.upyun.com/api/form_api/ 文档按需求对参数增删改
    'expiration': (new Date().getTime()) + 60,
    'save-key': '/{year}/{mon}/{day}/upload_{filemd5}{.suffix}',
    'allow-file-type': 'jpg,jpeg,gif,png'
  },
  
  Policy: function() {
    var result = '';
    for (var i in upConfig.Param) {
      result += '"' + i + '":';
      if (isNaN(upConfig.Param[i])) {
	result += '"' + upConfig.Param[i] + '",';
      } else {
	result += upConfig.Param[i] + ',';
      }
    }
    result = result.substring(0, result.length - 1);
    return btoa('{' + result + '}');
  },
  
  Signature: function() {
    var string = upConfig.Policy() + '&' + upConfig.API;
    return md5(string);
  }
};

upConfig.Param.bucket = upConfig.Bucket;
upConfig.URL = 'http://v0.api.upyun.com/' + upConfig.Bucket;
upConfig.Host = 'http://' + upConfig.Bucket + '.b0.upaiyun.com';

function $id(id) {
  return document.getElementById(id);
}

function newRequest() {
  var xhr;
  
  if (typeof XMLHttpRequest !== 'undefined') {
    xhr = new XMLHttpRequest();
  } else {
    var versions = ["MSXML2.XmlHttp.5.0", 
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0", 
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"];
 
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      } catch(e) {}
    }
  }

  return xhr;
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

Object.defineProperty(HTMLElement.prototype, 'addNode', {
  writable: true,
  enumerable: false,
  configurable: true,
  value: function(param) {
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

    this.appendChild(element);
    return element;
  }
});

var qse = {
  Editor: function() {
    $id('qse').className = 'qse';

    $id('qse').addNode({
      'nodeType': 'div',
      'className': 'qse-nav',
      'id': 'qseNav'
    }).addNode({
      'nodeType': 'div',
      'className': 'qse-mode qse-md',
      'id': 'qseMd'
    }).addNode({
      'isTextNode': true,
      'text': 'Markdown'
    });

    $id('qseNav').addNode({
      'nodeType': 'div',
      'className': 'qse-mode qse-bbc qse-mode-clear',
      'id': 'qseBBC'
    }).addNode({
      'isTextNode': true,
      'text': 'BBCode'
    });

    $id('qseNav').addNode({
      'nodeType': 'div',
      'className': 'qse-action qse-preview',
      'id': 'qsePreview'
    }).addNode({
      'isTextNode': true,
      'text': '预览'
    });

    $id('qseNav').addNode({
      'nodeType': 'div',
      'className': 'qse-action qse-fullscreen',
      'id': 'qseFullscreen'
    }).addNode({
      'isTextNode': true,
      'text': '全屏'
    });
    
    $id('qse').addNode({
      'nodeType': 'div',
      'className': 'qse-face',
      'id': 'qseFace'
    }).addNode({
      'nodeType': 'div',
      'className': 'qse-main',
      'id': 'qseMain'
    }).addNode({
      'nodeType': 'textarea',
      'className': 'qse-area',
      'id': 'qseArea'
    });

    $id('qseFace').addNode({
      'nodeType': 'button',
      'className': 'qse-submit',
      'id': 'qseSubmit'
    }).addNode({
      'isTextNode': true,
      'text': '提交'
    });

    $id('qseMain').addNode({
      'nodeType': 'form',
      'className': 'qse-img-uploader',
      'id': 'qseImgUploader',
      'enctype': 'multipart/form-data',
      'method': 'POST'
    }).addNode({
      'nodeType': 'fieldset',
      'id': 'innerUploader'
    }).addNode({
      'nodeType': 'input',
      'className': 'qse-img-uploader-hidden',
      'id': 'MAX_FILE_SIZE',
      'name': 'MAX_FILE_SIZE',
      'type': 'hidden',
      'value': 3000
    });

    $id('innerUploader').addNode({
      'nodeType': 'div',
      'id': 'innerDiv'
    }).addNode({
      'nodeType': 'input',
      'className': 'qse-img-uploader-drag',
      'id': 'qseFileSelect',
      'multiple': 'multiple',
      'name': 'fileselect[]',
      'type': 'file'
    });

    $id('innerDiv').addNode({
      'nodeType': 'div',
      'className': 'qse-img-uploader-information',
      'id': 'qseImgUploaderInfo'
    }).addNode({
      'isTextNode': true,
      'text': '拖动图片至此处，复制粘贴，或点击'
    });

    $id('qseImgUploaderInfo').addNode({
      'nodeType': 'span',
      'className': 'qse-img-uploader-click-here',
      'id': 'qseClickHere'
    }).addNode({
      'isTextNode': true,
      'text': '这里'
    });

    $id('qseImgUploaderInfo').addNode({
      'isTextNode': true,
      'text': '上传'
    });
  },

  Switcher: function() {
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
  },

  Uploader: {
    Init: function() {
      var fileselect = $id('qseFileSelect'),
	filedrag = $id('qseMain');

      fileselect.addEventListener('change', this.FileSelectHandler, false);

      var xhr = newRequest();
  
      if (xhr.upload) {
	document.body.addEventListener('dragover', this.DocumentListener, false);    
	document.body.addEventListener('dragleave', this.DocumentListener, false);    
	document.body.addEventListener('drop', this.DocumentListener, false);    
	filedrag.addEventListener('dragover', this.FileDragHover, false);
	filedrag.addEventListener('dragleave', this.FileDragHover, false);
	filedrag.addEventListener('drop', this.FileSelectHandler, false);
      }
    },

    DocumentListener: function(event) {
      event.preventDefault();
      return false;
    },

    ClickListener: function() {
      $id('qseClickHere').onclick = function() {
	$id('qseFileSelect').click();
      }
    },

    FileDragHover: function(event) {
      event.stopPropagation();
      event.preventDefault();
      event.type === 'dragover' ? $id('qseMain').addClass('hover') : $id('qseMain').removeClass('hover');
      event.type === 'dragover' ? $id('qseImgUploader').addClass('hover') : $id('qseImgUploader').removeClass('hover');
    },

    FileSelectHandler: function(event) {
      qse.Uploader.FileDragHover(event);

      var files = event.target.files || event.dataTransfer.files;

      for (var i = 0, file; file = files[i]; i++) {
	qse.Uploader.ParseFile(file);
      }
    },

    ParseFile: function(file) {
      qse.Uploader.Output(
	'<p>File information: <strong>' + file.name +
	  '</strong> type: <strong>' + file.type +
	  '</strong> size: <strong>' + file.size +
	  '</strong> bytes</p>'
      );

      var request = newRequest(),
	     data = new FormData();

      data.append('file', file);
      data.append('policy', upConfig.Policy());
      data.append('signature', upConfig.Signature());

      // Open a request
      request.open('POST', upConfig.URL, true);
      
      // Error event
      request.addEventListener('error', function(error) {
	console.log(error);
      }, false);
      
      // When server response
      request.addEventListener('load', function(result) {
	var statusCode = result.target.status;

	// Try to parse JSON
	if (statusCode !== 200) {
	  console.log(new Error(result.target.status), result.target);
	}

	try {
	  var image = JSON.parse(this.responseText);
	  image.absUrl = upConfig.Host + image.url;
	  image.absUri = image.absUrl;
	  console.log(image.absUrl);
	} catch (error) {
	  console.log(error);
	}
      }, false);

      // Send data to server
      request.send(data);
    },
    
    Output: function(msg) {
      var m = $id("messages");
      m.innerHTML = msg + m.innerHTML;
    }
  },

  Init: function() {
    this.Editor();
    this.Switcher();
    this.Uploader.ClickListener();
    if (window.File && window.FileList && window.FileReader) {
      this.Uploader.Init();
    }
  }
};