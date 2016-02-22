/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('supplyMonitorApp', [
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
.constant('supplyMonitorRoutes', [{
  name: 'supplyMonitor',
  url: '/supplyMonitor',
  templateUrl: '/app/transPortMonitor/index.html',
  menu: '运力监测',
  childMenus: [{
    name: 'supplyMonitor.goodsmt',
    url: '/goodsmt',
    templateUrl: '/app/transPortMonitor/views/transportMonitor.html',
    menu: '在册运力'
  },{
    name: 'supplyMonitor.time',
    url: '/time',
    templateUrl: '/app/transPortMonitor/views/timeTransportMonitor.html',
    menu: '实时运力'
  },{
    name: 'supplyMonitor.vehiclemt',
    url: '/vehiclemt',
    templateUrl: '/app/transPortMonitor/views/vehicleMonitor.html',
    menu: '车源数据'
  },{
    name: 'supplyMonitor.ordermt',
    url: '/ordermt',
    templateUrl: '/app/transPortMonitor/views/orderMonitor.html',
    menu: '订单数据'
  }]
}])
.config(['$stateProvider', '$urlRouterProvider', 'supplyMonitorRoutes', function($stateProvider, $urlRouterProvider, supplyMonitorRoutes) {
  var menu, childMenu;
  for (var n in supplyMonitorRoutes) {
    menu = supplyMonitorRoutes[n];
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
.run(['$rootScope', '$filter', 'supplyMonitorRoutes', 'systemAppService', function($rootScope, $filter, supplyMonitorRoutes, systemAppService) {
  /**
   * 应用模块第一次加载的时候，进行应用和菜单的注册
   */
  $rootScope.$on('appService.apps.init', function() {
    var appModel = {
      applicationid: '',
      applicationname: '运力监测',
      appurl: '/supplyMonitor',
      appicon: 'monitor',
      apporder: '2',
      descn: '运力监测模块',
      status: '1'
    };
    var initMenus = function(app) {
      for (var n in supplyMonitorRoutes) {
        var menu = supplyMonitorRoutes[n];
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
    $rootScope.supplyMonitorMenus = [];
    // 获取本应用模块
    systemAppService.appService.getAppByName('运力监测').then(function(response) {
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
            $rootScope.supplyMonitorMenus.push({
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
.controller('supplyMonitorCtrl', ['$scope', '$location', function($scope, $location) {
  function locationChange() {
    if ($location.path() == '/supplyMonitor') {
      if ($scope.supplyMonitorMenus && $scope.supplyMonitorMenus.length > 0) {
        $location.path($scope.supplyMonitorMenus[0].href);
      }
    }
  }
  locationChange();

  $scope.$on('$locationChangeSuccess', locationChange);

  $scope.navs = $scope.supplyMonitorMenus;

  $scope.isActive = function(route) {
    return route === $location.path();
  };
}]);
