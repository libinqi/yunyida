'use strict';

var viewDriverApp = angular.module('opCenterApp');
viewDriverApp.controller('driverManageCtrl', ['$scope', '$http', 'ngDialog', function ($scope, $http, ngDialog) {
    $scope.viewEnterpriseClick = function () {
        ngDialog.open({
            template: 'app/operationCenter/views/customersManage/viewEnterprise.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    },
    $scope.viewShipperClick = function () {
        ngDialog.open({
            template: 'app/operationCenter/views/customersManage/viewShipper.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    },
    $scope.viewDriverClick = function () {
        ngDialog.open({
            template: 'app/operationCenter/views/customersManage/viewDriver.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    };
}]);