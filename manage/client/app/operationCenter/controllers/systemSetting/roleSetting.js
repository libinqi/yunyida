/**
 * Created by libinqi on 2015/6/10.
 */
'use strict';

var roleApp = angular.module('opCenterApp');
roleApp.controller('roleSettingCtrl', ['$scope', '$http', 'dialog', '$filter', '$timeout', 'systemSettingService', function ($scope, $http, dialog, $filter, $timeout, systemSettingService) {
    var vm = this;
    vm.roleList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            roleName: '',
            status: ''
        },
        items: []
    };

    $scope.getRoleList = function () {
        systemSettingService.getRoleList(vm.roleList.totalItems == 0 ? 1 : vm.roleList.currentPage,
            vm.roleList.itemsPerPage,
            vm.roleList.query.roleName,
            vm.roleList.query.status).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.roleList.items = response.data.body.data;
                    if (vm.roleList.items.length > 0) {
                        vm.roleList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.roleList.totalItems = 0;
                    }
                }
            });
    }
    $scope.getRoleList();
    $scope.$watch('vm.roleList.currentPage + vm.roleList.itemsPerPage', $scope.getRoleList);

    $scope.queryClick = function () {
        $scope.getRoleList();
    };

    $scope.delClick = function (roleId) {
        dialog.confirmDialog('删除岗位后，岗位成员权限会被回收，您确定要删除吗？').then(function (data) {
            if (data) {
                systemSettingService.deleteRole(roleId).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('岗位删除成功！', 'success');
                        $scope.getRoleList();
                        $scope.getAuthRoleList();
                    }
                    else {
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    $scope.disableRoleClick = function (roleId, status) {
        try {
            systemSettingService.getRoleById(roleId).then(function (response) {
                if (response.data && response.data.code == "200") {
                    var role = response.data.body;
                    if (role) {
                        role.status = status;
                        systemSettingService.saveOrUpdateRole(role).then(function (response) {
                            if (response.data && response.data.code == "200") {
                                var statusText = status == 1 ? '启用' : '禁用';
                                dialog.notify(statusText + '岗位(' + role.rolename + ')成功！', 'success');
                                $scope.getRoleList();
                            }
                        });
                    }
                }
                else {
                    dialog.notify(response.data.msg, 'error');
                }
            });
        }
        catch (ex) {
            dialog.notify('更改岗位状态失败，可能是系统异常，请联系系统管理员！', 'error');
        }
    };

    vm.authRoleList = [];
    $scope.getAuthRoleList = function () {
        systemSettingService.getRoleList('1', '10000', '', '1').then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.authRoleList = response.data.body.data;
                if (vm.authRoleList.length > 0) {
                    $scope.authRoleId = vm.authRoleList[0].roleid;
                    $scope.roleChange($scope.authRoleId);
                }
            }
        });
    }
    $scope.getAuthRoleList();

    $scope.roleAuthClick = function (roleId) {
        $scope.authRoleId = roleId;
        $scope.roleChange(roleId);
        vm.activeTab = 2;
    }

//    vm.authUserList = [];
//    vm.unAuthUserList = [];
//    vm.selectUserIds = [];
//    vm.unSelectUserIds = [];

    $scope.roleChange = function (roleId) {
        vm.authUserList = [];
        vm.unAuthUserList = [];
        vm.selectUserIds = [];
        vm.unSelectUserIds = [];
        $scope.authRoleId = roleId;

        $timeout(function () {
            systemSettingService.getStaffListByRoleId(roleId).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.authUserList = response.data.body;
                }
            });
            systemSettingService.getNotAssignStaff().then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.unAuthUserList = response.data.body;
                }
            });
        },800);
    }

    $scope.selectUser = function (item) {
        if (vm.selectUserIds.indexOf(item.userid) != -1) {
            vm.selectUserIds.splice(vm.selectUserIds.indexOf(item.userid), 1);
            item.selected = false;
        }
        else {
            vm.selectUserIds.push(item.userid);
            item.selected = true;
        }
    }

    $scope.unSelectUser = function (item) {
        if (vm.unSelectUserIds.indexOf(item.userid) != -1) {
            vm.unSelectUserIds.splice(vm.unSelectUserIds.indexOf(item.userid), 1);
            item.selected = false;
        }
        else {
            vm.unSelectUserIds.push(item.userid);
            item.selected = true;
        }
    }

    $scope.moveSelectUser = function () {
        var item_index = [], userid, user;
        for (var i in vm.selectUserIds) {
            userid = vm.selectUserIds[i];
            (function (userid) {
                for (var i in vm.authUserList) {
                    user = vm.authUserList[i];
                    if (user.userid == userid) {
                        vm.unAuthUserList.push(user);
                        vm.unSelectUserIds.push(user.userid);
                        vm.authUserList.splice(i, 1);
                    }
                }
            })(userid);
            item_index.push(userid);
        }

        for (var i in item_index) {
            vm.selectUserIds.splice(vm.selectUserIds.indexOf(item_index[i]), 1);
        }
    }

    $scope.moveUnSelectUser = function () {
        var item_index = [], userid, user;
        for (var i in vm.unSelectUserIds) {
            userid = vm.unSelectUserIds[i];
            (function (userid) {
                for (var i in vm.unAuthUserList) {
                    user = vm.unAuthUserList[i];
                    if (user.userid == userid) {
                        vm.authUserList.push(user);
                        vm.selectUserIds.push(user.userid);
                        vm.unAuthUserList.splice(i, 1);
                    }
                }
            })(userid);
            item_index.push(userid);
        }

        for (var i in item_index) {
            vm.unSelectUserIds.splice(vm.unSelectUserIds.indexOf(item_index[i]), 1);
        }
    }

    $scope.moveAllSelectUser = function () {
        vm.unAuthUserList = vm.unAuthUserList.concat(vm.authUserList);
        vm.authUserList.splice(0, vm.authUserList.length);
        vm.unSelectUserIds = vm.unSelectUserIds.concat(vm.selectUserIds);
        vm.selectUserIds.splice(0, vm.selectUserIds.length);
    }

    $scope.moveAllUnSelectUser = function () {
        vm.authUserList = vm.authUserList.concat(vm.unAuthUserList);
        vm.unAuthUserList.splice(0, vm.unAuthUserList.length);
        vm.selectUserIds = vm.selectUserIds.concat(vm.unSelectUserIds);
        vm.unSelectUserIds.splice(0, vm.unSelectUserIds.length);
    }

    $scope.resetUserAuth = function () {
        vm.authUserList = [];
        vm.unAuthUserList = [];
        vm.selectUserIds = [];
        vm.unSelectUserIds = [];

        $scope.roleChange($scope.authRoleId);
    }

    $scope.saveUserAuth = function () {
        if (vm.authUserList.length > 0) {
            var userIds = [];
            for (var n in vm.authUserList) {
                userIds.push(vm.authUserList[n].userid);
            }
            systemSettingService.saveOrUpdateRoleUsers($scope.authRoleId, userIds.join()).then(function (response) {
                if (response.data && response.data.code == "200") {
                    dialog.notify('岗位岗位人员授权成功！', 'success');
                }
                else {
                    dialog.notify(response.data.msg, 'error');
                }
            });
        }

        if (vm.unAuthUserList.length > 0) {
            var unUserIds = [];
            for (var n in vm.unAuthUserList) {
                unUserIds.push(vm.unAuthUserList[n].userid);
            }
            systemSettingService.cancleRoleGrants(unUserIds.join()).then(function (response) {
                if (response.data && response.data.code == "200") {
                    dialog.notify('岗位岗位人员授权成功！', 'success');
                }
                else {
                    dialog.notify(response.data.msg, 'error');
                }
            });
        }
    }

    $scope.roleModalTitle = '';

    $scope.addRoleClick = function () {
        $scope.roleModalTitle = '新增岗位';
        $scope.roleId = '';

        dialog.open({
            template: 'app/operationCenter/views/systemSetting/roleAdd.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            controller: 'roleAddCtrl',
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getRoleList();
                    $scope.getAuthRoleList();
                }
            }
        });
    };

    $scope.editRoleClick = function (roleId) {
        $scope.roleModalTitle = '编辑菜单';
        $scope.roleId = roleId;

        dialog.open({
            template: 'app/operationCenter/views/systemSetting/roleAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'roleAddCtrl',
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getRoleList();
                    $scope.getAuthRoleList();
                }
            }
        });
    };

    $scope.ResetQuery = function(){
        vm.roleList.query.roleName = "";
        vm.roleList.query.status = "";
        vm.roleList.currentPage = 1;
        $scope.getRoleList();
    };

}]);
