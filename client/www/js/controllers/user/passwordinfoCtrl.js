'use strict';

angular.module('starter.controllers').controller('PassWordInfoCtrl', function($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, $stateParams, Userinfo, loginService) {



  $scope.changePwdData = {
    userid: '', //用户id
    oldpassword: '', //老密码
    newpassword: '' //新密码
  }


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

  $scope.changePwd = function() {
    if (!$scope.changePwdData.oldpassword) {
      $scope.showMsg('原始密码不能为空');
      return false;
    }
    if (!$scope.changePwdData.newpassword) {
      $scope.showMsg('新密码不能为空');
      return false;
    }
    $scope.changePwdData.userid = Userinfo.data.userid;
    $ionicLoading.show({
      template: "正在修改密码..."
    });
    $http.post(ApiUrl + '/ws/system/sysUser/changePwd', $scope.changePwdData)
      .success(function(data) {
        $ionicLoading.hide();
        if (data.code != '200') {
          $scope.showMsg(data.msg);
        } else {
          $scope.showMsg('密码修改成功');
        }
      }).error(function(data, status, headers, config) {
          $scope.showMsg('请求失败,网络不给力！');
      });
  }

});
