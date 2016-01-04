'use strict';

angular.module('starter.controllers').controller('ChangePWDCtrl', function($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $state, Userinfo, loginService) {
  $scope.formData = {
    phoneNumber: '', //手机
    securityCode: '', //验证码
    validCode: '',
    repassword: '',//重复密码
    password: '', //密码
  };

  $scope.flag = 1;
  $scope.wait = 60;
  $scope.validBtnText = '获取验证码';

  $scope.backGo = function() {
    $state.go('start');
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

  $scope.timeOut = function () {
    if ($scope.wait == 0) {
      $scope.flag = 1;
      $scope.validBtnText = "获取验证码";
      $scope.wait = 60;
    } else {
      $scope.flag = 0;
      $scope.validBtnText = $scope.wait + "秒后重发";
      $scope.wait--;
      $timeout(function () {
        $scope.timeOut();
      }, 1000);
    }
  }

  $scope.getValidCode = function () {
    var reg = /^1\d{10}$/;
    if (!$scope.formData.phoneNumber) {
      $scope.showMsg('手机号码不能为空');
      return false;
    } else if (!reg.test($scope.formData.phoneNumber)) {
      $scope.showMsg('手机号格式错误');
      return false;
    }
    io.socket.get('/user/checkIsExist', {
      userName: $scope.formData.phoneNumber
    }, function serverResponded(body, JWR) {
      if (JWR.statusCode == 200) {
        $scope.showMsg('手机号码不存在，请重新输入...');
      } else {
        io.socket.get('/user/getValidCode', {
          phoneNumber: $scope.formData.phoneNumber
        }, function serverResponded(body, JWR) {
          if (JWR.statusCode == 200) {
            $scope.formData.validCode = body.validCode;
            console.log($scope.formData.validCode);
            $scope.timeOut();
          }
          else {
            $scope.showMsg('发送验证码失败，请重新获取...');
          }
        });
      }
    });
  }

  $scope.change = function() {
    var reg = /^1\d{10}$/;
    if (!$scope.formData.phoneNumber) {
      $scope.showMsg('手机号码不能为空');
      return false;
    } else if (!reg.test($scope.formData.phoneNumber)) {
      $scope.showMsg('手机号格式错误');
      return false;
    }
    if (!$scope.formData.securityCode) {
      $scope.showMsg('验证码不能为空');
      return false;
    }
    else{
      io.socket.get('/user/checkValidCode', {
        validCode: $scope.formData.securityCode,
        phoneNumber: $scope.formData.phoneNumber
      }, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('验证码不正确，请重新输入...');
        }else{
          if (!$scope.formData.password) {
            $scope.showMsg('新密码不能为空');
            return false;
          }
          if (!$scope.formData.repassword) {
            $scope.showMsg('确认密码不能为空');
            return false;
          }
          if ($scope.formData.password !== $scope.formData.repassword) {
            $scope.showMsg('新密码和确认密码不一致');
            return false;
          }
          io.socket.get('/user/restPwd', {
            password: $scope.formData.password,
            phoneNumber: $scope.formData.phoneNumber
          }, function serverResponded(body, JWR) {
            if (JWR.statusCode !== 200) {
              $scope.showMsg('提交失败,请稍后再试！');
            }
            else{
              $scope.showMsg('密码修改成功！');
              $state.go('start');
            }
          });
        }
      });
    }
  }
});
