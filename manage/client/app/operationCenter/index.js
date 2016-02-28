/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';
var opCenterApp = angular.module('opCenterApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.tree',
        'ui.tree-filter',
        'ui.highlight',
        'commonApp',
        'pageslide-directive',
        'tm.pagination',
        'ngFileUpload',
        'angular.city.select'
    ])
    .constant('opCenterRoutes', [{
        menuid: '1',
        name: 'opCenter',
        url: '/opCenter',
        templateUrl: '/app/operationCenter/home.html',
        menu: '运营中心',
        childMenus: [
            {
                menuid: '2',
                name: 'opCenter.infoAudit',
                url: '/infoAudit',
                templateUrl: '/app/operationCenter/index.html',
                menu: '客户管理',
                icon: 'fa-user',
                childMenus: [{
                    menuid: '21',
                    name: 'opCenter.infoAudit.shipper',
                    url: '/shipper',
                    templateUrl: '/app/operationCenter/views/infoAudit/shipper/list.html',
                    menu: '货主信息'
                }, {
                    menuid: '22',
                    name: 'opCenter.infoAudit.enterprise',
                    url: '/enterprise',
                    templateUrl: '/app/operationCenter/views/infoAudit/enterprise/list.html',
                    menu: '企业信息'
                }, {
                    menuid: '23',
                    name: 'opCenter.infoAudit.driver',
                    url: '/driver',
                    templateUrl: '/app/operationCenter/views/infoAudit/driver/list.html',
                    menu: '司机信息'
                }]
            },
            {
                menuid: '3',
                name: 'opCenter.orderManage',
                url: '/orderManage',
                templateUrl: '/app/operationCenter/index.html',
                menu: '订单管理',
                icon: 'fa-file-text',
                childMenus: [{
                    menuid: '31',
                    name: 'opCenter.orderManage.list',
                    url: '/list',
                    templateUrl: '/app/operationCenter/views/orderManage/list.html',
                    menu: '订单管理'
                }]
            }
             , {
                menuid: '4',
                name: 'opCenter.clientCenter',
                url: '/clientCenter',
                templateUrl: '/app/operationCenter/index.html',
                menu: '消息中心',
                icon: 'fa-comment',
                childMenus: [{
                    menuid: '41',
                    name: 'opCenter.clientCenter.platformMessage',
                    url: '/platformMessage',
                    templateUrl: '/app/operationCenter/views/clientCenter/platformMessage/list.html',
                    menu: '消息管理'
                }]
            }
        ]
    }])
    .config(['$stateProvider', '$urlRouterProvider', 'opCenterRoutes', function ($stateProvider, $urlRouterProvider, opCenterRoutes) {
        $stateProvider.state(opCenterRoutes[0].name, {
            url: opCenterRoutes[0].url,
            templateUrl: opCenterRoutes[0].templateUrl,
            menu: opCenterRoutes[0].menu
        });

        var menu, childMenu;
        for (var n in opCenterRoutes[0].childMenus) {
            menu = opCenterRoutes[0].childMenus[n];
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
    .run(['$rootScope', '$filter', 'opCenterRoutes', 'systemAppService', function ($rootScope, $filter, opCenterRoutes, systemAppService) {
        /**
         * 应用模块第一次加载的时候，进行应用和菜单的注册
         */
        $rootScope.$on('appService.apps.init', function () {
            var appModel = {
                applicationid: '001',
                applicationname: '运营中心',
                appurl: '/opCenter',
                appicon: 'yunying',
                apporder: '1',
                descn: '运营中心应用模块',
                status: '1'
            };
            var initMenus = function (app) {
                var menu = opCenterRoutes[0];
                // 插入父节点
                var rootMenuModel = {
                    menuid: menu.menuid, //菜单ID（修改时为必填）
                    menuname: menu.menu, //菜单名称
                    pmenuid: '0', //上级菜单ID
                    menuurl: menu.url, //菜单页面链接
                    menuorder: '', //菜单排序
                    menudesc: menu.templateUrl, //菜单描述
                    menuicon: menu.icon, //菜单图标
                    menuparam: menu.name,
                    status: 1, //菜单状态
                    applicationid: app.applicationid, //所属应用ID
                    applicationname: app.applicationname
                };

                // 插入2级节点
                var insertChildMenus = function (rootMenu, childMenus) {
                    if (childMenus.length > 0) {
                        for (var c in childMenus) {
                            var childMenu = childMenus[c];
                            var menuModel = {
                                menuid: childMenu.menuid, //菜单ID（修改时为必填
                                menuname: childMenu.menu, //菜单名称
                                pmenuid: rootMenu.menuid, //上级菜单ID
                                menuurl: childMenu.url, //菜单页面链接
                                menuorder: '', //菜单排序
                                menudesc: childMenu.templateUrl, //菜单描述
                                menuicon: childMenu.icon, //菜单图标
                                menuparam: childMenu.name, //菜单图标
                                status: 1, //菜单状态
                                applicationid: app.applicationid, //所属应用ID
                                applicationname: app.applicationname
                            };
                            (function (childMenu, menuModel) {
                                systemAppService.menuService.registerMenu(menuModel, function (rootMenu) {
                                    if (childMenu.childMenus.length > 0) {
                                        insertGrandMenus(rootMenu, childMenu.childMenus);
                                    }
                                });
                            })(childMenu, menuModel);
                        }
                    }
                };

                // 插入3级节点
                var insertGrandMenus = function (rootMenu, grandMenus) {
                    if (grandMenus.length > 0) {
                        for (var c in grandMenus) {
                            var grandMenu = grandMenus[c];
                            var menuModel = {
                                menuid: grandMenu.menuid, //菜单ID（修改时为必填
                                menuname: grandMenu.menu, //菜单名称
                                pmenuid: rootMenu.menuid, //上级菜单ID
                                menuurl: grandMenu.url, //菜单页面链接
                                menuorder: '', //菜单排序
                                menudesc: grandMenu.templateUrl, //菜单描述
                                menuparam: grandMenu.name, //菜单图标
                                status: 1, //菜单状态
                                applicationid: app.applicationid, //所属应用ID
                                applicationname: app.applicationname
                            };
                            systemAppService.menuService.registerMenu(menuModel);
                        }
                    }
                };

                systemAppService.menuService.registerMenu(rootMenuModel, function (rootMenu) {
                    if (menu.childMenus.length > 0) {
                        insertChildMenus(rootMenu, menu.childMenus);
                    }
                });
            }

            systemAppService.appService.registerApp(appModel, initMenus);
        });

        /**
         * 应用模块加载
         */
        $rootScope.opCenterMenus = [];
        var currentAppModule = {};
        var currentAppMenus = [];

        var loadAppModule = function () {
            // 获取本应用模块菜单
            var loadAppMenus = function () {
                var menu, n;
                for (n in currentAppMenus) {
                    menu = currentAppMenus[n];
                    $rootScope.opCenterMenus.push({
                        href: menu.menuurl,
                        name: menu.menuparam,
                        icon: menu.menuicon,
                        menu: menu.menuname,
                        menuid: menu.menuid,
                        pmenuid: menu.pmenuid
                    });
                }
                $rootScope.$broadcast('appService.menus.update');
            }

            systemAppService.menuService.getMenusByAppId(currentAppModule.applicationid, function (data) {
                if (data && data.length > 0) {
                    currentAppMenus = data;
                    loadAppMenus();
                }
            });
        }

        $rootScope.$on('appService.apps.load', function () {
            // 获取本应用模块
            currentAppModule = systemAppService.appService.getAppByName('运营中心');
            if (currentAppModule) {
                loadAppModule();
            }
        });
    }])
    .controller('opCenterIndexCtrl', ['$scope', '$timeout', '$location', 'customersCenterService', 'homeManageService', 'systemAppService', function ($scope, $timeout, $location, customersCenterService, homeManageService, systemAppService) {
        $scope.navs = [];
        $scope.parentMenus = [];
        $scope.rootMenu = {};
        $scope.currentMenu = {};
        $scope.isMain = false;

        $scope.loadMenus = function () {
            for (var n in $scope.opCenterMenus) {
                var menu = $scope.opCenterMenus[n];
                if (menu.pmenuid == '0') {
                    $scope.rootMenu = menu;
                }
            }

            for (var n in $scope.opCenterMenus) {
                var menu = $scope.opCenterMenus[n];
                if (menu.pmenuid == $scope.rootMenu.menuid) {
                    menu.href = '/' + menu.name.split('.')[0] + '/' + menu.name.split('.')[1];
                    $scope.parentMenus.push(menu);
                    if ($location.path().indexOf(menu.href) != -1) {
                        $scope.currentMenu = menu;
                    }
                }
            }

            for (var n in $scope.opCenterMenus) {
                var menu = $scope.opCenterMenus[n];
                if (menu.pmenuid == $scope.currentMenu.menuid) {
                    $scope.navs.push({
                        name: menu.name,
                        href: '/' + menu.name.split('.')[0] + '/' + menu.name.split('.')[1] + '/' + menu.name.split('.')[2],
                        menu: menu.menu
                    });
                }
            }

            if ($location.path() == $scope.currentMenu.href) {
                if ($scope.navs && $scope.navs.length > 0) {
                    $location.path($scope.navs[0].href);
                }
            }

            if ($location.path() == $scope.rootMenu.href) {
                $scope.isMain = true;
            } else {
                $scope.isMain = false;
            }
        }

        if ($scope.opCenterMenus && $scope.opCenterMenus.length > 0) {
            $scope.loadMenus();
        }

        $scope.$on('appService.menus.update', function (event) {
            $scope.loadMenus();
        });

        $scope.isActive = function (route) {
            return route === $location.path();
        };
        $scope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.url == $scope.rootMenu.href) {
                    $scope.isMain = true;
                } else {
                    $scope.isMain = false;
                }
            });

        ////获取实时消息分类数量
        //$scope.getMessageGroup = function () {
        //    systemAppService.messageService.getMessageList(user.permissions.parkid).then(function (response) {
        //
        //        if (response.data && response.data.code == "200") {
        //            if (response.data.body.totalRecords && response.data.body.totalRecords > 0) {
        //                $scope.type_count_6 = [];
        //                $scope.type_count_7 = [];
        //
        //                response.data.body.data.forEach(function (message) {
        //                    switch (message.msgtype) {
        //                        case "6":
        //                            $scope.type_count_6.push(message);
        //                            break;
        //                        case "7":
        //                            $scope.type_count_7.push(message);
        //                            break;
        //                    }
        //                });
        //            }
        //        }
        //    });
        //}
        //
        ////获取企业待审核数量
        //$scope.getMplatEnterpriseCount = function () {
        //    systemAppService.messageService.getMplatEnterpriseCount().then(function (response) {
        //
        //        if (response.data && response.data.code == "200") {
        //            if (response.data.body.totalRecords && response.data.body.totalRecords > 0) {
        //                $scope.real_count = response.data.body.totalRecords;
        //            }
        //        }
        //    });
        //}
        //
        ////获取未回消息复数量
        //$scope.getCmMessageCount = function () {
        //    systemAppService.messageService.getCmMessageCount().then(function (response) {
        //
        //        if (response.data && response.data.code == "200") {
        //            if (response.data.body.totalRecords && response.data.body.totalRecords > 0) {
        //                $scope.customer_count = response.data.body.totalRecords;
        //            }
        //        }
        //    });
        //}


        //$scope.getMessageGroup();
        //$scope.getMplatEnterpriseCount();
        //$scope.getCmMessageCount();
    }]);
