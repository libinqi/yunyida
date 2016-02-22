'use strict';

var app = angular.module('opCenterApp');
app.controller('messageValidateCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    vm.querydata = {
        page:1,
    	rows:999,
        status:"0",
    	denterpriseid:user.permissions.parkid
    }

    //查看企业客户好友申请消息
    vm.queryApplicationList = function(){
        customersManageService.queryApplicationList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.applicationList = response.data.body.data;
            }
        });
    }

    vm.chooseCustomer = function(item){
        $scope.appid = item.applicationid;
        if(item.enterprisekind == "1"){
            $scope.ctype = "SJKH";
        }
        else if(item.enterprisekind == "2"){
            $scope.ctype = "HZKH";
        }
        else if(item.enterprisekind == "3") {
            $scope.ctype = "QYKH";
        }
        dialog.open({
            template: 'app/operationCenter/views/customersManage/messageManage/chooseCustomerType.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data == 1){
                    dialog.notify('添加成功！', 'success');
                    vm.queryApplicationList();
                }
                else if(data == 2){
                    dialog.notify('添加失败！', 'error');
                }
            }
        });
    }

    //拒绝
    vm.auditApplication = function(item){
        var jsondata = {
            dctype:item.ctype,
            applicationid:item.applicationid,   //申请ID（必填）
            status:"2"          //状态(0:初始,1:通过,2:拒绝)
        }
        customersManageService.auditApplication(jsondata).then(function (response) {
            if(response.data.code == "200"){
                // $scope.closeThisDialog(1);
                dialog.notify('已拒绝！', 'success');
                vm.queryApplicationList();
            }
            else{
                // $scope.closeThisDialog(2);
                dialog.notify('拒绝失败！', 'error');
                vm.queryApplicationList();
            }
        });
    }

    //清空消息申请列表
    vm.batchClearApplication = function(){
        var applicationids = "";
        for (var i = 0; i < vm.applicationList.length; i++) {
            if(applicationids == ""){
                applicationids += vm.applicationList[i].applicationid;
            }
            else{
                applicationids += "," + vm.applicationList[i].applicationid;
            }
        }
        customersManageService.batchClearApplication(applicationids).then(function (response) {
            if(response.data.code == "200"){
                vm.queryApplicationList();
            }
            else{
                vm.queryApplicationList();
            }
        });
    }

    vm.queryApplicationList();
}]);