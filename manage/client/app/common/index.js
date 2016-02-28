/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';
if (!window.user) {
    window.user = userService.getUser();
    if (!window.user) {
        window.location.href = '/app/common/views/login.html';
    }
}

angular.module('commonApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router'
    ])
    .run(['$rootScope', '$filter', '$location', '$timeout', 'systemAppService', function ($rootScope, $filter, $location, $timeout, systemAppService) {
        // 系统初始化
        // 加载当前登录用户
        $rootScope.user = window.user;
        $rootScope.parkInfo = window.parkInfo;
        systemAppService.userService.userInfo = window.user;

        $timeout(function () {
            systemAppService.appService.getAppList();
            systemAppService.dictService.getDicts();
            $rootScope.$on('appService.apps.load', function (event) {
                systemAppService.menuService.getMenuList();
                $location.path('/opCenter');
            });
        });
    }]);
