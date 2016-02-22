/**
 * Created by libinqi on 2015/6/7.
 */
'use strict';

var deptApp = angular.module('opCenterApp');
deptApp.controller('menuSettingCtrl', ['$scope', 'dialog', '$filter', 'systemSettingService', function ($scope, dialog, $filter, systemSettingService) {
    var vm = this;
    vm.menuList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            menuName: '',
            appId: '',
            status: ''
        },
        items: []
    };

    vm.appList = [];
    $scope.getAppList = function () {
        systemSettingService.getAppList().then(function (response) {
            if (response.data && response.data.code == "200") {
                var orderBy = $filter('orderBy');
                vm.appList = orderBy(response.data.body.data, 'apporder', false);
            }
        });
    }
    $scope.getAppList();

    $scope.getMenuList = function () {
        systemSettingService.getMenuList(vm.menuList.totalItems == 0 ? 1 : vm.menuList.currentPage,
            vm.menuList.itemsPerPage,
            vm.menuList.query.appId,
            vm.menuList.query.menuName,
            vm.menuList.query.status).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.menuList.items = response.data.body.data;
                    if (vm.menuList.items.length > 0) {
                        vm.menuList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.menuList.totalItems = 0;
                    }
                }
            });
    }
    $scope.getMenuList();
    $scope.$watch('vm.menuList.currentPage + vm.menuList.itemsPerPage', $scope.getMenuList);

    vm.item_ids = [];
    vm.allSelected = false;
    $scope.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach(vm.menuList.items, function (item, key) {
                if (vm.item_ids.indexOf(item.menuid) == -1) {
                    vm.item_ids.push(item.menuid);
                    vm.menuList.items[key].selected = true;
                }
            });
        }
        else {
            angular.forEach(vm.menuList.items, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.menuid), 1);
                vm.menuList.items[key].selected = false;
            });
        }
    };

    $scope.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.menuid);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.menuid), 1);
        }
        if (vm.item_ids.length == vm.menuList.items.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != vm.menuList.items.length) {
            vm.allSelected = false;
        }
    };

    $scope.queryClick = function () {
        $scope.getMenuList();
    };

    $scope.delClick = function (menuId) {
        dialog.confirmDialog('您确定要删除此菜单吗？').then(function (data) {
            if (data) {
                systemSettingService.deleteMenu(menuId).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('菜单删除成功！', 'success');
                        $scope.getMenuList();
                    }
                    else {
//                        dialog.notify('菜单删除失败，可能是系统异常，请联系系统管理员！', 'error');
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    $scope.batchDelClick = function () {
        if (vm.item_ids.length > 0) {
            dialog.confirmDialog('您确定要批量删除选择的菜单吗？').then(function (data) {
                if (data) {
                    systemSettingService.batchDelMenu(vm.item_ids.splice(',')).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('批量删除菜单成功！', 'success');
                            $scope.getMenuList();
                            vm.allSelected = false;
                        }
                        else {
//                            dialog.notify('批量删除菜单失败，可能是系统异常，请联系系统管理员！', 'error');
                            dialog.notify(response.data.msg, 'error');
                        }
                    });
                }
            });
        }
        else {
            dialog.notify('您没有选择任何菜单！', 'warn');
        }
    };

    $scope.disableMenuClick = function (menuId, status) {
        try {
            systemSettingService.getMenuById(menuId).then(function (response) {
                if (response.data && response.data.code == "200") {
                    var menu = response.data.body;
                    if (menu) {
                        menu.status = status;
                        systemSettingService.saveOrUpdateMenu(menu).then(function (response) {
                            if (response.data && response.data.code == "200") {
                                var statusText = status == 1 ? '启用' : '禁用';
                                dialog.notify(statusText + '菜单(' + menu.menuname + ')成功！', 'success');
                                $scope.getMenuList();
                            }
                        });
                    }
                }
            });
        }
        catch (ex) {
            dialog.notify('更改菜单状态失败，可能是系统异常，请联系系统管理员！', 'error');
        }
    };

    $scope.menuModalTitle = '';

    $scope.addMenuClick = function () {
        $scope.menuModalTitle = '新增菜单';
        $scope.appList = vm.appList;
        $scope.menuList = vm.menuList.items;
        $scope.menuId = '';

        dialog.open({
            template: 'app/operationCenter/views/systemSetting/menuAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'menuAddCtrl',
            preCloseCallback: function (data) {
                if(data)
                {
                    $scope.getMenuList();
                }
            }
        });
    };

    $scope.editMenuClick = function (menuId) {
        $scope.menuModalTitle = '编辑菜单';
        $scope.appList = vm.appList;
        $scope.menuList = [];
        var menu = {};
        for (var n in vm.menuList.items) {
            menu = vm.menuList.items[n];
            if (menu.menuid !== menuId) {
                $scope.menuList.push(menu);
            }
        }
        $scope.menuId = menuId;

        dialog.open({
            template: 'app/operationCenter/views/systemSetting/menuAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'menuAddCtrl',
            preCloseCallback: function (data) {
                if(data)
                {
                    $scope.getMenuList();
                }
            }
        });
    };

    $scope.ResetQuery = function(){
        vm.menuList.query.menuName = "";
        vm.menuList.query.appId = "";
        vm.menuList.query.status = "";
        vm.menuList.currentPage = 1;
        $scope.getMenuList();
    };

}]);
