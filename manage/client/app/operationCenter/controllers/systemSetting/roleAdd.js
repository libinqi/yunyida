/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var roleApp = angular.module('opCenterApp');
roleApp.controller('roleAddCtrl', ['$scope', '$filter', 'dialog', 'systemSettingService', function ($scope, $filter, dialog, systemSettingService) {
    var vm = this;
    $scope.role = {
        roleid: '',
        rolename: '',
        roledesc: '',
        status: '1'
    };

    vm.appList = [];
    $scope.getAppList = function () {
        systemSettingService.getAppList().then(function (response) {
            if (response.data && response.data.code == "200") {
                var orderBy = $filter('orderBy');
                vm.appList = orderBy(response.data.body.data, 'apporder', false);
                if (vm.appList.length > 0) {
                    for (var n in vm.appList) {
                        $scope.getMenuByApp(vm.appList[n]);
                    }
                }
            }
        });
    }
    $scope.getAppList();

    vm.roleMenus = [];
    $scope.getMenuByRole = function () {
        if (!$scope.roleId) return;
        systemSettingService.getMenuByRoleId($scope.roleId).then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.roleMenus = response.data.body;
            }
        });
    }
    $scope.getMenuByRole();

    $scope.getMenuByApp = function (app) {
        systemSettingService.getMenuList(1, 100, app.applicationid, '', '1').then(function (response) {
            if (response.data && response.data.code == "200") {
                var orderBy = $filter('orderBy');
                app.menus = orderBy(response.data.body.data, 'menuorder', false);

                var map = {}, node, roots = [];
                for (var i = 0; i < app.menus.length; i++) {
                    node = app.menus[i];
                    if (node.pmenuid && node.pmenuid == "0") {
                        app.menus.splice(i, 1);
                    }
                }
                for (var i = 0; i < app.menus.length; i++) {
                    node = app.menus[i];
                    node.menus = [];
                    map[node.menuid] = i; // use map to look-up the parents
                }
                for (var i = 0; i < app.menus.length; i++) {
                    node = app.menus[i];
                    node.selected = false;
                    if (node.pmenuid && map[node.pmenuid] > 0) {
                        node.parentMenu = app.menus[map[node.pmenuid]];
                        app.menus[map[node.pmenuid]].menus.push(node);
                    } else {
                        roots.push(node);
                    }
                    for (var m = 0; m < vm.roleMenus.length; m++) {
                        if (vm.roleMenus[m].menuid == node.menuid) {
                            node.selected = true;
                        }
                    }
                }
                app.menus = roots;
            }
        });
    };

    $scope.selectItem = function (item) {
        var selected = true;
        if (item.selected) {
            selected = false;
        }
        else {
            selected = true;
        }

        item.selected = selected;

        if (item.menus.length > 0) {
            for (var i = 0; i < item.menus.length; i++) {
                item.menus[i].selected = selected;
            }
        }
        else if (item.parentMenu) {
            var count = 0;
            for (var i = 0; i < item.parentMenu.menus.length; i++) {
                if (item.parentMenu.menus[i].selected == selected) {
                    count++;
                }
            }
            if (item.parentMenu.menus.length == count) {
                item.parentMenu.selected = selected;
            }
            else if (selected == true) {
                item.parentMenu.selected = true;
            }
        }
    }

    if ($scope.roleId) {
        systemSettingService.getRoleById($scope.roleId).then(function (response) {
            if (response.data && response.data.code == "200") {
                $scope.role = response.data.body;
            }
        });
    }

    $scope.roleUpdate = function () {
        var menuIds = [];
        var menus = [];
        var menu = {};
        var childMenu = {};
        for (var n in vm.appList) {
            menus = vm.appList[n].menus;
            for (var i in menus) {
                menu = menus[i];
                if (menu.selected) {
                    menuIds.push(menu.menuid);
                }
                if (menu.menus.length > 0) {
                    for (var c in menu.menus) {
                        childMenu = menu.menus[c];
                        if (childMenu.selected) {
                            menuIds.push(childMenu.menuid);
                        }
                    }
                }
            }
        }
        systemSettingService.saveOrUpdateRole($scope.role).then(function (response) {
            if (response.data && response.data.code == "200") {
                if ($scope.role.roleid) {
                    dialog.notify('更新岗位成功！', 'success');
                    systemSettingService.saveOrUpdateRoleMenus($scope.roleId, menuIds.join()).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            if ($scope.role.roleid) {
                                dialog.notify('更新岗位权限成功！', 'success');
                            }
                            $scope.roleForm.submitted = true;
                            $scope.closeThisDialog(true);
                        }
                        else {
                            dialog.notify(response.data.msg, 'error');
                            $scope.closeThisDialog(false);
                        }
                    });
                }
                else {
                    dialog.notify('添加岗位成功！', 'success');
                    systemSettingService.saveOrUpdateRoleMenus(response.data.body.roleid, menuIds.join()).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('添加岗位权限成功！', 'success');
                            $scope.roleForm.submitted = true;
                            $scope.closeThisDialog(true);
                        }
                        else {
                            dialog.notify(response.data.msg, 'error');
                            $scope.closeThisDialog(false);
                        }
                    });
                }
                $scope.roleForm.submitted = true;
//                $scope.closeThisDialog(true);
            }
            else {
                dialog.notify(response.data.msg, 'error');
//                $scope.closeThisDialog(false);
            }
        });
    };

    $scope.roleCancel = function () {
        $scope.closeThisDialog(null);
    };

}])
;
