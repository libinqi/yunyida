'use strict';

var app = angular.module('opCenterApp');
app.controller('addDriverCustomerCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    vm.jsondata = {

    }

    vm.queryCarTypeList = {
        page: 1, 
        rows: 10
    }

    //查询车辆类型
    vm.getCarTypeList = function(){
        customersManageService.getCarTypeList(vm.queryCarTypeList).then(function (response) {
            if(response.data.code == "200"){
                vm.cartypeList = data.body.data;
            }
        });
    }

    //新增OR修改
    vm.add = function(){
        if($scope.myForm.$valid){
            customersManageService.addDriverInfo(vm.jsondata).then(function (response) {
                if(response.data.code == "200"){
                    $scope.closeThisDialog(response.data);
                }
            });
        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    //添加空白行
    vm.addVehicleList = function(){
        var vehicle = { 
            vehiclelength:"",
            vehicletonnage:""
        };
        vm.jsondata.vehicleList.push(vehicle);
    }

    vm.getCarTypeList();
}]);