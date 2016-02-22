'use strict';

var app = angular.module('opCenterApp');
app.controller('driverListCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems:0
    };

    vm.querydata = {
        page: 1, 
        rows: 10,
        realname:"",
        phone:""
    };

    //企业查询
    vm.getDriverList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        customersManageService.getDriverList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.driverList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.query = function(){
        if($scope.paginationConf.currentPage != 1){
            $scope.paginationConf.currentPage = 1;
        }
        else{
            vm.getDriverList();
        }
    }

    //查看企业明细
    vm.viewDriverClick = function (driverid) {
        $scope.driverid = driverid;
        dialog.open({
            template: 'app/operationCenter/views/customersManage/driver/viewDriver.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    }

   //查找企业信息
    vm.selEnterpriseClick = function () {
        $scope.enterprisekind = "1";
        dialog.open({
            template: 'app/operationCenter/views/customersManage/messageManage/searchEnterprise.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data == 1){
                    vm.getEnterpriseList();
                    dialog.notify('等待对方验证！', 'success');
                }
                else if(data == 2){
                    dialog.notify('添加失败！', 'error');
                }
            }
        });
    }

    vm.item_ids = [];
    vm.allSelected = false;
    vm.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach(vm.enterpriseList, function (item, key) {
                if (vm.item_ids.indexOf(item.enterpriseid) == -1) {
                    vm.item_ids.push(item.enterpriseid);
                    vm.enterpriseList[key].selected = true;
                }
            });
        }
        else {
            angular.forEach(vm.enterpriseList, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.enterpriseid), 1);
                vm.enterpriseList[key].selected = false;
            });
        }
    };

    vm.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.enterpriseid);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.enterpriseid), 1);
        }
        if (vm.item_ids.length == vm.enterpriseList.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != vm.enterpriseList.length) {
            vm.allSelected = false;
        }
    };

    vm.deleteEnterpriseClick = function (itemId) {
        dialog.confirmDialog('您确定要删吗？').then(function (data) {
            if (data) {
                customersManageService.deleteEnterprise(itemId).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('删除成功！', 'success');
                        $scope.getEnterpriseList();
                    }
                    else {
//                        dialog.notify('菜单删除失败，可能是系统异常，请联系系统管理员！', 'error');
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    vm.batchDeleteEnterpriseClick = function () {
        if (vm.item_ids.length > 0) {
            dialog.confirmDialog('您确定要批量删除选择的司机吗？').then(function (data) {
                if (data) {
                    customersManageService.deleteEnterprise(vm.item_ids.splice(',')).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('批量删除司机成功！', 'success');
                            $scope.getEnterpriseList();
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