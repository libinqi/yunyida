'use strict';

angular.module('starter.controllers').controller('UserGoodsAddressCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $ionicModal, $state, UserInfo,CityPickerService ,dictService) {
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
      $scope.pulltextchange = '加载更多发货地址';
    })
  };

  $scope.goodsAddress = {
    consignor: '',//发货人
    phoneNumber: '',//手机号码
    city: '',//所在城市
    cityCode: '',//城市代码
    street: '',//街道
    address: '',//详细地址
    lng: '',//经度
    lat: '',//纬度
    isDefault: false,//是否默认发货地址
    type:'发货',
    user: user.userId//所属用户
  };

  $scope.isAdd = true;
  $scope.streetList = [];

  //触发发货地址弹出层事件
  $ionicModal.fromTemplateUrl('templates/user/addGoodsAddress.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.goodsAddressModal = modal;
  });
  //弹出发货地址页面
  $scope.showGoodsAddress = function (item) {
    if (item) {
      $scope.goodsAddress = item;
      $scope.isAdd = false;
    }
    else {
      $scope.goodsAddress = {
        consignor: '',//发货人
        phoneNumber: '',//手机号码
        city: '',//所在城市
        cityCode: '',//所在城市编码
        street: '',//街道
        address: '',//详细地址
        lng: '',//经度
        lat: '',//纬度
        isDefault: false,//是否默认发货地址
        type:'发货',
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
            $scope.goodsAddress.street = data.street;
          }
          if (data.streetNumber) {
            $scope.goodsAddress.address = data.streetNumber;
          }
          $scope.goodsAddress.city = city;
          $scope.goodsAddress.lng = data.longitude;
          $scope.goodsAddress.lat = data.latitude;
        });
      }, function (err) {
      });

      $scope.$watch('goodsAddress.cityCode', function () {
        $scope.goodsAddress.street = '';
        if (!$scope.goodsAddress.cityCode) {
          dictService.street_data = [];
          return;
        }
        else {
          $scope.streetList = [];
        }

        $timeout(function () {
          $scope.streetList = CityPickerService.getStreetData($scope.goodsAddress.cityCode);
          dictService.street_data = [];

          for (var i = 0; i < $scope.streetList.length; i++) {
            dictService.street_data.push({id: $scope.streetList[i].id, name: $scope.streetList[i].areaName});
          }
        });
      });
    }
    $scope.goodsAddressModal.show();
  };
  //保存发货地址
  $scope.saveGoodsAddress = function () {
    if (!$scope.goodsAddress.consignor) {
      $scope.showMsg('请填写发货人姓名');
      return;
    }
    var reg = /^1\d{10}$/;
    if (!$scope.goodsAddress.phoneNumber) {
      $scope.showMsg('请填写发货人手机号码');
      return false;
    } else if (!reg.test($scope.goodsAddress.phoneNumber)) {
      $scope.showMsg('手机号格式错误');
      return false;
    }
    if (!$scope.goodsAddress.city) {
      $scope.showMsg('请选择起始城市');
      return;
    }
    if (!$scope.goodsAddress.street) {
      $scope.showMsg('请选择起始地街道');
      return;
    }
    $ionicLoading.show({
      template: "正在保存发货地址..."
    });
    if ($scope.isAdd) {
      io.socket.post('/goodsAddress/add', $scope.goodsAddress, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          $scope.showMsg('发货地址保存成功！');
          $scope.doRefresh();
          $scope.goodsAddressModal.hide();
        }
      });
    }
    else {
      io.socket.post('/goodsAddress/update', $scope.goodsAddress, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          $scope.showMsg('发货地址保存成功！');
          $scope.doRefresh();
          $scope.goodsAddressModal.hide();
        }
      });
    }
  };
  //隐藏发货地址页面
  $scope.hideGoodsAddress = function () {
    $scope.goodsAddressModal.hide();
  };

  $scope.query = {
    page: 1,
    rows: 8,
    type:'发货',
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
    //$scope.load_over = false;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/goodsAddress/userGoodsAddress', $scope.query, function serverResponded(body, JWR) {
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
    }, 200);
  };

  //删除发货地址
  $scope.delGoodsAddress = function (goodsAddressId) {
    io.socket.post('/goodsAddress/deleteGoodsAddress', {goodsAddressId: goodsAddressId}, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.doRefresh();
      }
    });
  }

  //设为默认发货地址
  $scope.defaultGoodsAddress = function (goodsAddressId) {
    io.socket.post('/goodsAddress/defaultGoodsAddress', {
      userId: user.userId,
      goodsAddressId: goodsAddressId
    }, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.doRefresh();
        $scope.showMsg('设为默认发货地址成功！');
      }
    });
  }


});
