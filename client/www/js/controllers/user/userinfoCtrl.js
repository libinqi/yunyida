'use strict';

angular.module('starter.controllers').controller('UserInfoCtrl', function($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, Userinfo, loginService) {
  $scope.userData = {
    userid: '', //用户id
    phone: '', //手机
    realname: '', //姓名
    email: '' //电子邮箱
  };

  $scope.backGo = function() {
    $ionicHistory.goBack();
  };

  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  }

  $scope.getUserInfo = function() {
    $http.get(ApiUrl + '/ws/system/sysUser/queryById/' + Userinfo.data.userid)
      .success(function(data) {
        if (data.body) {
          $scope.userData.userid = data.body.userid;
          $scope.userData.phone = data.body.phone;
          $scope.userData.realname = data.body.realname;
          $scope.userData.email = data.body.email;
        }
      });
  }

  $scope.getUserInfo();

  $scope.saveUserInfo = function() {
    if (!$scope.userData.realname && !$scope.userData.email) {
      $scope.showMsg('请输入要更新的内容');
      return false;
    }
    $ionicLoading.show({
      template: "正在更新用户信息..."
    });
    $http.post(ApiUrl + '/ws/system/sysUser/saveOrUpdate', $scope.userData)
      .success(function(data) {
        $ionicLoading.hide();
        if (!data.body) {
          $scope.showMsg(data.msg);
        } else {
          $scope.showMsg('更新成功');
        }
      }).error(function(data, status, headers, config) {
          $scope.showMsg('请求失败,网络不给力！');
      });
  }

});
