angular.module('starter.controllers').controller('AddGoodsCtrl', function ($rootScope, $scope, $location, $ionicLoading, CityPickerService, dictService, UserInfo, $state, $ionicPopover, $ionicHistory, $ionicModal, $timeout, geolocationService) {
  if (!UserInfo.data.userId) {
    $state.go('login');
  }

  var user = UserInfo.data;
  $scope.user=user;
  // var $scope = this;
  $scope.goodsInfo = {
    goodsType: '零担',//货物类型:零担, 整车, 城市配送
    goodsName: '',//货物名称
    goodsAttribute: '',//货物属性:普通, 加急
    goodsNumber: '', //货物数量
    goodsUnit: '', //数量单位:件, 方,吨
    carType: '',//需车类型
    carLength: '',//需车长
    consignor: '',//发货人
    sPhoneNumber: '',//起始地手机号码
    sCity: '',//起始地城市
    sCityCode: '',//起始地城市代码
    sStreet: '',//起始地街道
    sAddress: '',//起始地详细地址
    consignee: '',//收货人
    ePhoneNumber: '',//目的地手机号码
    eCity: '',//目的地城市
    eCityCode: '',//目的地城市代码
    eStreet: '',//目的地街道
    eAddress: '',//目的地详细地址
    publishType:'随机发货',// 发布方式
    status: true,//状态
    remark: '',//备注说明
    user: user.userId//所属用户
  };
  $scope.goodsInfo.goodsAttribute = dictService.goods_attr[0].name;
  $scope.goodsInfo.goodsUnit = dictService.goods_unit[0].name;
  $scope.goodsInfo.carType = dictService.car_type[0].name;

  $scope.locationInfo = geolocationService.locationInfo;
  var province = $scope.locationInfo.province;
  province = province.replace(/省/g, "");
  var city = $scope.locationInfo.city;
  city = city.replace(/市/g, "");
  $scope.goodsInfo.placeOfDeparture = province + city;

  dictService.street_data = [];
  $scope.streetList = [];
  $scope.carLengthList = [];

  $scope.$watch('goodsInfo.eCityCode', function () {
    $scope.goodsInfo.eStreet = '';
    if (!$scope.goodsInfo.eCityCode) {
      dictService.street_data = [];
      return;
    }
    else {
      $scope.streetList = [];
    }

    $timeout(function () {
      $scope.streetList = CityPickerService.getStreetData($scope.goodsInfo.eCityCode);
      dictService.street_data = [];

      for (var i = 0; i < $scope.streetList.length; i++) {
        dictService.street_data.push({id: $scope.streetList[i].id, name: $scope.streetList[i].areaName});
      }
    });


    //io.socket.get('/areas/getStreetData', {cityCode: $scope.goodsInfo.eCityCode}, function serverResponded(body, JWR) {
    //  if (JWR.statusCode !== 200) {
    //    dictService.street_data = [];
    //  }
    //  else {
    //    dictService.street_data = [];
    //    for (var i = 0; i < body.length; i++) {
    //      dictService.street_data.push(body[i].areaName);
    //    }
    //  }
    //});
  });

  $scope.$watch('goodsInfo.carType', function () {
    $scope.goodsInfo.carLength = '';
    if (!$scope.goodsInfo.carType) {
      dictService.car_length = [];
      return;
    }
    else {
      $scope.carLengthList = [];
    }

    $timeout(function () {
      $scope.carLengthList = dictService.getDictItem('car_type', $scope.goodsInfo.carType).car_length;
      dictService.car_length = $scope.carLengthList;
    });
  });

  $scope.showMsg = function (txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function () {
      $scope.popover.hide();
    }, 1000);
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };

  $scope.changeGoodsType = function (type) {
    $scope.goodsInfo.goodsType = type;
  }

  //触发收货目的信息弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/chooseEndInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.endInfoModal = modal;
  });
  //弹出收货目的信息页面
  $scope.showEndInfo = function () {
    if (!$scope.goodsInfo.eCity && $scope.goodsInfo.goodsType == '城市配送') {
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
            $scope.goodsInfo.eStreet = data.street;
          }
          if (data.streetNumber) {
            $scope.goodsInfo.eAddress = data.streetNumber;
          }
          $scope.goodsInfo.eCity = city;
          //$scope.goodsAddress.lng = data.longitude;
          //$scope.goodsAddress.lat = data.latitude;
        });
      }, function (err) {
      });
    }
    $scope.endInfoModal.show();
  };
  //弹出收货目的信息页面
  $scope.closeEndInfo = function () {
    $scope.endInfoModal.hide();
  };
  //隐藏收货目的信息页面
  $scope.hideEndInfo = function () {
    if (!$scope.goodsInfo.eCity) {
      $scope.showMsg('请选择目的城市');
      return;
    }
    if (!$scope.goodsInfo.sStreet) {
      $scope.showMsg('请选择目的地街道');
      return;
    }
    if (!$scope.goodsInfo.consignee) {
      $scope.showMsg('请填写收货人姓名');
      return;
    }
    if (!$scope.goodsInfo.sPhoneNumber) {
      $scope.showMsg('请填写收货人手机号码');
      return;
    }
    $scope.endInfoModal.hide();
  };

  //触发货物信息弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/goodsInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.goodsInfoModal = modal;
  });
  //弹出货物信息页面
  $scope.showGoodsInfo = function () {
    $scope.goodsInfoModal.show();
  };
  //关闭货物信息页面
  $scope.closeGoodsInfo = function () {
    $scope.goodsInfoModal.hide();
  };

  //隐藏货物信息页面
  $scope.hideGoodsInfo = function () {
    if (!$scope.goodsInfo.goodsName) {
      $scope.showMsg('请填写货物名称');
      return;
    }
    else {
      $scope.goodsInfo.goodsInfoText = $scope.goodsInfo.goodsName + '/' + $scope.goodsInfo.goodsAttribute;
    }
    if (!$scope.goodsInfo.goodsNumber) {
      $scope.showMsg('请填写货物数量');
      return;
    } else {
      $scope.goodsInfo.goodsInfoText += '/' + $scope.goodsInfo.goodsNumber + $scope.goodsInfo.goodsUnit;
    }
    $scope.goodsInfoModal.hide();
  };

  $scope.addGoods = function () {
    if (!$scope.goodsInfo.consignor || !$scope.goodsInfo.sCity || !$scope.goodsInfo.sPhoneNumber) {
      $scope.showMsg('请选择起始地发货信息！');
      return;
    }
    if (!$scope.goodsInfo.consignee || !$scope.goodsInfo.eCity || !$scope.goodsInfo.ePhoneNumber) {
      $scope.showMsg('请选择目的地收货信息！');
      return;
    }
    if (!$scope.goodsInfo.goodsName || !$scope.goodsInfo.goodsNumber) {
      $scope.showMsg('请填写货物信息！');
      return;
    }
    $ionicLoading.show({
      template: "正在发货中..."
    });
    io.socket.post('/goods/add', $scope.goodsInfo, function serverResponded(body, JWR) {
      $ionicLoading.hide();
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.showMsg('发货成功！');
        $state.go('tab.order');
      }
    });
  };

  //
  // 选择发货地址信息
  //

  //触发发货地址信息选择弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/chooseStartInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.startInfoModal = modal;
  });
  //弹出发货地址信息选择页面
  $scope.showStartInfo = function () {
    $scope.startInfoModal.show();
  };
  //选择发货地址信息
  $scope.selectStartInfo = function (item) {
    $scope.goodsInfo.sCity = item.city;
    $scope.goodsInfo.sCityCode = item.cityCode;
    $scope.goodsInfo.sStreet = item.street;
    $scope.goodsInfo.consignor = item.consignor;
    $scope.goodsInfo.sPhoneNumber = item.phoneNumber;
    $scope.goodsInfo.sAddress = item.address;

    $scope.startInfoModal.hide();
  };
  //隐藏发货地址信息选择页面
  $scope.hideStartInfo = function () {
    $scope.startInfoModal.hide();
  };

  $scope.goodsAddress = {
    consignor: '',//发货人
    phoneNumber: '',//手机号码
    city: '',//所在城市
    cityCode: '',//所在城市代码
    street: '',//街道
    address: '',//详细地址
    lng: '',//经度
    lat: '',//纬度
    isDefault: false,//是否默认发货地址
    user: user.userId//所属用户
  };

  $scope.isAdd = true;

  //触发发货地址弹出层事件
  $ionicModal.fromTemplateUrl('templates/user/addGoodsLine.html ', {
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
        cityCode: '',//所在城市代码
        street: '',//街道
        address: '',//详细地址
        lng: '',//经度
        lat: '',//纬度
        isDefault: false,//是否默认发货地址
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
    }
    $scope.goodsAddressModal.show();
  };
  //保存发货地址
  $scope.saveGoodsAddress = function () {
    if (!$scope.goodsAddress.consignor) {
      $scope.showMsg('请填写发货人姓名');
      return;
    }
    if (!$scope.goodsAddress.phoneNumber) {
      $scope.showMsg('请填写发货人手机号码');
      return;
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
    userId: user.userId
  };

  $scope.items = [];
  $scope.load_over = true;

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.items = [];
    $scope.query.page = 1;
    $scope.load_over = true;
    $scope.loadMore();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.loadMore = function () {
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
          }
          else {
            $scope.load_over = false;
            $scope.items = $scope.items.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
        }
      });
    }, 200);
  };

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

  $scope.postionGoods = function () {

  }
})
