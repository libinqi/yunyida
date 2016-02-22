'use strict';

var app = angular.module('opCenterApp');
app.controller('chooseCustomerTypeCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;
    vm.jsondata = {
        dctype:$scope.ctype,
        applicationid:$scope.appid,   //申请ID（必填）
        status:"1"          //状态(0:初始,1:通过,2:拒绝)
    }
    //同意
    vm.auditApplication = function(){
        
        customersManageService.auditApplication(vm.jsondata).then(function (response) {
            if(response.data.code == "200"){
                // $scope.closeThisDialog(1);
                // dialog.notify('已拒绝！', 'success');
                $scope.closeThisDialog(1);
            }
            else{
                // $scope.closeThisDialog(2);
                // dialog.notify('拒绝失败！', 'error');
                $scope.closeThisDialog(2);
            }
        });
    }
}]);