/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';
//if (!window.user) {
//    window.user = userService.getUser();
//    if (!window.user) {
//        window.location.href = '/app/common/views/login.html';
//    } else if (window.user.username != 'admin') {
//        if (!window.user.permissions || !window.user.permissions.application || window.user.permissions.application.length == 0) {
//            window.location.href = '/app/common/views/unAudit.html';
//        }
//    }
//}

angular.module('commonApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router'
    ])
    .run(['$rootScope', '$filter', '$location', '$timeout', 'systemAppService', function ($rootScope, $filter, $location, $timeout, systemAppService) {
        // 系统初始化
        // 加载当前登录用户
        $rootScope.user = {
            duties: "系统管理员",
            password: "e10adc3949ba59abbe56e057f20f883e",
            phone: "15388948861",
            qq: "",
            realname: "系统管理员",
            userid: "e10adc3949ba59abbe56e057f20f883e",
            username: "admin",
            usertype: "4",
            usertypename: "运营系统管理员"
        };
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
