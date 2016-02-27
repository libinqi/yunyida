'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditDriverListCtrl', ['$scope', '$http', 'dialog', 'infoAuditService', function ($scope, $http, dialog, infoAuditService) {
    var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems:0
    };

    //查询条件
    vm.querydata = {
        page: 1, 
        rows: 10,
        parkname:"",
        contactname:"",
        phone:""
    };

    //司机查询
    vm.getDriverList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        infoAuditService.getDriverList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.driverList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    //查询事件
    vm.query = function(){
        if($scope.paginationConf.currentPage!=1){
            $scope.paginationConf.currentPage = 1;
        }
        else{
            vm.getDriverList();
        }
    }

    //重置查询
    vm.ResetQuery = function(){
        vm.querydata.parkname = "";
        vm.querydata.contactname = "";
        vm.querydata.phone = "";
        $scope.paginationConf.currentPage = 1;
        vm.query();
    }

    //添加园区信息
    vm.addParkClick = function () {
        $scope.pid = "";
        $scope.isView = false;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/shipper/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null){
                    if(data.code == "200"){
                        vm.getDriverList();
                        dialog.notify('添加成功', 'success');
                    }
                    else {
                        dialog.notify(data.msg, 'error');
                    }
                }
            }
        });
    }

    //查看司机明细
    vm.viewDriverClick = function (pid) {
        $scope.pid = pid;
        $scope.isView = true;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/driver/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    }

    // //编辑企业信息
    // vm.editDriverClick = function (pid) {
    //     $scope.pid = pid;
    //     $scope.isView = false;
    //     dialog.open({
    //         template: 'app/operationCenter/views/infoAudit/driver/info.html',
    //         className: 'ngdialog-theme-default custom-box',
    //         scope: $scope,
    //         preCloseCallback: function (data) {
    //             if(data != null){
    //                 if(data.code=="200"){
    //                     vm.getDriverList();
    //                     dialog.notify('编辑成功！', 'success');
    //                 }
    //                 else{
    //                     dialog.notify('编辑失败！', 'error');
    //                 }
    //             }
    //         }
    //     });
    // }

    //删除功能
    vm.item_ids = [];
    vm.allSelected = false;
    vm.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach(vm.driverList, function (item, key) {
                if (vm.item_ids.indexOf(item.userid) == -1) {
                    vm.item_ids.push(item.userid);
                    vm.driverList[key].selected = true;
                }
            });
        }
        else {
            angular.forEach(vm.driverList, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.userid), 1);
                vm.driverList[key].selected = false;
            });
        }
    };

    vm.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.userid);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.userid), 1);
        }
        if (vm.item_ids.length == vm.driverList.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != vm.driverList.length) {
            vm.allSelected = false;
        }
    };

    //单个删除
    vm.deleteDriverClick = function (itemId) {
        dialog.confirmDialog('您确定要删吗？').then(function (data) {
            if (data) {
                infoAuditService.deleteDriver(itemId,user.datasource).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('删除成功！', 'success');
                        vm.getDriverList();
                    }
                    else {
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    //批量删除
    vm.batchDeleteDriverClick = function () {
        if (vm.item_ids.length > 0) {
            dialog.confirmDialog('您确定要批量删除选择的司机吗？').then(function (data) {
                if (data) {
                    infoAuditService.deleteDriver(vm.item_ids.splice(','),user.datasource).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('批量删除司机成功！', 'success');
                            vm.getDriverList();
                            vm.allSelected = false;
                        }
                        else {
                            dialog.notify(response.data.msg, 'error');
                        }
                    });
                }
            });
        }
        else {
            dialog.notify('您没有选择任何司机！', 'warn');
        }
    };

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getDriverList);
}]);