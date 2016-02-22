/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('logisSiteApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'ngDialog',
  'ngCityPicker',
  'tm.pagination',
  'flow',
  'ngNotify',
  'w5c.validator',
  'commonApp'
])
  .constant('logisSiteRoutes', [{
    name: 'logisSite',
    url: '/logisSite',
    templateUrl: '/app/logisSite/index.html',
    menu: '门户管理',
    childMenus: [
      {
        name: 'logisSite.siteManage',
        url: '/siteManage',
        templateUrl: '/app/logisSite/index.html',
        menu: '门户管理'
      }
    ]
  }])
  .config(['$stateProvider', '$urlRouterProvider', 'logisSiteRoutes', function($stateProvider, $urlRouterProvider, logisSiteRoutes) {
    var menu, childMenu;
    for (var n in logisSiteRoutes) {
      menu = logisSiteRoutes[n];
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
  .run(['$rootScope', '$filter', 'logisSiteRoutes', 'systemAppService', function($rootScope, $filter, logisSiteRoutes, systemAppService) {
    /**
     * 应用模块第一次加载的时候，进行应用和菜单的注册
     */
    $rootScope.$on('appService.apps.init', function() {
      var appModel = {
        applicationid: '',
        applicationname: '门户管理',
        appurl: '/logisSite',
        appicon: 'menghu',
        apporder: '4',
        descn: '平台门户网站后台管理',
        status: '1'
      };
      var initMenus = function(app) {
        for (var n in logisSiteRoutes) {
          var menu = logisSiteRoutes[n];
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
      $rootScope.logisSiteMenus = [];
      // 获取本应用模块
      systemAppService.appService.getAppByName('园区门户').then(function(response) {
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
              $rootScope.logisSiteMenus.push({
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
  .controller('loginSiteIndexCtrl', ['$scope', '$location', '$sce', function($scope, $location, $sce) {
    var siteBox = $('#siteBox');
    var notSite = $('#notSite');

    if (window.webadmin) {
      siteBox.attr('src', $sce.trustAsResourceUrl(window.webadmin));
      siteBox.show();
      notSite.hide();
    } else {
      siteBox.hide();
      notSite.show();
    }
  }]);
