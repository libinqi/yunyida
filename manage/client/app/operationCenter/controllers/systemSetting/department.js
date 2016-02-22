/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var deptApp = angular.module('opCenterApp');
deptApp.controller('departmentCtrl', ['$scope', '$http', 'dialog', '$filter', 'systemSettingService', function ($scope, $http, dialog, $filter, systemSettingService) {
    var vm = this;

    $scope.dept = {};
    $scope.initDept = function () {
        $scope.dept = {
            deptid: '',
            deptname: '',
            deptphone: '',
            deptcontact: '',
            deptdesc: '',
            pdeptid: '',
            status: '1',
            deptorder: '1',
            enterpriseid: ''
        };
    };

    $scope.staff = {};
    $scope.initStaff = function () {
        $scope.staff = {
            userid: '',   //用户ID（修改时为必填）
            username: '',   //工号
            realname: '',   //姓名
            password: '',   //密码（若不填则使用默认密码123456）
            sex: '0',   //性别
            //age: '',  //年龄
            duties: '',  //职务
            //entrydate: '',   //入职时间
            //useridsn: '',   //身份证
            //useridsnurl: '',   //身份证URL
            phone: '',  //联系电话
            email: '',  //电子邮箱
            deptid: '',  //所属部门ID
            deptname: '',  //所属部门名称
            roleid: '',  //岗位ID
            usertype: '0',  //用户类型
            //usertypename: '', //用户类型名
            status: '0',   //用户状态
            //createsuer: '',  //创建人
            //createtime: '', //创建时间
            //updateuser: '',   //修改人
            //updatetime: '',  //修改时间
            description: ''  //备注
            // islocked: "1",		//用户是否被锁，1:正常  0:锁住
            //enterpriseid: ''	// 企业ID
        };
    };

    $scope.deptModalTitle = {};
    $scope.staffModalTitle = {};

    $scope.deptList = {
//    currentPage: 1,
//    itemsPerPage: 10,
        items: []
    };

    $scope.staffList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            deptid: '',
            roleid:'',
            realname: '',
            phone: '',
            usertype:'0',
            username: ''
        },
        items: []
    };

    $scope.roleList=[];
    $scope.getRoleList = function () {
        systemSettingService.getRoleList('1', '10000','','1').then(function (response) {
            if (response.data && response.data.code == "200") {
                $scope.roleList = response.data.body.data;
            }
        });
    }
    $scope.getRoleList();

    vm.deptTreeData = [];

    $scope.treeFilter = $filter('uiTreeFilter');
    $scope.availableFields = ['deptname'];
    $scope.supportedFields = ['deptname'];

    $scope.toggleSupport = function (propertyName) {
        return $scope.supportedFields.indexOf(propertyName) > -1 ?
            $scope.supportedFields.splice($scope.supportedFields.indexOf(propertyName), 1) :
            $scope.supportedFields.push(propertyName);
    };

    $scope.getDeptList = function () {
        systemSettingService.getDeptList().then(function (response) {
            if (response.data && response.data.code == "200") {
                $scope.deptList.items = response.data.body.data;
                if ($scope.deptList.items.length > 0) {
                    $scope.generateDeptTree();
                }
            }
        });
    };

    $scope.generateDeptTree = function () {
        if ($scope.deptList.items.length > 0) {
            var map = {}, node, roots = [];
            for (var i = 0; i < $scope.deptList.items.length; i++) {
                node = $scope.deptList.items[i];
                node.items = [];
                map[node.deptid] = i; // use map to look-up the parents
                if (node.pdeptid && node.pdeptid !== "0") {
                    $scope.deptList.items[map[node.pdeptid]].items.push(node);
                } else {
                    roots.push(node);
                }
            }
            vm.deptTreeData = roots;
        }
    };

    vm.selectedItem = {};

    vm.options = {};

    $scope.removeDeptClick = function (scope) {
        dialog.confirmDialog('删除部门后会将下面的人员转移到上级部门，您确定要删除吗？').then(function (data) {
            if (data) {
                var deptid = scope.$nodeScope.$modelValue.deptid;
                systemSettingService.deleteDept(deptid).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('删除部门成功！', 'success');
                        scope.remove();
                        if ($scope.selectedItem) {
                            $scope.staffList.query.deptid = $scope.selectedItem.pdeptid;
                            $scope.getStaffList();
                        }
                        else {
                            $scope.staffList.query.deptid = '';
                            $scope.getStaffList();
                        }
                    }
                    else {
                        dialog.notify('删除部门失败，可能是系统异常，请联系系统管理员！', 'error');
                    }
                });
            }
        });
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

    $scope.getDeptList();

    $scope.deptNodeClick = function (selectItem) {
        $scope.selectedItem = selectItem.$parent.$modelValue;

        //清除其他查询条件
        $scope.staffList.query.deptid = '';
        $scope.staffList.query.username = '';
        $scope.staffList.query.realname = '';
        $scope.staffList.query.phone = '';

        if ($scope.selectedItem.pdeptid != "0") {
            $scope.staffList.query.deptid = $scope.selectedItem.deptid;
            $scope.getStaffList();
        }
        else {
            $scope.staffList.query.deptid = '';
            $scope.getStaffList();
        }
    };

    $scope.addDeptClick = function (selectItem) {
        $scope.initDept();
        $scope.deptModalTitle = '新增部门';
        $scope.selectedItem = selectItem.$parent.$modelValue;
        dialog.open({
            template: 'app/operationCenter/views/systemSetting/deptAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'departmentAddCtrl',
            preCloseCallback: function (data) {
            }
        });
    };

    $scope.editDeptClick = function (selectItem) {
        $scope.deptModalTitle = '编辑部门';
        $scope.initDept();
        for (var n in $scope.dept) {
            $scope.dept[n] = selectItem.$parent.$modelValue[n];
        }
        $scope.selectedItem = selectItem.$parent.$nodeScope.$parentNodeScope.$modelValue;
        dialog.open({
            template: 'app/operationCenter/views/systemSetting/deptAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'departmentAddCtrl',
            preCloseCallback: function (data) {
            }
        });
    };

    $scope.getStaffList = function () {
        systemSettingService.getStaffList($scope.staffList.totalItems == 0 ? 1 : $scope.staffList.currentPage,
            $scope.staffList.itemsPerPage,
            $scope.staffList.query.deptid,
            $scope.staffList.query.roleid,
            $scope.staffList.query.usertype,
            $scope.staffList.query.username,
            $scope.staffList.query.realname,
            $scope.staffList.query.phone).then(function (response) {
                if (response.data && response.data.code == "200") {
                    $scope.staffList.items = response.data.body.data;
                    if ($scope.staffList.items.length > 0) {
                        $scope.staffList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        $scope.staffList.totalItems = 0;
                    }
                }
            });
    };

    $scope.getStaffList();
    $scope.$watch('staffList.currentPage + staffList.itemsPerPage', $scope.getStaffList);

    vm.item_ids = [];
    vm.allSelected = false;
    $scope.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach($scope.staffList.items, function (item, key) {
                if (vm.item_ids.indexOf(item.userid) == -1) {
                    vm.item_ids.push(item.userid);
                    $scope.staffList.items[key].selected = true;
                }
            });
        }
        else {
            angular.forEach($scope.staffList.items, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.userid), 1);
                $scope.staffList.items[key].selected = false;
            });
        }
    };

    $scope.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.userid);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.userid), 1);
        }
        if (vm.item_ids.length == $scope.staffList.items.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != $scope.staffList.items.length) {
            vm.allSelected = false;
        }
    };

    $scope.addStaffClick = function () {
        $scope.initStaff();
        $scope.staffModalTitle = '新增人员';
        dialog.open({
            template: 'app/operationCenter/views/systemSetting/staffAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'staffAddCtrl',
            preCloseCallback: function (data) {
                $scope.getStaffList();
            }
        });
    };

    $scope.editStaffClick = function (staff) {
        $scope.staffModalTitle = '编辑人员';
        $scope.initStaff();
        for (var n in $scope.staff) {
            $scope.staff[n] = staff[n];
        }
        $scope.selectedItem = $scope.staff;
        dialog.open({
            template: 'app/operationCenter/views/systemSetting/staffAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            controller: 'staffAddCtrl',
            preCloseCallback: function (data) {
                $scope.getStaffList();
            }
        });
    };

    $scope.delStaffClick = function (staffId) {
        dialog.confirmDialog('您确定要删除此人员吗？').then(function (data) {
            if (data) {
                systemSettingService.deleteStaff(staffId).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('人员删除成功！', 'success');
                        $scope.getStaffList();
                    }
                    else {
                        dialog.notify('人员删除失败，可能是系统异常，请联系系统管理员！', 'error');
                    }
                });
            }
        });
    };

    $scope.batchDelStaffClick = function () {
        if (vm.item_ids.length > 0) {
            dialog.confirmDialog('您确定要批量删除选择的人员吗？').then(function (data) {
                if (data) {
                    systemSettingService.batchDelStaff(vm.item_ids.splice(',')).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('批量删除人员成功！', 'success');
                            $scope.getStaffList();
                            vm.allSelected = false;
                        }
                        else {
                            dialog.notify('批量删除人员失败，可能是系统异常，请联系系统管理员！', 'error');
                        }
                    });
                }
            });
        }
        else {
            dialog.notify('您没有选择任何人员！', 'warn');
        }
    };

    $scope.restPwdClick = function (staff) {
        $scope.initStaff();
        for (var n in $scope.staff) {
            $scope.staff[n] = staff[n];
        }
        dialog.open({
            template: 'app/operationCenter/views/systemSetting/staffChangePwd.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            controller: 'staffChangePwdCtrl',
            preCloseCallback: function (data) {
                if (data == null)return;
                if (data) {
                    dialog.notify('密码修改成功！', 'success');
                }
                else {
                    dialog.notify('密码修改出错，可能是系统异常，请联系系统管理员！', 'error');
                }
            }
        });
    };

    $scope.queryClick = function () {
//    if ($scope.staffList.query.realname
//      || $scope.staffList.query.username
//      || $scope.staffList.query.phone) {
//      vm.getStaffList();
//    }
        $scope.getStaffList();
    };

    $scope.ResetQuery = function(){
        $scope.staffList.query.deptid = "";
        $scope.staffList.query.roleid = "";
        $scope.staffList.query.realname = "";
        $scope.staffList.query.phone = "";
        $scope.staffList.query.usertype = "0";
        $scope.staffList.query.username = "";
        $scope.staffList.currentPage = 1;
        $scope.getStaffList();
    };
}])/**
 * Ad-hoc $sce trusting to be used with ng-bind-html
 */
    .filter('trust', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });
