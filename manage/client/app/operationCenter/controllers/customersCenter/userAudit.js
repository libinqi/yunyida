/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var userAuditApp = angular.module('opCenterApp');
userAuditApp.controller('userAuditCtrl', ['$scope', 'dialog', 'customersCenterService', function ($scope, dialog, customersCenterService) {
    var vm = this;
    
    vm.userAuditList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            usertype: '',
            status: '0',
            enterprisename: ''
        },
        items: []
    };

    $scope.getUserAuditList = function () {
        customersCenterService.getAuditUserList(vm.userAuditList.totalItems == 0 ? 1 : vm.userAuditList.currentPage,
            vm.userAuditList.itemsPerPage,
            vm.userAuditList.query.usertype,
            vm.userAuditList.query.status,
            vm.userAuditList.query.enterprisename).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.userAuditList.items = response.data.body.data;
                    if (vm.userAuditList.items.length > 0) {
                        vm.userAuditList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.userAuditList.totalItems = 0;
                    }
                }
            });
    };
    $scope.getUserAuditList();
    $scope.$watch('vm.userAuditList.currentPage + vm.userAuditList.itemsPerPage', $scope.getUserAuditList);

    $scope.queryClick = function () {
        $scope.getUserAuditList();
    };

    $scope.auditClick = function (enterpriseid) {
        $scope.enterpriseId = enterpriseid;
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/userAudit.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getUserAuditList();
                }
            }
        });
    };

    $scope.ResetQuery = function(){
        vm.userAuditList.currentPage = 1;
        vm.userAuditList.query.usertype = '';
        vm.userAuditList.query.status = '0';
        vm.userAuditList.query.enterprisename = '';
        $scope.getUserAuditList();
    }
}]);