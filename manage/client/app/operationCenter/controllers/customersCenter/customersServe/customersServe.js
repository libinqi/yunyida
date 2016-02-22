/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var customersServeApp = angular.module('opCenterApp');
customersServeApp.controller('customersServeCtrl', ['$scope', '$filter', 'dialog', 'customersCenterService', function ($scope, $filter, dialog, customersCenterService) {
    var vm = this;
    vm.customersServeList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            servicetype: '',
            priority: '',
            status: '',
            createdate: ''
        },
        items: []
    };

    $scope.getCustomersServeList = function () {
        if (vm.customersServeList.query.createdate) {
            vm.customersServeList.query.createdate = $filter('formatDate')(vm.customersServeList.query.createdate, 'YYYY-MM-DD');
        }

        customersCenterService.getCustomersServeList(vm.customersServeList.totalItems == 0 ? 1 : vm.customersServeList.currentPage,
            vm.customersServeList.itemsPerPage,
            vm.customersServeList.query.servicetype,
            vm.customersServeList.query.priority,
            vm.customersServeList.query.status,
            vm.customersServeList.query.createdate).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.customersServeList.items = response.data.body.data;
                    if (vm.customersServeList.items.length > 0) {
                        vm.customersServeList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.customersServeList.totalItems = 0;
                    }
                }
            });
    };

    $scope.getCustomersServeList();
    $scope.$watch('vm.customersServeList.currentPage + vm.customersServeList.itemsPerPage', $scope.getCustomersServeList);

    $scope.queryClick = function () {
        $scope.getCustomersServeList();
    };

    $scope.addHandleClick = function (customersServeId) {
        $scope.customersServeId = customersServeId || '';
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/customersServe/handle.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getCustomersServeList();
                }
            }
        });
    };
    $scope.addPilgrimageClick = function (customersServeId, status) {
        if (status != "YCL") {
            dialog.notify('服务单未处理，不能进行回访操作！', 'info');
            return;
        }
        $scope.customersServeId = customersServeId;
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/customersServe/pilgrimage.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getCustomersServeList();
                }
            }
        });
    };

    $scope.ResetQuery = function(){
        vm.customersServeList.currentPage = 1;
        vm.customersServeList.query.servicetype = "";
        vm.customersServeList.query.priority = "";
        vm.customersServeList.query.status = "";
        vm.customersServeList.query.createdate = "";
        $scope.getCustomersServeList();
    };

}]);