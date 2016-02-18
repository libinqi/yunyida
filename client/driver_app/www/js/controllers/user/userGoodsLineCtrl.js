'use strict';

angular.module('starter.controllers').controller('UserGoodsLineCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $ionicModal, $state, UserInfo, CityPickerService, dictService) {
  var user = UserInfo.data;
  $scope.pulltextchange = '下拉刷新';

  $scope.flag = {
    showDelete: false
  };

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

  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '加载更多专线';
    })
  };

  $scope.goodsLine = {
    sCity: '',//起始地城市
    sCityCode: '',//起始地城市代码
    sStreet: '',//起始地街道
    sAddress: '',//起始地详细地址
    eCity: '',//目的地城市
    eCityCode: '',//目的地城市代码
    eStreet: '',//目的地街道
    eAddress: '',//目的地详细地址
    lng: '',//经度
    lat: '',//纬度
    user: user.userId//所属用户
  };

  $scope.isAdd = true;

  $scope.$watch('goodsLine.sCityCode', function () {
    $scope.goodsLine.sStreet = '';
    if (!$scope.goodsLine.sCityCode) {
      dictService.s_street_data = [];
      return;
    }
    else {
      $scope.sStreetList = [];
    }

    $timeout(function () {
      $scope.sStreetList = CityPickerService.getStreetData($scope.goodsLine.sCityCode);
      dictService.s_street_data = [];

      for (var i = 0; i < $scope.sStreetList.length; i++) {
        dictService.s_street_data.push({id: $scope.sStreetList[i].id, name: $scope.sStreetList[i].areaName});
      }
    });
  });

  $scope.$watch('goodsLine.eCityCode', function () {
    $scope.goodsLine.eStreet = '';
    if (!$scope.goodsLine.eCityCode) {
      dictService.e_street_data = [];
      return;
    }
    else {
      $scope.eStreetList = [];
    }

    $timeout(function () {
      $scope.eStreetList = CityPickerService.getStreetData($scope.goodsLine.eCityCode);
      dictService.e_street_data = [];

      for (var i = 0; i < $scope.eStreetList.length; i++) {
        dictService.e_street_data.push({id: $scope.eStreetList[i].id, name: $scope.eStreetList[i].areaName});
      }
    });
  });

  //触发发货地址弹出层事件
  $ionicModal.fromTemplateUrl('templates/user/addGoodsLine.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.goodsLineModal = modal;
  });
  //弹出发货地址页面
  $scope.showGoodsLine = function (item) {
    if (item) {
      $scope.goodsLine = item;
      $scope.isAdd = false;
    }
    else {
      $scope.goodsLine = {
        sCity: '',//起始地城市
        sCityCode: '',//起始地城市代码
        sStreet: '',//起始地街道
        sAddress: '',//起始地详细地址
        eCity: '',//目的地城市
        eCityCode: '',//目的地城市代码
        eStreet: '',//目的地街道
        eAddress: '',//目的地详细地址
        lng: '',//经度
        lat: '',//纬度
        user: user.userId//所属用户
      };
      $scope.isAdd = true;

      window.LocationPlugin.getLocation(function (data) {
        //data.longitude 经度
        //data.latitude 纬度
        //data.province 省份
        //data.city 城市
        //data.cityCode 城市编码
        //data.district 区/县
        //data.street 街道
        //data.streetNumber 街道号码
        //data.address 文字描述的地址信息
        //data.hasRadius 是否有定位精度半径
        //data.radius 定位精度半径
        //data.type 定位方式
        $timeout(function () {
          var city = data.province.replace('省', '') + data.city.replace('市', '');
          if (data.district) {
            city += data.district;
          }
          if (data.street) {
            $scope.goodsLine.sStreet = data.street;
          }
          if (data.streetNumber) {
            $scope.goodsLine.sAddress = data.streetNumber;
          }
          $scope.goodsLine.sCity = city;
          $scope.goodsLine.lng = data.longitude;
          $scope.goodsLine.lat = data.latitude;
        });
      }, function (err) {
      });
    }
    $scope.goodsLineModal.show();
  };
  //保存发货地址
  $scope.saveGoodsLine = function () {
    if (!$scope.goodsLine.sCity) {
      $scope.showMsg('请选择起始城市');
      return;
    }
    if (!$scope.goodsLine.sStreet) {
      $scope.showMsg('请选择起始地街道');
      return;
    }
    if (!$scope.goodsLine.eCity) {
      $scope.showMsg('请选择目的城市');
      return;
    }
    if (!$scope.goodsLine.eStreet) {
      $scope.showMsg('请选择目的地街道');
      return;
    }
    $ionicLoading.show({
      template: "正在保存专线信息..."
    });
    if ($scope.isAdd) {
      io.socket.post('/goodsLine/add', $scope.goodsLine, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          $scope.showMsg('您的专线保存成功！');
          $scope.doRefresh();
          $scope.goodsLineModal.hide();
        }
      });
    }
    else {
      io.socket.post('/goodsLine/update', $scope.goodsLine, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          $scope.showMsg('您的专线保存成功！');
          $scope.doRefresh();
          $scope.goodsLineModal.hide();
        }
      });
    }
  };
  //隐藏发货地址页面
  $scope.hideGoodsLine = function () {
    $scope.goodsLineModal.hide();
  };

  $scope.query = {
    page: 1,
    rows: 8,
    userId: user.userId
  };

  $scope.items = [];
  $scope.load_over = true;

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.items = [];
    $scope.query.page = 1;
    $scope.load_over = false;
    $scope.loadMore();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.loadMore = function () {
    $scope.load_over = false;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/goodsLine/userGoodsLine', $scope.query, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          if (body.length > 0) {
            $scope.items = $scope.items.concat(body);
            $scope.query.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = true;
          }
          else {
            $scope.items = $scope.items.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = false;
          }
        }
      });
    }, 800);
  };

  //删除发货地址
  $scope.delGoodsLine = function (goodsLineId) {
    io.socket.post('/goodsLine/deleteGoodsLine', {goodsLineId: goodsLineId}, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.doRefresh();
      }
    });
  }

});
