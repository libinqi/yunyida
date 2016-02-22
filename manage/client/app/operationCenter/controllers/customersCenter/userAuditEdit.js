/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var userAuditApp = angular.module('opCenterApp');
userAuditApp.controller('userAuditEditCtrl', ['$scope', 'dialog', 'customersCenterService', function ($scope, dialog, customersCenterService) {
    var vm = this;
    vm.enterpriseInfo = {};
    $scope.getUserAudit = function () {
        customersCenterService.getAuditUser($scope.enterpriseId).then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.enterpriseInfo = response.data.body;
            }
        });
    };
    $scope.getUserAudit();

    $scope.pass = function (userid) {
        customersCenterService.auditUser(userid, '1',  user.userid, vm.enterpriseInfo.description).then(function (response) {
            if (response.data && response.data.code == "200") {
                dialog.notify('更新审核状态成功！', 'success');
                $scope.closeThisDialog(true);
            }
            else{
                dialog.notify(response.data.msg, 'error');
                $scope.closeThisDialog(false);
            }
        });
    };

    $scope.unPass = function (userid) {
        customersCenterService.auditUser(userid, '2', user.userid, vm.enterpriseInfo.description).then(function (response) {
            if (response.data && response.data.code == "200") {
                dialog.notify('更新审核状态成功！', 'success');
                $scope.closeThisDialog(true);
            }
            else{
                dialog.notify(response.data.msg, 'error');
                $scope.closeThisDialog(false);
            }
        });
    };

    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };
}]);