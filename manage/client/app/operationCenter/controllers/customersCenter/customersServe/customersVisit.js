/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var customersVisitApp = angular.module('opCenterApp');
customersVisitApp.controller('customersVisitCtrl', ['$scope', '$filter', 'dialog', 'customersCenterService', function ($scope, $filter, dialog, customersCenterService) {
    var vm = this;

    vm.customersVisit = {
        serverid: $scope.customersServeId,
        visittime: '',   //回访时间
//        satisfaction: '', // 满意度
        visitmethod: '',   //回访方式
        visitor: '',//回访人
        evaluatetype: '',   //服务评价
        description: '',//回访说明
        status: 'YWC' //处理状态
    };

    $scope.saveCustomersVisit = function () {
        vm.customersVisit.visittime = $filter('formatDate')(vm.customersVisit.visittime, 'YYYY-MM-DD');

        customersCenterService.addCustomersVisit(vm.customersVisit).then(function (response) {
            if (response.data && response.data.code == "200") {
                dialog.notify('保存回访成功！', 'success');
                $scope.customersVisitForm.submitted = true;
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