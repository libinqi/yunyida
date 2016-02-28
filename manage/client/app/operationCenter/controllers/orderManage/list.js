'use strict';

var app = angular.module('opCenterApp');
app.controller('orderMangeListCtrl', ['$scope', '$http', '$filter', 'dialog', '$sails', function ($scope, $http, $filter, dialog, $sails) {
    var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems: 0
    };

    vm.queryData = {
        page: 1,
        rows: 10,
        shipper: "",
        carrier: "",
        startDate: "",
        endDate: "",
        status: ""
    };

    $scope.orderList = [];

    //企业查询
    $scope.getOrderList = function () {
        vm.queryData.page = $scope.paginationConf.currentPage;
        if (vm.queryData.page <= 0) {
            vm.queryData.page = 1;
        }

        if(vm.queryData.startDate)
        {
            vm.queryData.startDate= $filter('formatDate')(vm.queryData.startDate,'YYYY-MM-DD');
        }
        if(vm.queryData.endDate)
        {
            vm.queryData.endDate= $filter('formatDate')(vm.queryData.endDate,'YYYY-MM-DD');
        }

        $sails.get("/order/list", vm.queryData)
            .success(function (data, status, headers, jwr) {
                $scope.orderList = data.body;
                // 变更分页的总数
                $scope.paginationConf.totalItems = data.count;
            })
            .error(function (data, status, headers, jwr) {
            });
    }

    $scope.query = function () {
        if ($scope.paginationConf.currentPage != 1) {
            $scope.paginationConf.currentPage = 1;
        }
        else {
            $scope.getOrderList();
        }
    }

    $scope.resetQuery = function () {
        vm.queryData.shipper = "";
        vm.queryData.carrier = "";
        vm.queryData.startDate = "";
        vm.queryData.endDate = "";
        vm.queryData.status = "";
        $scope.paginationConf.currentPage = 1;
        $scope.query();
    }

    $scope.showOrderDetail = false;
    // 详情页面
    $scope.toggleOrderDetail = function(item) {
        if(item){
            $scope.goodsOrder = item;
        }
        $scope.showOrderDetail = !$scope.showOrderDetail;
    }

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', $scope.getOrderList);
}]);