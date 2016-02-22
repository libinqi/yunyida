// 'use strict';
// angular.module('opCenterApp', [
//     'ngCookies',
//     'ngResource',
//     'ngSanitize',
//     'ui.router',
//     'ui.bootstrap',
//     'ui.tree',
//     'ui.tree-filter',
//     'ui.highlight',
//     'commonApp'
// ])
//     .constant('propertyRoutes',
//     [
//         {name: 'property', url: '/property', templateUrl: '/app/operationCenter/views/propertyManage/list.html', menu: '物业管理'},
//         {name: 'property.facadeManage', url: '/facadeManage', templateUrl: '/app/operationCenter/views/propertyManage/facadeManage/list.html', menu: '门面管理'},
//         {name: 'property.rentManage', url: '/rentManage', templateUrl: '/app/operationCenter/views/propertyManage/rentManage/list.html', menu: '房租管理'},
//         {name: 'property.utilitiesManage', url: '/utilitiesManage', templateUrl: '/app/operationCenter/views/propertyManage/utilitiesManage/list.html', menu: '水电费管理'}
//     ])
//     .config(['$stateProvider', '$urlRouterProvider', 'propertyRoutes', function ($stateProvider, $urlRouterProvider, propertyRoutes) {
//         var route;
//         for (route in  propertyRoutes) {
//             $stateProvider.state(propertyRoutes[route].name, {
//                 url: propertyRoutes[route].url,
//                 templateUrl: propertyRoutes[route].templateUrl,
//                 menu: propertyRoutes[route].menu
//             });
//         }

//         $urlRouterProvider.otherwise('');
//     }])
//     .run(['$rootScope', 'propertyRoutes', 'systemAppService', function ($rootScope, propertyRoutes, systemAppService) {
//         var propertyMenus = [];
//         (function () {
//             var menu;
//             var route;
//             for (route in propertyRoutes) {
//                 menu = propertyRoutes[route];
//                 if (menu.name.indexOf('.') > 0) {
//                     menu.href = '/' + menu.name.split('.')[0] + '/' + menu.name.split('.')[1];
//                     menu.name = menu.name.split('.')[1];
//                     propertyMenus.push(menu);
//                 }
//             }
//         })();
//         $rootScope.propertyMenus = propertyMenus;
//     }])
//     .controller('propertyIndexCtrl', ['$scope', '$location', function ($scope, $location) {
//         $scope.navs = $scope.propertyMenus;
//         $scope.isActive = function (route) {
//             return route === $location.path();
//         };
//     }]);
