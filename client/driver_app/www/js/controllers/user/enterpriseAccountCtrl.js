'use strict';

angular.module('starter.controllers').controller('EnterpriseAccountCtrl', function ($scope, $http, $timeout, $ionicHistory, $ionicLoading, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $state, UserInfo, loginService, CityPickerService, dictService, geolocationService) {
    $scope.userData = {
      userId: '',//用户Id
      enterpriseId: '',//企业Id
      realName: '', //姓名
      enterpriseName: '', //企业名称
      city: '',//市
      street: '',//街道
      address: '',//详细地址
      cityCode: '',//城市或者地址代码
      cardNumber: '',//证件号码
      businessLicenseNumber: '',//营业执照编号
      businessType: '',//业务类型
      lng: '',//经度
      lat: ''//纬度
    };

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

    //window.LocationPlugin.getLocation(function (data) {
    //  //data.longitude 经度
    //  //data.latitude 纬度
    //  //data.province 省份
    //  //data.city 城市
    //  //data.cityCode 城市编码
    //  //data.district 区/县
    //  //data.street 街道
    //  //data.streetNumber 街道号码
    //  //data.address 文字描述的地址信息
    //  //data.hasRadius 是否有定位精度半径
    //  //data.radius 定位精度半径
    //  //data.type 定位方式
    //  $timeout(function () {
    //    var city = data.province.replace('省', '') + data.city.replace('市', '');
    //    if (data.district) {
    //      city += data.district;
    //    }
    //    if (data.street) {
    //      $scope.userData.street = data.street;
    //    }
    //    if (data.streetNumber) {
    //      $scope.userData.address = data.streetNumber;
    //    }
    //    $scope.userData.city = city;
    //    $scope.userData.lng = data.longitude;
    //    $scope.userData.lat = data.latitude;
    //  });
    //}, function (err) {
    //});

    $scope.getEnterpriseInfo = function () {
      io.socket.get('/enterprise/' + UserInfo.data.userId, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
          $scope.backGo();
        }
        else {
          $timeout(function () {
            $scope.userData.userId = body.user.userId;
            $scope.userData.realName = body.user.realName;
            $scope.userData.enterpriseName = body.user.enterpriseName;
            $scope.userData.city = body.user.city;
            $scope.userData.cityCode = body.user.cityCode;
            $scope.userData.cardNumber = body.user.cardNumber;
            $scope.userData.street = body.user.street;
            $scope.userData.address = body.user.address;
            $scope.userData.enterpriseId = body.enterpriseId;
            $scope.userData.businessLicenseNumber = body.businessLicenseNumber;
            $scope.userData.businessType = body.businessType;
            $scope.userData.lng = body.user.lng;
            $scope.userData.lat = body.user.lat;

            $scope.businessTypeList = [
              {text: "零担", checked: $scope.userData.businessType.indexOf('零担') >= 0},
              {text: "城市配送", checked: $scope.userData.businessType.indexOf('城市配送') >= 0},
              {text: "整车", checked: $scope.userData.businessType.indexOf('整车') >= 0}
            ];
          });
        }
      });
    }

    $scope.getEnterpriseInfo();

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

    $scope.saveEnterpriseInfo = function () {
      if (!$scope.userData.realName) {
        $scope.showMsg('姓名不能为空');
        return false;
      }
      if (!$scope.userData.cardNumber) {
        $scope.showMsg('身份证号码不能为空');
        return false;
      }
      if (!$scope.userData.enterpriseName) {
        $scope.showMsg('企业名称不能为空');
        return false;
      }
      if (!$scope.userData.city) {
        $scope.showMsg('所在城市不能为空');
        return false;
      }
      if (!$scope.userData.street) {
        $scope.showMsg('街道不能为空');
        return false;
      }
      if (!$scope.userData.businessLicenseNumber) {
        $scope.showMsg('营业执照编号不能为空');
        return false;
      }
      var businessType = '';
      for (var i = 0; i < $scope.businessTypeList.length; i++) {
        if ($scope.businessTypeList[i].checked) {
          if (businessType == '') {
            businessType += $scope.businessTypeList[i].text;
          }
          else {
            businessType += ',' + $scope.businessTypeList[i].text;
          }
        }
      }
      if (businessType == '') {
        $scope.showMsg('业务类型必选一项');
        return false;
      }

      $scope.userData.businessType = businessType;
      $scope.userData.userType = '物流企业';

      $ionicLoading.show({
        template: "正在更新企业资料..."
      });
      io.socket.post('/enterprise/update', $scope.userData, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          $scope.showMsg('更新成功');
        }
      });
    }
  }
);
