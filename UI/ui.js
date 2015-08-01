// qseditor UI

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

var qseMd = document.getElementById('qseMd');
var qseBBC = document.getElementById('qseBBC');

qseMd.onclick = function() {
  removeClass(qseMd, 'qse-mode-clear');
  addClass(qseBBC, 'qse-mode-clear');
}

qseBBC.onclick = function() {
  removeClass(qseBBC, 'qse-mode-clear');
  addClass(qseMd, 'qse-mode-clear');
}
