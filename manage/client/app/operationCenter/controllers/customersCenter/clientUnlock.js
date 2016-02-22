/**
 * Created by libinqi on 2015/6/17.
 */
'use strict';

var clientUnlockApp = angular.module('opCenterApp');
clientUnlockApp.controller('clientUnlockCtrl', ['$scope', 'dialog', 'customersCenterService', function ($scope, dialog, customersCenterService) {
    var vm = this;

    vm.enterpriseClientList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            usertype: '3',
            status: '1',
            enterprisename: ''
        },
        items: []
    };

    $scope.getEnterpriseClientList = function () {
        customersCenterService.getEnterpriseClientList(vm.enterpriseClientList.totalItems == 0 ? 1 : vm.enterpriseClientList.currentPage,
            vm.enterpriseClientList.itemsPerPage,
            vm.enterpriseClientList.query.usertype,
            vm.enterpriseClientList.query.status,
            vm.enterpriseClientList.query.enterprisename).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.enterpriseClientList.items = response.data.body.data;
                    if (vm.enterpriseClientList.items.length > 0) {
                        vm.enterpriseClientList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.enterpriseClientList.totalItems = 0;
                    }
                }
            });
    };
    $scope.getEnterpriseClientList();
    $scope.$watch('vm.enterpriseClientList.currentPage + vm.enterpriseClientList.itemsPerPage', $scope.getEnterpriseClientList);

    $scope.queryClick = function () {
        $scope.getEnterpriseClientList();
    };

    $scope.unlockClick = function (clientid) {
        $scope.clientId = clientid;
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/unlock.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getEnterpriseClientList();
                }
            }
        });
    };

    $scope.ResetQuery = function(){
        vm.enterpriseClientList.currentPage = 1;
        vm.enterpriseClientList.query.usertype = "3";
        vm.enterpriseClientList.query.status = "1";
        vm.enterpriseClientList.query.enterprisename = "";
        $scope.getEnterpriseClientList();
    }
}]);