'use strict';

angular.module('starter.controllers').controller('AccountCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, $stateParams, UserInfo, dictService,CityPickerService) {
  $scope.userData = {
    userId: '', //用户id
    cardNumber: '', //证件号码
    realName: '', //姓名
    //email: '', //电子邮箱
    enterpriseName: '', //企业名称
    city: '',//市
    cityCode:'',//城市代码
    street: '',//街道
    address: ''//详细地址
  };

  $scope.changePwdData = {
    userid: '', //用户id
    oldpassword: '', //老密码
    newpassword: '' //新密码
  }

  $scope.streetList = [];

  $scope.$watch('userData.cityCode', function (oldValue, newValue) {
    if (oldValue && newValue) $scope.userData.street = '';
    if (!$scope.userData.cityCode) {
      dictService.street_data = [];
      return;
    }
    else {
      $scope.streetList = [];
    }

    $timeout(function () {
      $scope.streetList = CityPickerService.getStreetData($scope.userData.cityCode);
      dictService.street_data = [];

      for (var i = 0; i < $scope.streetList.length; i++) {
        dictService.street_data.push({id: $scope.streetList[i].id, name: $scope.streetList[i].areaName});
      }
    });
  });

  $scope.$watch('userData.street', function () {
    if ($scope.userData.street == '选择所在街道') {
      $scope.userData.street = '';
    }
  });

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

  $scope.getUserInfo = function () {
    io.socket.get('/user/' + UserInfo.data.userId, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $timeout(function(){
          $scope.userData.userId = body.userId;
          $scope.userData.cardNumber = body.cardNumber;
          $scope.userData.realName = body.realName;
          $scope.userData.email = body.email;
          $scope.userData.enterpriseName = body.enterpriseName;
          $scope.userData.city = body.city;
          $scope.userData.street = body.street;
          $scope.userData.address = body.address;
        });
      }
    });
  }

  $scope.getUserInfo();

  $scope.saveUserInfo = function () {
    if (!$scope.userData.realName) {
      $scope.showMsg('请填写真实姓名');
      return false;
    }
    if (!$scope.userData.cardNumber) {
      $scope.showMsg('请填写身份证号码');
      return false;
    }
    //if (!$scope.userData.enterpriseName) {
    //  $scope.showMsg('请填写企业名称');
    //  return false;
    //}
    if (!$scope.userData.city) {
      $scope.showMsg('请选择所在城市');
      return false;
    }
    //if (!$scope.userData.street) {
    //  $scope.showMsg('请选择所属街道');
    //  return false;
    //}
    $ionicLoading.show({
      template: "正在更新个人资料..."
    });

    io.socket.post('/user/update', $scope.userData, function serverResponded(body, JWR) {
      $ionicLoading.hide();
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.showMsg('更新成功');
      }
    });
  }
});
