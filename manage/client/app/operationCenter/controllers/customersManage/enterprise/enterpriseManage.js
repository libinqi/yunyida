'use strict';

var app = angular.module('opCenterApp');
app.controller('enterpriseManageCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
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
        usertype:"3",
        enterprisename:"",
        contactname:"",
        telephonenumber:""
    };

    //企业查询
    vm.getEnterpriseList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        customersManageService.getEnterpriseList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.enterpriseList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.query = function(){
        $scope.paginationConf.currentPage = 1;
        vm.getEnterpriseList();
    }

    //查看企业明细
    vm.viewEnterpriseClick = function (eid) {
        $scope.eid = eid;
        dialog.open({
            template: 'app/operationCenter/views/customersManage/enterprise/viewEnterprise.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    }

    //添加企业信息
    vm.addEnterpriseClick = function () {
        dialog.open({
            template: 'app/operationCenter/views/customersManage/enterprise/addEnterprise.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                  vm.getEnterpriseList();
                  dialog.notify('添加成功！', 'success');
                }
            }
        });
    }

    //编辑企业信息
    vm.editEnterpriseClick = function (eid) {
        $scope.eid = eid;
        dialog.open({
            template: 'app/operationCenter/views/customersManage/enterprise/editEnterprise.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                  vm.getEnterpriseList();
                  dialog.notify('编辑成功！', 'success');
                }
            }
        });
    }

    vm.ResetQuery = function(){
        vm.querydata.usertype = "3";
        vm.querydata.enterprisename = "";
        vm.querydata.contactname = "";
        vm.querydata.telephonenumber = "";
        $scope.paginationConf.currentPage = 1;
        vm.getEnterpriseList();
    };

    //初始化查询
    // vm.getfeescalelist();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getEnterpriseList);
  
}]);