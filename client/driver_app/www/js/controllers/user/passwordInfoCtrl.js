'use strict';

angular.module('starter.controllers').controller('PassWordInfoCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, $stateParams, UserInfo, loginService) {
  $scope.changePwdData = {
    userId: UserInfo.data.userId,
    oldPassword: '', //原始密码
    newPassword: '', //新密码
    newPassword2: ''//确认新密码
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
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

  $scope.changePwd = function () {
    if (!$scope.changePwdData.oldPassword) {
      $scope.showMsg('原始密码不能为空');
      return false;
    }
    if (!$scope.changePwdData.newPassword) {
      $scope.showMsg('新密码不能为空');
      return false;
    }
    if (!$scope.changePwdData.newPassword2) {
      $scope.showMsg('确认新密码不能为空');
      return false;
    }
    if ($scope.changePwdData.newPassword !== $scope.changePwdData.newPassword2) {
      $scope.showMsg('新密码和确认密码输入不一致');
      return false;
    }
    if ($scope.changePwdData.oldPassword == $scope.changePwdData.newPassword) {
      $scope.showMsg('原始密码和新密码不能相同');
      return false;
    }

    $ionicLoading.show({
      template: "正在修改密码..."
    });

    io.socket.post('/user/changePwd', $scope.changePwdData, function serverResponded(body, JWR) {
      $ionicLoading.hide();
      if (JWR.statusCode !== 200) {
        if( typeof body === 'string')
        {
          $scope.showMsg(body);
        }
        else{
          $scope.showMsg('请求失败,网络不给力！');
        }
      }
      else {
        $scope.showMsg('密码修改成功');
        $scope.backGo();
      }
    });
  }

});
