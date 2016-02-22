'use strict';

var app = angular.module('opCenterApp');
app.controller('viewEnterpriseCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    //企业查询
    vm.getEnterpriseInfo = function(){
        customersManageService.getEnterpriseInfo($scope.eid).then(function (response) {
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