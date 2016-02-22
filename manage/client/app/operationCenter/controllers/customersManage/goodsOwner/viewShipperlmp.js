'use strict';

var app = angular.module('opCenterApp');
app.controller('viewShipperlmpCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    vm.querydata = {
        enterpriseid:$scope.eid
    }
    //企业查询
    vm.getEnterpriseInfo = function(){
        customersManageService.getEnterpriseInfolmp(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.jsondata = response.data.body;
            }
        });
    }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.getEnterpriseInfo();

}]);