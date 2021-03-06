﻿'use strict';
angular.module('starter.controllers')
  .controller('LoginCtrl', function ($scope, $state, $http, $timeout, $ionicLoading, $ionicPopover, $location, loginService, UserInfo) {
    var vm = this;
    vm.user = {
      username: UserInfo.data.username || '',
      password: UserInfo.data.password || ''
    }

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

    $scope.login = function (user) {
      if (!user.username) {
        $scope.showMsg("请输入用户名");
        return;
      }
      if (!user.password) {
        $scope.showMsg("请输入密码");
        return;
      }
      $ionicLoading.show({
        template: "正在登录..."
      });

      loginService.userLogin(user.username, user.password, function (data) {
        $ionicLoading.hide();
        if (typeof(data) == "object") {
            UserInfo.save(data);
            $state.go('tab.index');
        }
        else {
          $scope.showMsg(data);
        }
      });

      //io.socket.get('/user/login', {
      //  userName: user.username,
      //  password: user.password
      //}, function serverResponded(body, JWR) {
      //  $ionicLoading.hide();
      //  if (JWR.statusCode == 200) {
      //    if (body.userType !== '货主') {
      //      $scope.showMsg('您不是货主用户，不能登录！');
      //    }
      //    else if (!body.status) {
      //      $scope.showMsg('您的账号异常,不允许登录！');
      //    }
      //    else {
      //      body.userName = user.username;
      //      user = body;
      //      UserInfo.save(user);
      //      $state.go('tab.index');
      //    }
      //  }
      //  else if (JWR.statusCode == 500) {
      //    $scope.showMsg(body.msg);
      //  }
      //  else {
      //    $scope.showMsg('请检查网络是否正常！');
      //  }
      //});
    }
  });
