/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var deptApp = angular.module('opCenterApp');
deptApp.controller('menuAddCtrl', ['$scope', 'dialog', 'systemSettingService', function ($scope, dialog, systemSettingService) {
    $scope.menu = {
        menuid: '',//菜单ID（修改时为必填
        menuname: '',//菜单名称
        pmenuid: '0',//上级菜单ID
        menuurl: '',//菜单页面链接
        menuorder: '',//菜单排序
        menudesc: '',//菜单描述
        menuicon: '', //菜单图标
        status: 1, //菜单图标
        applicationid: '',//所属应用ID
        applicationname: ''
    };

    $scope.menus = [];

    $scope.getMenus = function (appId) {
        systemSettingService.getMenuList('1',
            '100',
            appId,
            '',
            '1').then(function (response) {
                if (response.data && response.data.code == "200") {
                    $scope.menus = response.data.body.data;
                }
            });
    }

    if ($scope.menuId) {
        systemSettingService.getMenuById($scope.menuId).then(function (response) {
            if (response.data && response.data.code == "200") {
                var menu = response.data.body;
                if (menu) {
                    $scope.menu = menu;
                    $scope.getMenus(menu.applicationid);
                }
            }
        });
    }

    $scope.$watch('menu.applicationid',function(newValue){
        if(!_.isEmpty(newValue))
        {
            $scope.getMenus(newValue);
        }
    });

    $scope.menuUpdate = function () {
        systemSettingService.saveOrUpdateMenu($scope.menu).then(function (response) {
            if (response.data && response.data.code == "200") {
                if ($scope.menu.menuid) {
                    dialog.notify('更新菜单成功！', 'success');
                }
                else {
                    dialog.notify('添加菜单成功！', 'success');
                }
                $scope.menuForm.submitted = true;
                $scope.closeThisDialog(true);
            }
            else {
                dialog.notify(response.data.msg, 'error');
                $scope.closeThisDialog(false);
            }
        });
    };

    $scope.menuCancel = function () {
        $scope.closeThisDialog(null);
    };

}]);
