'use strict';

var app = angular.module('opCenterApp');
app.controller('auditLeaveAppCtrl', ['$scope', '$http', 'dialog', 'auditManageService', function ($scope, $http, dialog, auditManageService) {

    var vm = this;

    vm.jsondata = {

    }

    //请假明细查询
    vm.getLeaveAppInfo = function(){
        auditManageService.getLeaveAppInfo($scope.leaveappid).then(function (response) {
            if(response.data.code == "200"){
                vm.jsondata = response.data.body;
            }
        });
    }

    //审核
    vm.auditLeaveApp = function(){
        vm.jsondata.updator = user.userid;
        auditManageService.auditLeaveApp(vm.jsondata).then(function (response) {
            if(response.data.code == "200"){
                $scope.closeThisDialog(response.data);
            }
        });
    }

    //更新
    vm.update = function(){
        if($scope.myForm.$valid){
            if($scope.viewState == "3"){
                //审核
                vm.auditLeaveApp();
            }
        }
        $scope.myForm.submitted = true;
    }

    //取消
    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.pass = function(){
        //状态
        vm.jsondata.status = "1";
    }

    vm.rejected = function(){
        //状态
        vm.jsondata.status = "2";
    }

    if($scope.leaveappid != ""){
        vm.getLeaveAppInfo();
    }

}]);