/**
 * Created by libinqi on 2015/6/7.
 */
'use strict';

var ticketManageApp = angular.module('opCenterApp');
ticketManageApp.controller('ticketManageCtrl', ['$scope', '$http', 'dialog', 'customersCenterService', function ($scope, $http, dialog, customersCenterService) {
    var vm = this;

    vm.ticketList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            tel: '',
            vehicle_number: ''
        },
        items: []
    };

    $scope.getTicketList = function () {
        customersCenterService.getTicketList(vm.ticketList.totalItems == 0 ? 1 : vm.ticketList.currentPage,
            vm.ticketList.itemsPerPage,
            vm.ticketList.query.tel,
            vm.ticketList.query.vehicle_number).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.ticketList.items = response.data.body.data;
                    if (vm.ticketList.items.length > 0) {
                        vm.ticketList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.ticketList.totalItems = 0;
                    }
                }
            });
    };
    $scope.getTicketList();
    $scope.$watch('vm.ticketList.currentPage + vm.ticketList.itemsPerPage', $scope.getTicketList);

    $scope.queryClick = function () {
        $scope.getTicketList();
    };

    $scope.addTicketClick = function () {
        $scope.ticketModalTitle = '新增月票';
        $scope.ticketId = '';
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/ticketEntry.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getTicketList();
                }
            }
        });
    };
    $scope.viewTicketClick = function (ticketid) {
        $scope.ticketModalTitle = '查看月票详情';
        $scope.ticketId = ticketid;
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/ticketEntry.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    };
    $scope.ResetQuery = function(){
        vm.ticketList.currentPage = 1;
        vm.ticketList.query.tel = "";
        vm.ticketList.query.vehicle_number = "";
        $scope.getTicketList();
    }
}]);