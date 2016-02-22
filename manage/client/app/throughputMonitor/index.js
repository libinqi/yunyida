/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('transportMonitorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'ngDialog',
  'ngCityPicker',
  'pageslide-directive',
  'angular.city.select',
  'tm.pagination',
  'flow',
  'ngNotify',
  'w5c.validator',
  'commonApp',
  'ng-echarts',
  'angular-echarts'
])
.constant('transportMonitorRoutes', [{
  name: 'transportMonitor',
  url: '/transportMonitor',
  templateUrl: '/app/throughputMonitor/index.html',
  menu: '吞吐量监测',
  childMenus: [{
    name: 'transportMonitor.throughputmt',
    url: '/throughputmt',
    templateUrl: '/app/throughputMonitor/views/throughputMonitor.html',
    menu: '公路数据'
  },{
    name: 'transportMonitor.tuntu',
    url: '/tuntu',
    templateUrl: '/app/throughputMonitor/views/tunTuMonitor.html',
    menu: '吞吐量统计'
  },{
    name: 'transportMonitor.airport',
    url: '/airport',
    templateUrl: '/app/throughputMonitor/views/noDataPage.html',
    menu: '航运数据'
  },{
    name: 'transportMonitor.water',
    url: '/water',
    templateUrl: '/app/throughputMonitor/views/noDataPage.html',
    menu: '水运数据'
  },{
    name: 'transportMonitor.trains',
    url: '/trains',
    templateUrl: '/app/throughputMonitor/views/noDataPage.html',
    menu: '铁运数据'
  },{
    name: 'transportMonitor.mail',
    url: '/mail',
    templateUrl: '/app/throughputMonitor/views/noDataPage.html',
    menu: '邮政数据'
  },]
}])
.config(['$stateProvider', '$urlRouterProvider', 'transportMonitorRoutes', function($stateProvider, $urlRouterProvider, transportMonitorRoutes) {
  var menu, childMenu;
  for (var n in transportMonitorRoutes) {
    menu = transportMonitorRoutes[n];
    $stateProvider.state(menu.name, {
      url: menu.url,
      templateUrl: menu.templateUrl,
      menu: menu.menu
    });
    if (menu.childMenus.length > 0) {
      for (var c in menu.childMenus) {
        childMenu = menu.childMenus[c];
        $stateProvider.state(childMenu.name, {
          url: childMenu.url,
          templateUrl: childMenu.templateUrl,
          menu: childMenu.menu
        });
      }
    }
  }
//        $urlRouterProvider.otherwise('');
}])
.run(['$rootScope', '$filter', 'transportMonitorRoutes', 'systemAppService', function($rootScope, $filter, transportMonitorRoutes, systemAppService) {
  /**
   * 应用模块第一次加载的时候，进行应用和菜单的注册
   */
  $rootScope.$on('appService.apps.init', function() {
    var appModel = {
      applicationid: '',
      applicationname: '吞吐量监测',
      appurl: '/transportMonitor',
      appicon: 'monitor',
      apporder: '2',
      descn: '吞吐量监测模块',
      status: '1'
    };
    var initMenus = function(app) {
      for (var n in transportMonitorRoutes) {
        var menu = transportMonitorRoutes[n];
        var rootMenuModel = {
          menuid: '', //菜单ID（修改时为必填）
          menuname: menu.menu, //菜单名称
          pmenuid: '0', //上级菜单ID
          menuurl: menu.url, //菜单页面链接
          menuorder: '', //菜单排序
          menudesc: menu.templateUrl, //菜单描述
          menuparam: menu.name,
          status: 1, //菜单状态
          applicationid: app.applicationid, //所属应用ID
          applicationname: app.applicationname
        };
        systemAppService.menuService.registerMenu(rootMenuModel, function(rootMenu) {
          if (menu.childMenus.length > 0) {
            for (var c in menu.childMenus) {
              var childMenu = menu.childMenus[c];
              var menuModel = {
                menuid: '', //菜单ID（修改时为必填
                menuname: childMenu.menu, //菜单名称
                pmenuid: rootMenu.menuid, //上级菜单ID
                menuurl: childMenu.url, //菜单页面链接
                menuorder: '', //菜单排序
                menudesc: childMenu.templateUrl, //菜单描述
                menuparam: childMenu.name,
                status: 1, //菜单状态
                applicationid: app.applicationid, //所属应用ID
                applicationname: app.applicationname
              };
              systemAppService.menuService.registerMenu(menuModel);
            }
          }
        });
      }
    };
    systemAppService.appService.registerApp(appModel, initMenus);
  });

  /**
   * 应用模块加载
   */
  (function() {
    var currentAppModule = null;
    $rootScope.transportMonitorMenus = [];
    // 获取本应用模块
    systemAppService.appService.getAppByName('吞吐量监测').then(function(response) {
      if (response.data && response.data.code == "200") {
        currentAppModule = response.data.body.data[0];
        if (currentAppModule && currentAppModule.status == "1") {
          loadAppModule();
        }
      }
    });

    var loadAppModule = function() {
      var currentAppMenus = [];
      // 获取本应用模块菜单
      systemAppService.menuService.getMenusByAppId(currentAppModule.applicationid, function(data) {
        if (data && data.length > 0) {
          currentAppMenus = data;
          loadAppMenus();
        }
      });

      var loadAppMenus = function() {
        var menu, n;
        for (n in currentAppMenus) {
          menu = currentAppMenus[n];
          if (menu.menuparam.indexOf('.') > 0) {
            $rootScope.transportMonitorMenus.push({
              href: '/' + menu.menuparam.split('.')[0] + '/' + menu.menuparam.split('.')[1],
              name: menu.menuparam.split('.')[1],
              menu: menu.menuname
            });
          }
        }
      }
    }
  })();
}])
.controller('transportMonitorCtrl', ['$scope', '$location', function($scope, $location) {
  function locationChange() {
    if ($location.path() == '/transportMonitor') {
      if ($scope.transportMonitorMenus && $scope.transportMonitorMenus.length > 0) {
        $location.path($scope.transportMonitorMenus[0].href);
      }
    }
  }
  locationChange();

  $scope.$on('$locationChangeSuccess', locationChange);

  $scope.navs = $scope.transportMonitorMenus;

  $scope.isActive = function(route) {
    return route === $location.path();
  };
}]);
