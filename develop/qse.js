var formDataURL = '';     //用户发帖提交地址

var upConfig = {
  Bucket: 'qseditor',

  API: 'hXTO2xagYw98S646UEyRh7BJ+DM=',     //表单 API，登录 UPYUN 官网获取
  
  Param: {     //表单 API 参数，可依据 http://docs.upyun.com/api/form_api/ 文档按需求对参数增删改
    'expiration': (new Date().getTime()) + 60,
    'save-key': '/{year}/{mon}/{day}/upload_{filemd5}{.suffix}',
    'allow-file-type': 'jpg,jpeg,gif,png,bmp,svg'
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
    return Base64.encode('{' + result + '}');
  },
  
  Signature: function() {
    var string = upConfig.Policy() + '&' + upConfig.API;
    return md5(string);
  }
};

upConfig.Param.bucket = upConfig.Bucket;
upConfig.URL = '//v0.api.upyun.com/' + upConfig.Bucket;
upConfig.Host = '//' + upConfig.Bucket + '.b0.upaiyun.com';

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

var qsemode;

var qse = {
  Mode: 'markdown',
  
  Define: function() {
    var elementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype;

    Object.defineProperty(elementPrototype, 'hasClass', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function(className) {
	return !!this.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));   
      }
    });

    Object.defineProperty(elementPrototype, 'addClass', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function(className) {
	if (!this.hasClass(className)) {
	  this.className += ' ' + className;
	}
      }
    });

    Object.defineProperty(elementPrototype, 'removeClass', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function(className) {
	if (this.hasClass(className)) {
	  var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	  this.className = this.className.replace(reg, ' ');
	}
      }
    });

    Object.defineProperty(elementPrototype, 'addNode', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function(param) {
	var element;

	if (param['isTextNode']) {
	  element = document.createTextNode(param['text']);
	} else {
	  element = document.createElement(param['nodeType']);

	  for (var attr in param) {
	    if (param[attr]) {
	      element[attr] = param[attr];
	    }
	  }

	  if ('sandbox' in element) {
	    element.sandbox = '';
	  }
	}

	this.appendChild(element);
	return element;
      }
    });
  },
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
      'className': 'qse-action qse-preview-button',
      'id': 'qsePreviewButton'
    }).addNode({
      'isTextNode': true,
      'text': '预览'
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

  $id('qseMain').addNode({
      'nodeType': 'iframe',
      'className': 'qse-preview hidden',
      'id': 'qsePreview',
      'sandbox': ' ',
      'security': 'restricted'
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

  MdMode: function() {
    $id('qseMd').removeClass('qse-mode-clear');
    $id('qseBBC').addClass('qse-mode-clear');
    $id('qsePreview').addClass('hidden');
    $id('qseArea').removeClass('hidden');
    $id('qseImgUploader').removeClass('hidden');
    qse.Mode = 'markdown';
    window.localStorage.setItem('qsemode', 'markdown');
  },

  BBCMode: function() {
    $id('qseBBC').removeClass('qse-mode-clear');
    $id('qseMd').addClass('qse-mode-clear');
    $id('qsePreview').addClass('hidden');
    $id('qseArea').removeClass('hidden');
    $id('qseImgUploader').removeClass('hidden');
    qse.Mode = 'bbcode';
    window.localStorage.setItem('qsemode', 'bbcode');
  },

  Switcher: function() {
    var qseMd = $id('qseMd');
    var qseBBC = $id('qseBBC');

    qseMd.onclick = function() {
      if (qse.Mode !== 'markdown') {
	if (!$id('qseArea').value) {
	  qse.MdMode();
	} else {
	  confirm('警告：切换标签会清除文本区中所有内容！是否继续？') ? (function() {
	    $id('qseArea').value = '';
	    qse.MdMode();
	  })() : '';
	}
      }
    }

    qseBBC.onclick = function() {
      if (qse.Mode !== 'bbcode') {
	if (!$id('qseArea').value) {
	  qse.BBCMode();
	} else {
	  confirm('警告：切换标签会清除文本区中所有内容！是否继续？') ? (function() {
	    $id('qseArea').value = '';
	    qse.BBCMode();
	  })() : '';
	}
      }
    }
  },

  GetContent: function() {
	switch (qse.Mode) {
		case "markdown":
			return qse.Parser($id('qseArea').value);
		case "bbcode":
			return $id('qseArea').value;
		default:
			return $id('qseArea').value
	};
  },

  Previewer: function() {
    $id('qsePreviewButton').onclick = function() {
      if ($id('qsePreview').hasClass('hidden')) {
	$id('qsePreview').removeClass('hidden');
	$id('qseArea').addClass('hidden');
	$id('qseImgUploader').addClass('hidden');

	var preview = $id('qsePreview');
	var text = this.GetContent();

	preview.srcdoc = bbcode.render(text);
      } else {
	$id('qsePreview').addClass('hidden');
	$id('qseArea').removeClass('hidden');
	$id('qseImgUploader').removeClass('hidden');
      }
    };
  },

  Parser: (new Showdown.converter(conv_opts)).makeBBCode,

  Uploader: {
    Init: function() {
      var fileselect = $id('qseFileSelect'),
	filedrag = $id('qseMain');

      if (fileselect.addEventListener) {
	fileselect.addEventListener('change', this.FileSelectHandler, false);
      } else {
	fileselect.attachEvent('change', this.FileSelectHandler);
      }

      var xhr = newRequest();
  
      if (xhr.upload) {
	if (document.body.addEventListener) {
	  document.body.addEventListener('dragover', this.DocumentListener, false);
	  document.body.addEventListener('dragleave', this.DocumentListener, false);
	  document.body.addEventListener('drop', this.DocumentListener, false);
	  filedrag.addEventListener('dragover', this.FileDragHover, false);
	  filedrag.addEventListener('dragleave', this.FileDragHover, false);
	  filedrag.addEventListener('drop', this.FileSelectHandler, false);
	} else {
	  document.body.attachEvent('dragover', this.DocumentListener);
	  document.body.attachEvent('dragleave', this.DocumentListener);
	  document.body.attachEvent('drop', this.DocumentListener);
	  filedrag.attachEvent('dragover', this.FileDragHover, false);
	  filedrag.attachEvent('dragleave', this.FileDragHover, false);
	  filedrag.attachEvent('drop', this.FileSelectHandler, false);
	}
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
      var request = newRequest(),
	     data = new FormData();

      data.append('file', file);
      data.append('policy', upConfig.Policy());
      data.append('signature', upConfig.Signature());

      // Open a request
      request.open('POST', upConfig.URL, true);

      if (request.addEventListener) {
	// Error event
	request.addEventListener('error', function(error) {
	  console.log(error);
	}, false);

	// Upload progress monitor
	request.addEventListener('progress', function(pro) {
	  Math.round(pro.loaded / pro.total * 100);
	});
      
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
	    var urlAddress = 'http:' + image.absUrl;

	    if (qse.Mode === 'markdown') {
	      $id('qseArea').value += '![](' + urlAddress + ')\n';
	    } else if (qse.Mode === 'bbcode') {
	      $id('qseArea').value += '[img]' + urlAddress + '[/img]\n';
	    } else {
	      $id('qseArea').value += 'http:' + image.absUrl;
	    }
	  } catch (error) {
	    console.log(error);
	  }
	}, false);
      } else {
	// Error event
	request.attachEvent('error', function(error) {
	  console.log(error);
	});

	// Upload progress monitor
	request.attachEvent('progress', function(pro) {
	  Math.round(pro.loaded / pro.total * 100);
	});
      
	// When server response
	request.attachEvent('load', function(result) {
	  var statusCode = result.target.status;
	  
	  // Try to parse JSON
	  if (statusCode !== 200) {
	    console.log(new Error(result.target.status), result.target);
	  }

	  try {
	    var image = JSON.parse(this.responseText);
	    image.absUrl = upConfig.Host + image.url;
	    image.absUri = image.absUrl;
	    var urlAddress = 'http:' + image.absUrl;
	    
	    if (qse.Mode === 'markdown') {
	      $id('qseArea').value += '![](' + urlAddress + ')\n';
	    } else if (qse.Mode === 'bbcode') {
	      $id('qseArea').value += '[img]' + urlAddress + '[/img]\n';
	    } else {
	      $id('qseArea').value += 'http:' + image.absUrl;
	    }
	  } catch (error) {
	    console.log(error);
	  }
	}, false);
      }

      // Send data to server
      request.send(data);
    }    
  },

  Submitter: function() {
    $id('qseSubmit').onclick = function () {
      var xhr = newRequest();

      xhr.open('POST', formDataURL, true);
    }
  },

  Init: function() {
    window.onload = function() {
      window.localStorage.getItem('qsemode') === 'bbcode' ? qse.BBCMode() : qse.MdMode();
    };
    this.Define();
    this.Editor();
    this.Switcher();
    this.Previewer();
    this.Uploader.ClickListener();
    if (window.File && window.FileList && window.FileReader) {
      this.Uploader.Init();
    }
    this.Submitter();
  }
};

qse.Init();
