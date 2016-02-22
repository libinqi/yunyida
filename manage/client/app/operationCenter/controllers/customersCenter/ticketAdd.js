/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var ticketApp = angular.module('opCenterApp');
ticketApp.controller('ticketAddCtrl', ['$scope', '$filter', 'dialog', 'customersCenterService', function ($scope, $filter, dialog, customersCenterService) {
    var vm = this;
    vm.ticket = {
        name: '', //姓名
        tel: '',//手机号码
        vehicle_number: '',//车辆牌照
        applystarttime: '',//申请月票开始日期
        applyendtime: '',//申请月票结束日期
        remark: '', //备注
        monthamt: '',//收费金额
        paytype: ''//收费方式
    };
    vm.years = [];
    vm.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    for (var i = 0; i < 10; i++) {
        vm.years.push((year + i).toString());
    }

    if ($scope.ticketId) {
        customersCenterService.getTicket($scope.ticketId).then(function (response) {
            if (response.data && response.data.code == "200") {
                vm.ticket = response.data.body;
                vm.applystartyear = vm.ticket.applystarttime.split('-')[0];
                vm.applystartmonth = vm.ticket.applystarttime.split('-')[1];
                vm.applyendyear = vm.ticket.applyendtime.split('-')[0];
                vm.applyendmonth = vm.ticket.applyendtime.split('-')[1];
            }
        });
    }
    else {
        vm.applystartyear = year + '';//申请月票开始年份（输入用）
        vm.applystartmonth = vm.months[month];//申请月票开始月份（输入用）
        vm.applyendyear = year + '';//申请月票结束年份（输入用）
        vm.applyendmonth = vm.months[vm.months.indexOf(vm.months[month]) + 1];//申请月票结束月份（输入用）
    }

    $scope.saveTicket = function () {
        vm.ticket.applystarttime = vm.applystartyear + '-' + vm.applystartmonth;
        vm.ticket.applyendtime = vm.applyendyear + '-' + vm.applyendmonth;
        customersCenterService.saveOrUpdateTicket(vm.ticket).then(function (response) {
            if (response.data && response.data.code == "200") {
                dialog.notify('新增月票成功！', 'success');
                $scope.ticketForm.submitted = true;
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