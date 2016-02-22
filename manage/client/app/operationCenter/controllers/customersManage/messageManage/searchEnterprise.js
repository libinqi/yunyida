'use strict';

var app = angular.module('opCenterApp');
app.controller('searchEnterpriseCtrl', ['$scope', '$http', 'dialog', 'customersManageService', function ($scope, $http, dialog, customersManageService) {
    var vm = this;

    vm.querydata = {
        enterpriseInfo:"",
        enterprisekind:""
    };

    vm.msg = "";

    //企业查询
    vm.queryEnterpriseInfo = function(){
        customersManageService.queryEnterpriseInfo(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.enterpriseList = response.data.body;
                vm.msg = "本次查找到" + vm.enterpriseList.length + "个企业";
            }
        });
    }



    //添加企业信息
    vm.addEnterpriseClick = function (item) {
        if(item.enterpriseid == user.datasource){
            vm.msg = "不添加自己作为联系人";
            return;
        }
        $scope.eitem = item;
        var checkEnterprise = {
            enterpriseid : item.enterpriseid,
            datasource : user.datasource
        }
        customersManageService.getLmpEnterpriseList(checkEnterprise).then(function (response) {
            if(response.data.code == "200"){
                if(response.data.body.totalRecords > 0){
                    vm.msg = item.enterprisename + "已已经是你的联系人";
                }
                else{
                    dialog.open({
                        template: 'app/operationCenter/views/customersManage/messageManage/addCustomer.html',
                        className: 'ngdialog-theme-default custom-box',
                        scope: $scope,
                        preCloseCallback: function (data) {
                            $scope.closeThisDialog(data);
                        }
                    });
                }
            }
        });
    }

    vm.querydata.enterprisekind = $scope.enterprisekind;
}]);