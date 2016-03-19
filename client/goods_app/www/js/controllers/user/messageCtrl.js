'use strict';

angular.module('starter.controllers').controller('MessageCtrl', function ($scope, $state, $stateParams, $timeout, $http, $ionicPopover, UserInfo, $ionicHistory) {
  $scope.messageList = [];
  $scope.load_over = true;

  $scope.query = {
    page: 1,
    rows: 8,
    messageType: '',
    userId: UserInfo.data.userId
  };

  $scope.flag = {
    showDelete: false
  };

  $scope.isActive = $stateParams.data ? $stateParams.data : 'a';

  $scope.changeTab = function (evt) {
    var elem = evt.currentTarget;
    $scope.isActive = elem.getAttributeNode('data-active').value;
    $scope.items = [];
    $scope.query.page = 1;
    if ($scope.isActive == 'a') {
      $scope.query.messageType = '通知消息';
    }
    if ($scope.isActive == 'b') {
      $scope.query.messageType = '系统消息';
    }
    $scope.loadMore();
  };

  $scope.showMsg = function (txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function () {
      $scope.popover.hide();
    }, 1400);
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };
  // 通知消息
  $scope.deleteMessage = function (id) {
    io.socket.delete('/messageUser/' + id, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.loadMore();
      }
    });
  };

  $scope.loadMore = function () {
    //$scope.load_over = false;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/message/userMessage', $scope.query, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          if (body.length > 0) {
            $scope.messageList = $scope.messageList.concat(body);
            $scope.query.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = true;
          }
          else {
            $scope.messageList = $scope.messageList.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = false;
          }
        }
      });
    }, 200);
  };
});
