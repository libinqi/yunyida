'use strict';

var app = angular.module('opCenterApp');
app.controller('addCustomerCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    vm.jsondata = {
        senterpriseid:user.permissions.parkid,   //源企业ID（必填）
        denterpriseid:"",   //目标企业ID（必填）
        ctype:"",           //客户类型（父字典编码是KHLX）
        remark:"",         //备注(验证信息)
        datasource:user.permissions.parkid
    };

    //新增OR修改
    vm.add = function(){
        if($scope.myForm.$valid){
            customersManageService.addApplication(vm.jsondata).then(function (response) {
                if(response.data.code == "200"){
                    $scope.closeThisDialog(1);
                }
                else{
                    $scope.closeThisDialog(2);
                }
            });
        }
        $scope.myForm.submitted = true;
    }

    //企业查询
    vm.getEnterpriseLicense = function(){
        customersManageService.getEnterpriseLicense($scope.eitem.enterpriseid).then(function (response) {
            if(response.data.code == "200"){
                vm.enterpriseLicense = response.data.body;
            }
        });
    }

    vm.cancel = function(){
        $scope.closeThisDialog(0);
    }

    if($scope.enterprisekind == "1"){
        vm.jsondata.ctype = "SJKH";
    }
    else if($scope.enterprisekind == "2"){
        vm.jsondata.ctype = "HZKH";
    }
    else if($scope.enterprisekind == "3") {
        vm.jsondata.ctype = "QYKH";
    }

    vm.jsondata.denterpriseid = $scope.eitem.enterpriseid;
    vm.getEnterpriseLicense();
}]);