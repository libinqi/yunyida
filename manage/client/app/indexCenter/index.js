/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('indexCenterApp', [
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
  'commonApp'
])
.constant('indexCenterRoutes', [{
  name: 'indexCenter',
  url: '/indexCenter',
  templateUrl: '/app/indexCenter/index.html',
  menu: '首页'
}])
.config(['$stateProvider', '$urlRouterProvider', 'indexCenterRoutes', function($stateProvider, $urlRouterProvider, indexCenterRoutes) {
  var menu, childMenu;
  for (var n in indexCenterRoutes) {
    menu = indexCenterRoutes[n];
    $stateProvider.state(menu.name, {
      url: menu.url,
      templateUrl: menu.templateUrl,
      menu: menu.menu
    });

  }
//        $urlRouterProvider.otherwise('');
}])
.run(['$rootScope', '$filter', 'indexCenterRoutes', 'systemAppService', function($rootScope, $filter, indexCenterRoutes, systemAppService) {
  /**
   * 应用模块第一次加载的时候，进行应用和菜单的注册
   */
  $rootScope.$on('appService.apps.init', function() {
    var appModel = {
      applicationid: '',
      applicationname: '首页',
      appurl: '/indexCenter',
      appicon: 'yunying',
      apporder: '1',
      descn: '首页应用模块',
      status: '1'
    };
    var initMenus = function(app) {
      for (var n in indexCenterRoutes) {
        var menu = indexCenterRoutes[n];
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


}])
.controller('indexCenterIndexCtrl', ['$scope', '$location', function($scope, $location) {
  function locationChange() {
    if ($location.path() == '/indexCenter') {
      if ($scope.indexCenterMenus && $scope.indexCenterMenus.length > 0) {
        $location.path($scope.indexCenterMenus[0].href);
      }
    }
  }
  locationChange();

  $scope.$on('$locationChangeSuccess', locationChange);

  $scope.navs = $scope.indexCenterMenus;

  $scope.isActive = function(route) {
    return route === $location.path();
  };
}]);
