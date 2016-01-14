angular.module('starter.controllers').controller('AddGoodsCtrl', function ($rootScope, $scope, $location, $ionicLoading, loginService, dictService, UserInfo, $state, $ionicPopover, $ionicHistory, $ionicModal, $timeout, geolocationService) {
  if (!UserInfo.data.userId) {
    $state.go('login');
  }

  var userInfo = UserInfo.data;
  // var $scope = this;
  $scope.goodsInfo = {
    goodsType: '零担',//货物类型:零担, 整车, 城市配送
    goodsName: '',//货物名称
    goodsAttribute: '',//货物属性:普通, 加急
    goodsNumber: '', //货物数量
    goodsUnit: '', //数量单位:件, 方,吨
    carType: '',//需车类型
    consignor: '',//发货人
    sPhoneNumber: '',//起始地手机号码
    sCity: '',//起始地城市
    sStreet: '',//起始地街道
    sAddress: '',//起始地详细地址
    consignee: '',//收货人
    ePhoneNumber: '',//目的地手机号码
    eCity: '',//目的地城市
    eStreet: '',//目的地街道
    eAddress: '',//目的地详细地址
    status: true,//状态
    user: userInfo.userId//所属用户
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

  //触发发货起始信息弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/chooseStartInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.startInfoModal = modal;
  });
  //弹出发货起始信息页面
  $scope.showStartInfo = function () {
    $scope.startInfoModal.show();
  };
  //隐藏发货起始信息页面
  $scope.hideStartInfo = function () {
    if (!$scope.goodsInfo.sCity) {
      $scope.showMsg('请选择起始城市');
      return;
    }
    if (!$scope.goodsInfo.sStreet) {
      $scope.showMsg('请选择起始地街道');
      return;
    }
    if (!$scope.goodsInfo.consignor) {
      $scope.showMsg('请填写发货人姓名');
      return;
    }
    if (!$scope.goodsInfo.sPhoneNumber) {
      $scope.showMsg('请填写发货人手机号码');
      return;
    }
    $scope.startInfoModal.hide();
  };

  //触发收货目的信息弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/chooseEndInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.endInfoModal = modal;
  });
  //弹出收货目的信息页面
  $scope.showEndInfo = function () {
    $scope.endInfoModal.show();
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
    if(!$scope.goodsInfo.consignor||!$scope.goodsInfo.sCity||!$scope.goodsInfo.sPhoneNumber)
    {
      $scope.showMsg('请选择起始地发货信息！');
      return;
    }
    if(!$scope.goodsInfo.consignee||!$scope.goodsInfo.eCity||!$scope.goodsInfo.ePhoneNumber)
    {
      $scope.showMsg('请选择目的地收货信息！');
      return;
    }
    if(!$scope.goodsInfo.goodsName||!$scope.goodsInfo.goodsNumber)
    {
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
        $state.go('tab.index');
      }
    });

  };

})
