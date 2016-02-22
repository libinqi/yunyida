/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var clientUnlockApp = angular.module('opCenterApp');
clientUnlockApp.controller('clientUnlockEditCtrl', ['$scope', 'dialog', 'customersCenterService', function ($scope, dialog, customersCenterService) {
    var vm = this;
    vm.enterpriseClient = {};
    $scope.getEnterpriseClient = function () {
        customersCenterService.getEnterpriseClient($scope.clientId).then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.enterpriseClient = response.data.body;
            }
        });
    };
    $scope.getEnterpriseClient();

    $scope.unlock = function (clientid, status) {
        var text = '';
        if (status == '1') {
            status = '0';
            text = '锁定';
        }
        else {
            status = '1';
            text = '解锁';
        }
        customersCenterService.unlockClient(clientid, status, vm.enterpriseClient.remark).
            then(function (response) {
                if (response.data && response.data.code == "200") {
                    dialog.notify(text + '成功！', 'success');
                    $scope.closeThisDialog(true);
                }
                else {
                    dialog.notify(response.data.msg, 'error');
                    $scope.closeThisDialog(false);
                }
            });
    };

    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };
}]);