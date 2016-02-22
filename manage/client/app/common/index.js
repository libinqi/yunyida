/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';
if (!window.user) {
  window.user = userService.getUser();
  if (!window.user) {
    window.location.href = '/app/common/views/login.html';
  } else if (window.user.username != 'admin') {
    if (!window.user.permissions || !window.user.permissions.application || window.user.permissions.application.length == 0) {
      window.location.href = '/app/common/views/unAudit.html';
    }
  }
}

angular.module('commonApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router'
  ])
  .run(['$rootScope', '$filter', '$location', '$timeout', 'systemAppService', function($rootScope, $filter, $location, $timeout, systemAppService) {
    // 系统初始化
    systemAppService.baseService.initDept();
    systemAppService.baseService.iniRole();
    $rootScope.$on('baseService.role.init', function() {
      systemAppService.baseService.initSuperUser();
    });

    // 加载当前登录用户
    $rootScope.user = window.user;
    $rootScope.parkInfo = window.parkInfo;
    systemAppService.userService.userInfo = window.user;

    $timeout(function() {
      systemAppService.appService.getAppList();
      systemAppService.dictService.getDicts();
      if (systemAppService.userService.userInfo && systemAppService.userService.userInfo.username != 'admin') {
        var orderBy = $filter('orderBy');
        var app = orderBy(systemAppService.userService.userInfo.permissions.application, 'apporder', false)[0];

        if (app && app.applicationname != '运营中心') {
          var menus = [];
          var menu = {};
          for (var n in systemAppService.userService.userInfo.permissions.menu) {
            menu = systemAppService.userService.userInfo.permissions.menu[n];
            if (menu.applicationid == app.applicationid) {
              menus.push(menu);
            }
          }
          menu = orderBy(menus, 'menuorder', false)[0];
          if (menu) {
            var params = menu.menuparam.split('.');
            var url = '';
            for (var n in params) {
              url += '/' + params[n];
            }
            $location.path(url);
          }
        } else {
          $location.path('/opCenter');
        }
      } else {
        $location.path('/opCenter');
      }
      //            $rootScope.$on('appService.apps.load', function (event) {
      //                systemAppService.menuService.getMenuList();
      //            });
    });

    // var ws = new WebSocket('ws://' + window.lmp_host.replace('http://', '') + '/mplatform/webSocketServer');
    // // var ws = new WebSocket('ws://192.168.1.54:8080/mplatform/webSocketServer?userid=' + user.userid);
    // ws.onopen = function() {
    //   window.console.log('状态信息: 连接打开.' + new Date());
    // };
    // ws.onmessage = function(event) {
    //   window.console.log('收到: ' + event.data);
    //   $rootScope.$broadcast('baseService.message.new');
    //   //这里接收到消息之后处理逻辑代码
    // };
    // ws.onclose = function(event) {
    //   window.console.log('状态信息: 连接关闭.' + new Date());
    //   window.console.log(event);
    // };
  }]);
