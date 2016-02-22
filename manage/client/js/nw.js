/**
 * Created by libinqi on 2015/5/26.
 */
if (window.require) {
  window.gui = require('nw.gui');
  var win = gui.Window.get();
  var exec = require('child_process').exec;
  var fs = require('fs');
  var path = require('path');  
  var isMaxWindow = false;

  function Maximize() {
    if (!isMaxWindow) {
      if (screen.availWidth > 1024) {
        win.maximize();
        isMaxWindow = true;
      }
    } else {
      win.unmaximize();
      isMaxWindow = false;
    }
    return isMaxWindow;
  }

  function Minimize() {
    win.minimize();
  }

  function winClose() {
    win.close();
  }

  function openBrowser(url) {
    if (url) exec('start ' + url);
  }

  window.fs = fs; //操作本地文件
  window.path = path; // nodejs获取本地系统文件路径
  window.openBrowser = openBrowser; // 调用本地浏览器打开网页
}
