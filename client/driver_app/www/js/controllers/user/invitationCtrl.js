'use strict';

angular.module('starter.controllers').controller('InvitationCtrl', function ($scope, $state, $http, $timeout, $ionicPopover, $ionicLoading, $cordovaClipboard, $ionicHistory) {
  $scope.invData = {
    url: 'http://www.yunyida56.com/'
  };

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };

  $scope.copyUrl = function() {
    $cordovaClipboard.copy($scope.invData.url)
      .then(function() {
        alert('成功复制到剪贴板');
      }, function() {
        alert('复制失败');
      });
  };

  $scope.webChatFriend = function() {
    Wechat.isInstalled(function(installed) {
      if (!installed) {
        alert("手机尚未安装微信应用");
      }
    });
    Wechat.share({
      message: {
        title: '用这个APP可以实现快速发货，快速找到运力资源，你也试试吧~',
        description: '云驿达货主版',
        thumb: "www/img/icon.png",
        media: {
          type: Wechat.Type.LINK,
          webpageUrl: $scope.invData.url
        }
      },
      scene: Wechat.Scene.TIMELINE // share to Timeline
    }, function() {
      alert("分享成功");
    }, function(reason) {
      if (reason == 'ERR_USER_CANCEL') {
        return;
      }
      alert("分享失败: " + reason);
    });
  };

  $scope.webChat = function() {
    Wechat.isInstalled(function(installed) {
      if (!installed) {
        alert("手机尚未安装微信应用");
      }
    });
    Wechat.share({
      message: {
        title: '用这个APP可以实现快速发货，快速找到运力资源，你也试试吧~',
        description: '云驿达货主版',
        thumb: "www/img/icon.png",
        media: {
          type: Wechat.Type.LINK,
          webpageUrl: $scope.invData.url
        }
      },
      scene: Wechat.Scene.SESSION // share to Timeline
    }, function() {
      alert("分享成功");
    }, function(reason) {
      if (reason == 'ERR_USER_CANCEL') {
        return;
      }
      alert("分享失败: " + reason);
    });
  };

});
