'use strict';

var app = angular.module('opCenterApp');
app.controller('viewDriverCustomerCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    //查询车辆类型
    vm.getDriverInfo = function(){
        customersManageService.getDriverInfo($scope.driverid).then(function (response) {
            if(response.data.code == "200"){
                vm.driverInfo = response.data.body;
            }
        });
    }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.getDriverInfo();
}]);