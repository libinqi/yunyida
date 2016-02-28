'use strict';

var messageApp = angular.module('opCenterApp');
messageApp.controller('platformMessageListCtrl', ['$scope', '$filter', 'dialog', '$sails', function ($scope, $filter, dialog, $sails) {
    var vm = this;

    //消息查询参数
    vm.messageList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            messageType: '',
            userType: '',
            content: ''
        },
        items: []
    };

    //查询消息列表
    $scope.getMessageList = function () {
        if (vm.messageList.currentPage) {
            vm.messageList.query.page = vm.messageList.currentPage;
        }

        $sails.get("/message/list", vm.messageList.query)
            .success(function (data, status, headers, jwr) {
                vm.messageList.items = data.body;
                if (vm.messageList.items.length > 0) {
                    vm.messageList.totalItems = data.count;
                }
                else {
                    vm.messageList.totalItems = 0;
                }
            })
            .error(function (data, status, headers, jwr) {
            });
    };

    //查询按钮点击
    $scope.queryClick = function () {
        $scope.getMessageList();
    };

    //添加新的消息
    $scope.messageAddClick = function () {
        $scope.messageId = "";
        $scope.viewMId = "";
        $scope.messageModalTitle = '发送消息';
        dialog.open({
            template: 'app/operationCenter/views/clientCenter/platformMessage/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data) {
                    $scope.getMessageList();
                }
            }
        });
    };

    //删除消息
    $scope.deleteMessage = function (itemId) {
        dialog.confirmDialog('您确定要删吗？').then(function (data) {
            if (data) {
                $sails.delete("/message/" + itemId)
                    .success(function (data, status, headers, jwr) {
                        dialog.notify('删除成功！', 'success');
                        $scope.getMessageList();
                    })
                    .error(function (data, status, headers, jwr) {
                        dialog.notify("删除失败，请稍后再试！", 'error');
                    });
            }
        });
    };

    //重置查询
    $scope.ResetQuery = function () {
        vm.messageList.currentPage = 1;
        vm.messageList.query.messageType = "";
        vm.messageList.query.userType = "";
        vm.messageList.query.content = "";
        $scope.getMessageList();
    }

    //取消
    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };

    //默认查询接收的消息
    $scope.$watch('vm.messageList.currentPage + vm.messageList.itemsPerPage', $scope.getMessageList);
}]);