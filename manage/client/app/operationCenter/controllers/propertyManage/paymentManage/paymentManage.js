/**
 * Created by libinqi on 2015/6/7.
 */
'use strict';

var paymentManageApp = angular.module('opCenterApp');
paymentManageApp.controller('paymentManageCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
	var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems:0
    };

    vm.querydata = {
	    page: 1, 
	    rows: 10,
	    type:"1",
        // door:{doorno:""},
        customername:""
    };

    //门面租赁信息列表查询
    vm.getMRentList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        propertyService.getMRentList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.mRentList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.querylist = function(){
        $scope.paginationConf.currentPage = 1;
        vm.getMRentList();
    }

    vm.payMentClick = function (payment) {
        $scope.payment = payment;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/paymentManage/payment.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMRentList();
                     dialog.notify('付款成功！', 'success');
                }
            }
        });
    };

    vm.stausToCN = function(staus){
        if(staus == '0'){
            return "未付款";
        }
        else{
            return "已付款";
        }
    }

    //初始化查询
    // vm.getfeescalelist();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getMRentList);
}]);