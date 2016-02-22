/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var customersServeApp = angular.module('opCenterApp');
customersServeApp.controller('customersServeAddCtrl', ['$scope', '$filter', 'dialog', 'systemSettingService', 'customersCenterService', function ($scope, $filter, dialog, systemSettingService, customersCenterService) {
    var vm = this;
    vm.staffList = [];

    vm.customersServe = {
        serverid: '',
        servercode: '',   //服务编码
        userid: '',		// 客户编码
        customername: '',   //客户名称
        customertel: '',   //客户电话
        servicetype: '', //服务类别
        servicemethod: '',  //服务方式
        assignee: '',  //受理人
        priority: '', //优先级别
//        createtime: $filter('formatDate')(new Date(), 'YYYY-MM-DD'),  //创建时间
        dealtime: '',  //处理时间
        cause: '', //要求处理事项
        result: '',  //处理结果
        status: '',  //处理状态
        remark: '' //备注
    };

    $scope.getStaffList = function () {
        systemSettingService.getStaffList(1, 1000, '', '', '0', '', '', '').then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.staffList = response.data.body.data;
            }
        });
    };

    $scope.getStaffList();

    if ($scope.customersServeId) {
        customersCenterService.getCustomersServe($scope.customersServeId).then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.customersServe = response.data.body;
            }
        });
    }

    $scope.saveCustomersServe = function () {
        if ($scope.customersServeId) {
            vm.customersServe.status = 'YCL';
            vm.customersServe.dealtime = $filter('formatDate')(new Date(), 'YYYY-MM-DD');
        }
        else {
            vm.customersServe.dealtime = null;
            vm.customersServe.status = 'WCL';
        }
        customersCenterService.saveOrUpdateCustomersServe(vm.customersServe).then(function (response) {
            if (response.data && response.data.code == "200") {
                dialog.notify('新增服务单成功！', 'success');
                $scope.customersServeForm.submitted = true;
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