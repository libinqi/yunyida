/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var staffApp = angular.module('opCenterApp');
staffApp.controller('staffChangePwdCtrl', ['$scope', 'dialog', 'systemSettingService', function ($scope, dialog, systemSettingService) {
    var vm = this;
    vm.password = '';

    $scope.changePwd = function () {
        if (!vm.password || vm.password == '') {
            vm.password = '123456';
        }
        systemSettingService.changeStaffPwd($scope.staff.userid, vm.password).then(function (response) {
            if (response.data && response.data.code == "200") {
                $scope.closeThisDialog(true);
            }
            else{
                $scope.closeThisDialog(false);
            }
        });
    };

    $scope.changePwdCancel = function () {
        $scope.closeThisDialog(null);
    };

}]);
