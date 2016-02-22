'use strict';

var meterReadingApp = angular.module('opCenterApp');
meterReadingApp.controller('payMentCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
	var vm = this;

    vm.jsondata = { 
        id:"",
        realpay:0,
        overdue:0,
        paytype:{dictid:""},
        remark:""
    }

    //门面租赁信息列表查询
    vm.getPayRent = function(){
        propertyService.getPayRent($scope.payment.id).then(function (response) {
            if(response.data.code == "200"){
                vm.mrent = response.data.body;
            }
        });
    }

    //新增OR修改
    vm.payMent = function(){
        vm.jsondata.id = $scope.payment.id;
        if($scope.myForm.$valid){
          propertyService.meterEdit(vm.jsondata).then(function (response) {
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

    vm.sffs = $scope.dictList["SFFS"];
    vm.getPayRent();
}]);