'use strict';

var messageApp = angular.module('opCenterApp');
messageApp.controller('platformMessageEditCtrl', ['$scope', '$filter', 'dialog', '$sails', function ($scope, $filter, dialog, $sails) {
    var vm = this;
    vm.message = {
        messageType: '系统消息',  //消息类别('通知消息', '系统消息')
        userType: '货主',   //发送对象
        content: '',   //消息内容
        validate: ''//有效期
    };

    //消息发布
    $scope.sendMessage = function () {
        if(vm.message.validate)
        {
            vm.message.validate= $filter('formatDate')(vm.message.validate,'YYYY-MM-DD');
        }
        $sails.post("/message/send", vm.message)
            .success(function (data, status, headers, jwr) {
                dialog.notify('发送消息成功！', 'success');
                $scope.messageForm.submitted = true;
                $scope.closeThisDialog(true);
            })
            .error(function (data, status, headers, jwr) {
                dialog.notify('发送消息失败！', 'error');
                $scope.closeThisDialog(false);
            });
    };

    //取消
    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };
}]);