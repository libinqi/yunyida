'use strict';

angular.module('starter.controllers').controller('ChangePWDCtrl', function($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $state, Userinfo, loginService) {
  $scope.userData = {
    phone: '', //手机
    securitycode: '', //验证码
    password: '', //密码
    repassword: '', //重复密码
    userid: '', //用户Id
    validCodeId: ''
  };

  if (Userinfo.data) {
    $scope.userData = Userinfo.data;
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

  $scope.stepNext = function() {
    var reg = /^1\d{10}$/;
    if (!$scope.userData.phone) {
      $scope.showMsg('手机号码不能为空');
      return false;
    } else if (!reg.test($scope.userData.phone)) {
      $scope.showMsg('手机号格式错误');
      return false;
    } else {
      $http.get(ApiUrl + '/ws/system/sysUser/getUserByName/' + $scope.userData.phone)
        .success(function(data) {
          if (data.code !== '200') {
            $scope.showMsg('手机号码不存在，请重新输入...');
          } else {
            $http.get(ApiUrl + '/ws/system/sysLogin/sendCaptchaCode/' + $scope.userData.phone)
              .success(function(data) {
                if (!data.body) {
                  $scope.showMsg('发送验证码失败，请稍后再试...');
                } else {
                  $scope.userData.validCodeId = data.body.sessionid;
            $scope.userData.userid = data.body.userid;
            Userinfo.save($scope.userData);
            $state.go('backstep.step2');
              }
            });

          }
        });
    }
  }

  $scope.stepOK = function() {
    if (!$scope.userData.securitycode) {
      $scope.showMsg('验证码不能为空');
      return false;
    }
    $http.get(ApiUrl + '/ws/system/sysLogin/checkCaptchaCode', {
        params: {
          sessionid: $scope.userData.validCodeId,
          verifycode: $scope.userData.securitycode,
          phone: $scope.userData.phone
        }
      })
      .success(function(data) {
        if (data.code !== '200') {
          $scope.showMsg('验证码不正确，请重新输入...');
        } else {
          $state.go('backstep.step3');
      }
    });
  }

  $scope.stepLast = function() {
    if (!$scope.userData.password) {
      $scope.showMsg('密码不能为空');
      return false;
    }
    if (!$scope.userData.repassword) {
      $scope.showMsg('确认密码不能为空');
      return false;
    }
    if ($scope.userData.password !== $scope.userData.repassword) {
      $scope.showMsg('密码和确认密码不一致');
      return false;
    }
    $http.post(ApiUrl + '/ws/system/sysUser/resetPwd', {
        userid: $scope.userData.userid,
        newpassword: $scope.userData.password
      })
      .success(function(data) {
        if (data.code !== '200') {
          $scope.showMsg(data.msg);
        } else {
          for (var p in Userinfo.data) {
            Userinfo.remove(p);
          }
          $state.go('start');
        }
      }).error(function(data, status, headers, config) {
          $scope.showMsg('请求失败,网络不给力！');
      });
  }

});
