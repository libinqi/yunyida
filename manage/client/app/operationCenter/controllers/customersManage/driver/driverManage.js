'use strict';

var app = angular.module('opCenterApp');
app.controller('driverCustomerCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
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

    //添加企业信息
    vm.addDriverClick = function () {
        dialog.open({
            template: 'app/operationCenter/views/customersManage/driver/addDriver.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                  vm.getshipperiseList();
                  dialog.notify('添加成功！', 'success');
                }
            }
        });
    }

    vm.ResetQuery = function(){
        vm.querydata.realname = "";
        vm.querydata.phone = "";
        $scope.paginationConf.currentPage = 1;
        vm.getDriverList();
    }

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getDriverList);

}]);