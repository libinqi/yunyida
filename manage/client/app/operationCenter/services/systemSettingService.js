/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var opServiceApp = angular.module('opCenterApp');
var systemSettingService = opServiceApp.factory('systemSettingService', ['$http', function ($http) {
    return {
        getDeptList: function () {
            var result = $http.get(loc_host + '/ws/system/sysDept/getList').then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getDeptById: function (deptId) {
            var result = $http.get(loc_host + '/ws/system/sysDept/queryById', {params: {deptid: deptId}}).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        checkDeptName: function (deptName) {
            var result = $http.get(loc_host + '/ws/system/sysDept/checkDeptNameIsExist', {params: {deptname: deptName}}).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateDept: function (dept) {
            var result = $http.post(loc_host + '/ws/system/sysDept/saveOrUpdate', dept).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        deleteDept: function (deptId) {
            var result = $http.delete(loc_host + '/ws/system/sysDept/delete/' + deptId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getStaffList: function (page, rows, deptid, roleid, usertype, username, realname, phone) {
            var result = $http.get(loc_host + '/ws/system/sysUser/getList', {
                params: {
                    page: page,
                    rows: rows,
                    deptid: deptid,
                    roleid: roleid,
                    usertype: usertype,
                    username: username,
                    realname: realname,
                    phone: phone
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getStaffListByRoleId: function (roleId) {
            var result = $http.get(loc_host + '/ws/system/sysUser/getUsersByRoleId/' + roleId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getNotAssignStaff: function () {
            var result = $http.get(loc_host + '/ws/system/sysUser/getNotAssignUsers').then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateStaff: function (staff) {
            var result = $http.post(loc_host + '/ws/system/sysUser/saveOrUpdate', staff).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        deleteStaff: function (staffId) {
            var result = $http.delete(loc_host + '/ws/system/sysUser/delete/' + staffId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        batchDelStaff: function (staffIds) {
            var result = $http.delete(loc_host + '/ws/system/sysUser/batchDelete/' + staffIds).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        checkStaffName: function (staffName) {
            var result = $http.get(loc_host + '/ws/system/sysUser/checkIsExist', {params: {username: staffName}}).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        checkStaffPhone: function (staffPhone) {
            var result = $http.get(loc_host + '/ws/system/sysUser/checkIsExist', {params: {phone: staffPhone}}).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        changeStaffPwd: function (staffId, pwd) {
            var result = $http.post(loc_host + '/ws/system/sysUser/resetPwd', {
                userid: staffId,
                newpassword: pwd
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getAppList: function () {
            var result = $http.get(loc_host + '/ws/system/sysApplication/getList', {
                params: {
                    status: '1'
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        getMenuList: function (page, rows, appId, menuName, status) {
            var result = $http.get(loc_host + '/ws/system/sysMenu/getList', {
                params: {
                    page: page,
                    rows: rows,
                    applicationid: appId,
                    menuname: menuName,
                    status: status
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        getMenuById: function (menuId) {
            var result = $http.get(loc_host + '/ws/system/sysMenu/queryById/' + menuId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        getMenuByRoleId: function (roleId) {
            var result = $http.get(loc_host + '/ws/system/sysMenu/getMenusByRoleId/' + roleId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        saveOrUpdateMenu: function (menu) {
            var result = $http.post(loc_host + '/ws/system/sysMenu/saveOrUpdate', menu).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        deleteMenu: function (menuId) {
            var result = $http.delete(loc_host + '/ws/system/sysMenu/delete/' + menuId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        batchDelMenu: function (menuIds) {
            var result = $http.delete(loc_host + '/ws/system/sysMenu/batchDelete/' + menuIds).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        checkMenuName: function (appId, menuName) {
            var result = $http.get(loc_host + '/ws/system/sysMenu/checkMenuNameIsExist', {
                params: {
                    applicationid: appId,
                    menuname: menuName
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getRoleList: function (page, rows, roleName, status) {
            var result = $http.get(loc_host + '/ws/system/sysRole/getList', {
                params: {
                    page: page,
                    rows: rows,
                    rolename: roleName,
                    status: status
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        getRoleById: function (roleId) {
            var result = $http.get(loc_host + '/ws/system/sysRole/queryById/' + roleId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                });
            return result;
        },
        saveOrUpdateRole: function (role) {
            var result = $http.post(loc_host + '/ws/system/sysRole/saveOrUpdate', role).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        deleteRole: function (roleId) {
            var result = $http.delete(loc_host + '/ws/system/sysRole/delete/' + roleId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        checkRoleName: function (roleName) {
            var result = $http.get(loc_host + '/ws/system/sysRole/checkNameIsExist', {
                params: {
                    rolename: roleName
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateRoleUsers: function (roleId, userIds) {
            var result = $http.post(loc_host + '/ws/system/sysRole/saveOrUpdateRoleUsers', {
                roleid: roleId,
                userids: userIds
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateRoleMenus: function (roleId, menuIds) {
            var result = $http.post(loc_host + '/ws/system/sysRole/saveOrUpdateRoleMenus', {
                roleid: roleId,
                menuids: menuIds
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        cancleRoleGrants: function (userIds) {
            var result = $http.delete(loc_host + '/ws/system/sysRole/cancleRoleGrants/'+userIds).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        GetDictionaryLists: function (dict) {
            var result = $http.get(loc_host + '/ws/system/sysDict/getList/',  {params:dict}).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        GetPDictLists: function (dic) {
            var result = $http.get(loc_host + '/ws/system/sysDict/getDictListByParentDictCode/'+ dic).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        DeleteDictById: function (dict) {
            var result = $http.delete(loc_host + '/ws/system/sysDict/delete/'+ dict).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        GetDictById: function (id) {
            var result = $http.get(loc_host + '/ws/system/sysDict/queryById/'+ id).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        SaveOrUpdateDict: function (dict) {
            var result = $http.post(loc_host + '/ws/system/sysDict/saveOrUpdate/', dict).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        }
    };
}]);
//Mock.mockjax(opServiceApp);
