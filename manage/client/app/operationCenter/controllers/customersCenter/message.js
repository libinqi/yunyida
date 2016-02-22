/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var messageApp = angular.module('opCenterApp');
messageApp.controller('messageCtrl', ['$scope', '$filter', 'dialog', 'customersCenterService', function ($scope, $filter, dialog, customersCenterService) {
    var vm = this;

    vm.messageList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            msgtype: '',
            content: ''
        },
        items: []
    };

    $scope.getMessageList = function () {
        customersCenterService.getMessageList(vm.messageList.totalItems == 0 ? 1 : vm.messageList.currentPage,
            vm.messageList.itemsPerPage,
            vm.messageList.query.msgtype,
            vm.messageList.query.content).then(function (response) {
                if (response.data && response.data.code == "200") {
                    vm.messageList.items = response.data.body.data;
                    if (vm.messageList.items.length > 0) {
                        vm.messageList.totalItems = response.data.body.totalRecords;
                    }
                    else {
                        vm.messageList.totalItems = 0;
                    }
                }
            });
    };
    $scope.getMessageList();
    $scope.$watch('vm.messageList.currentPage + vm.messageList.itemsPerPage', $scope.getMessageList);

    $scope.queryClick = function () {
        $scope.getMessageList();
    };

    $scope.messageAddClick = function () {
        $scope.messageId = "";
        $scope.viewMId = "";
        $scope.messageModalTitle = '发送消息';
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/messageEdit.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getMessageList();
                }
            }
        });
    };

    $scope.messageEditClick = function (messageid) {
        $scope.messageId = messageid;
        $scope.viewMId = "";
        $scope.messageModalTitle = '编辑消息';
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/messageEdit.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getMessageList();
                }
            }
        });
    };

    $scope.sendMessageClick = function (messageid) {
        customersCenterService.getMessage(messageid).then(function (response) {
            if (response.data && response.data.code == "200") {
                var message = response.data.body.message;
                message.status = 'YFS';
                message.updator = user.userid;
                message.updatetime = $filter('formatDate')(new Date());

                customersCenterService.saveOrUpdateMessage(message).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('消息发送成功！', 'success');
                        $scope.getMessageList();
                    }
                    else {
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            } else {
                dialog.notify(response.data.msg, 'error');
            }
        });
    };

    $scope.messageViewClick = function (messageid) {
        // customersCenterService.getMessage(messageid).then(function (response) {
        //     if (response.data && response.data.code == "200") {
        //         $scope.replys = response.data.body.reply;

        //         dialog.open({
        //             template: 'app/operationCenter/views/customersCenter/messageView.html',
        //             className: 'ngdialog-theme-default custom-box',
        //             scope: $scope,
        //             preCloseCallback: function (data) {
        //             }
        //         });
        //     } else {
        //         dialog.notify(response.data.msg, 'error');
        //     }
        // });
        $scope.messageId = "";
        $scope.viewMId = messageid;
        dialog.open({
            template: 'app/operationCenter/views/customersCenter/messageView.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {

            }
        });
    };

    $scope.ResetQuery = function(){
        vm.messageList.currentPage = 1;
        vm.messageList.query.msgtype = "";
        vm.messageList.query.content = "";
        $scope.getMessageList();
    }

    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };
}]);