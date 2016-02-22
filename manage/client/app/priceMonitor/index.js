/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('priceMonitorApp', [
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
.constant('priceMonitorRoutes', [{
  name: 'priceMonitor',
  url: '/priceMonitor',
  templateUrl: '/app/priceMonitor/index.html',
  menu: '价格监测',
  childMenus: [{
    name: 'priceMonitor.land',
    url: '/land',
    templateUrl: '/app/priceMonitor/views/transportPrice.html',
    menu: '陆运价格'
  },{
    name: 'priceMonitor.oil',
    url: '/oil',
    templateUrl: '/app/priceMonitor/views/oilPrice.html',
    menu: '油价数据'
  },{
    name: 'priceMonitor.airport',
    url: '/airport',
    templateUrl: '/app/priceMonitor/views/noDataPage.html',
    menu: '航运价格'
  },{
    name: 'priceMonitor.transport',
    url: '/transport',
    templateUrl: '/app/priceMonitor/views/noDataPage.html',
    menu: '铁运价格'
  },{
    name: 'priceMonitor.water',
    url: '/water',
    templateUrl: '/app/priceMonitor/views/noDataPage.html',
    menu: '水运价格'
  },{
    name: 'priceMonitor.mail',
    url: '/mail',
    templateUrl: '/app/priceMonitor/views/noDataPage.html',
    menu: '邮政价格'
  }]
}])
.config(['$stateProvider', '$urlRouterProvider', 'priceMonitorRoutes', function($stateProvider, $urlRouterProvider, priceMonitorRoutes) {
  var menu, childMenu;
  for (var n in priceMonitorRoutes) {
    menu = priceMonitorRoutes[n];
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
.run(['$rootScope', '$filter', 'priceMonitorRoutes', 'systemAppService', function($rootScope, $filter, priceMonitorRoutes, systemAppService) {
  /**
   * 应用模块第一次加载的时候，进行应用和菜单的注册
   */
  $rootScope.$on('appService.apps.init', function() {
    var appModel = {
      applicationid: '',
      applicationname: '价格监测',
      appurl: '/priceMonitor',
      appicon: 'monitor',
      apporder: '2',
      descn: '价格监测模块',
      status: '1'
    };
    var initMenus = function(app) {
      for (var n in priceMonitorRoutes) {
        var menu = priceMonitorRoutes[n];
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
    $rootScope.priceMonitorMenus = [];
    // 获取本应用模块
    systemAppService.appService.getAppByName('价格监测').then(function(response) {
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
            $rootScope.priceMonitorMenus.push({
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
.controller('priceMonitorCtrl', ['$scope', '$location', function($scope, $location) {
  function locationChange() {
    if ($location.path() == '/priceMonitor') {
      if ($scope.priceMonitorMenus && $scope.priceMonitorMenus.length > 0) {
        $location.path($scope.priceMonitorMenus[0].href);
      }
    }
  }
  locationChange();

  $scope.$on('$locationChangeSuccess', locationChange);

  $scope.navs = $scope.priceMonitorMenus;

  $scope.isActive = function(route) {
    return route === $location.path();
  };
}]);
