'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditParkListCtrl', ['$scope', '$http', 'dialog', 'infoAuditService', function ($scope, $http, dialog, infoAuditService) {
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
        parkname:"",
        contactname:"",
        phone:""
    };

    //企业查询
    vm.getParkList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        infoAuditService.getParkList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.parkList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.query = function(){
        if($scope.paginationConf.currentPage!=1){
            $scope.paginationConf.currentPage = 1;
        }
        else{
            vm.getParkList();
        }
    }

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
            template: 'app/operationCenter/views/infoAudit/park/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null){
                    if(data.code == "200"){
                        vm.getParkList();
                        dialog.notify('添加成功', 'success');
                    }
                    else {
                        dialog.notify(data.msg, 'error');
                    }
                }
            }
        });
    }

    //查看企业明细
    vm.viewParkClick = function (pid) {
        $scope.pid = pid;
        $scope.isView = true;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/park/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    }

    //编辑企业信息
    vm.editParkClick = function (pid) {
        $scope.pid = pid;
        $scope.isView = false;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/park/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null){
                    if(data.code=="200"){
                        vm.getParkList();
                        dialog.notify('编辑成功！', 'success');
                    }
                    else{
                        dialog.notify(data.msg, 'error');
                    }
                }
            }
        });
    }

    vm.item_ids = [];
    vm.allSelected = false;
    vm.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach(vm.parkList, function (item, key) {
                if (vm.item_ids.indexOf(item.parkid) == -1) {
                    vm.item_ids.push(item.parkid);
                    vm.parkList[key].selected = true;
                }
            });
        }
        else {
            angular.forEach(vm.parkList, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.parkid), 1);
                vm.parkList[key].selected = false;
            });
        }
    };

    vm.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.parkid);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.parkid), 1);
        }
        if (vm.item_ids.length == vm.parkList.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != vm.parkList.length) {
            vm.allSelected = false;
        }
    };

    vm.deleteParkClick = function (itemId) {
        dialog.confirmDialog('您确定要删吗？').then(function (data) {
            if (data) {
                infoAuditService.deletePark(itemId,user.datasource).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('删除成功！', 'success');
                        vm.getParkList();
                    }
                    else {
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    vm.batchDeleteParkClick = function () {
        if (vm.item_ids.length > 0) {
            dialog.confirmDialog('您确定要批量删除选择的企业吗？').then(function (data) {
                if (data) {
                    infoAuditService.deletePark(vm.item_ids.splice(','),user.datasource).then(function (response) {
                        if (response.data && response.data.code == "200") {
                            dialog.notify('批量删除企业成功！', 'success');
                            vm.getParkList();
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
            dialog.notify('您没有选择任何企业！', 'warn');
        }
    };

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getParkList);
}]);