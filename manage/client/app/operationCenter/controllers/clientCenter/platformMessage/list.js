'use strict';

var messageApp = angular.module('opCenterApp');
messageApp.controller('platformMessageListCtrl', ['$scope', '$filter', 'dialog', 'clientCenterService', function ($scope, $filter, dialog, clientCenterService) {
    var vm = this;

    //消息查询参数
    vm.messageList = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        query: {
            msgtype: '',
            content: '',
            order: 'createtime',
            sort: 'DESC'
        },
        items: []
    };

    //默认选中标签 1接收，2发送
    $scope.activeTab = 1;

    //查询消息列表
    $scope.getMessageList = function () {
        if(vm.messageList.currentPage){
            vm.messageList.query.page = vm.messageList.currentPage;
        }
        clientCenterService.getMessageList(vm.messageList.query).then(function (response) {
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

    //根据选中标签查询消息
    $scope.selectTab =  function(tag){
        $scope.activeTab = tag;
        if(tag == 1){
            vm.messageList.query.creator = "";
            vm.messageList.query.userids = "dict201506111328160001";
        }
        else if(tag == 2){
            vm.messageList.query.creator = user.userid;
            vm.messageList.query.userids = "";
        }
        vm.messageList.currentPage = 1;
        $scope.getMessageList();
    }

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

    //消息详情、编辑
    $scope.messageEditClick = function (messageid) {
        $scope.messageId = "";
        $scope.viewMId = messageid;
        $scope.messageModalTitle = '编辑消息';
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

    //再次发送消息
    $scope.sendMessageClick = function (messageid) {
        clientCenterService.getMessageInfo(messageid).then(function (response) {
            if (response.data && response.data.code == "200") {
                var message = response.data.body.message;
                message.status = 'YFS';
                message.updator = user.userid;
                message.updatetime = $filter('formatDate')(new Date());

                clientCenterService.saveOrUpdateMessage(message).then(function (response) {
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

    //消息回复
    $scope.messageReplyClick = function (messageid) {
        $scope.messageId = "";
        $scope.viewMId = messageid;
        dialog.open({
            template: 'app/operationCenter/views/clientCenter/platformMessage/reply.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {

            }
        });
    };

    //删除消息
    $scope.deleteMessage = function (itemId) {
        dialog.confirmDialog('您确定要删吗？').then(function (data) {
            if (data) {
                clientCenterService.deleteMessage(itemId).then(function (response) {
                    if (response.data && response.data.code == "200") {
                        dialog.notify('删除成功！', 'success');
                        $scope.getMessageList();
                    }
                    else {
                        dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    };

    //重置查询
    $scope.ResetQuery = function(){
        vm.messageList.currentPage = 1;
        vm.messageList.query.msgtype = "";
        vm.messageList.query.content = "";
        $scope.getMessageList();
    }

    //取消
    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    };

    //默认查询接收的消息
    $scope.selectTab(1);
    $scope.$watch('vm.messageList.currentPage + vm.messageList.itemsPerPage', $scope.getMessageList);
}]);