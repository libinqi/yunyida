angular.module('starter.controllers').controller('AddGoodsCtrl', function($rootScope,$scope,$location,loginService,dictService,Userinfo,$state, $ionicPopover,$ionicHistory,$timeout,geolocationService) {
  var userinfo = Userinfo.data;
  // var $scope = this;
  $scope.goodsInfo = {
    goodsId: '', //货源Id
    placeOfDeparture: '', //启运地
    destination: '', //目的地
    descriptionOfGoods: '', //货物名称
    goodsItemGrossWeight: 0, //货物重量
    goodsClassificationCode: '', //货物类型编码
    goodsClassificationName: '', //货物类型名称
    plannedLoadingType: '', //装货时间
    expectArriveTime: '', //预计到达时间
    plannedLoadingTime: '', //计划装货时间
    availablePeriod: '', //有效期
    availablePeriodName: '', //过期时间名称
    eventEffectiveEndTime: '', //有效截止时间
    goodsNumber: '', //货物数量（件）
    goodsCube: 0,//货物体积（方）
    vehicleType: '', //所需车型
    vehicleTypeName: '', //车辆类型名称
    vehicleLength: '', //所需车长
    vehicleCount: 1, //所需车数
    vehicleRequireDescription: '', //所需车辆描述
    goodsStatus: '', //货源状态
    goodsStatusName: '', //货源状态名称
    goodsImage: '', //货源图片
    freightCharges: '', //运费
    insureCharges: '', //保险费
    insureContent: '', //投保详情
    contactName: userinfo.contactname, //联系人
    telephoneNumber: userinfo.phone, //电话号码
    freeText: '', //自由文本
    infoText: '', //信息文本
    goodsResType: '', //货源类型
    goodsResTypeName: '', //货源类型名称
    goodsResStatus: '', //货源状态
    goodsResStatusName: '', //货源状态名称
    issuerType: userinfo.usertype, //发布者类型
    issuerTypeName: userinfo.usertypename, //发布者类型名称
    issuerUserId: userinfo.userid, //发布人员ID
    issuerEnterpriseId: userinfo.enterpriseid, //发布企业ID
    issuerName: userinfo.deptname, //发布者名称
    issueTime: '', //发布时间
    upTime: '', //更新时间
    platform: '1', //平台（0平台1园区）
    personal: '1', //是否专属信息（0：公共1：专属）
    customerId: parkInfo.id, //专属信息客户ID
    customerInfo: '', //专属信息客户信息
    datasource:userinfo.enterpriseid
  };
  $scope.goodsInfo.goodsClassificationName = dictService.goods_type[0].name;
  $scope.goodsInfo.vehicleTypeName = dictService.car_type[0].name;
  $scope.goodsInfo.availablePeriodName = dictService.validate_type[1].name;

  $scope.locationInfo = geolocationService.locationInfo;
  var province = $scope.locationInfo.province;
  province = province.replace(/省/g,"");
  var city = $scope.locationInfo.city;
  city = city.replace(/市/g,"");
  $scope.goodsInfo.placeOfDeparture = province+city;

  $scope.buildGoodsInfoText = function() {
    $scope.goodsInfo.infoText = '';
    var infoText = '';

    for (var i = 0; i < dictService.goods_type.length; i++) {
      if($scope.goodsInfo.goodsClassificationName == dictService.goods_type[i].name){
        $scope.goodsInfo.goodsClassificationCode = dictService.goods_type[i].id;
      }

    };

    for (var j = 0; j < dictService.car_type.length; j++) {
      if($scope.goodsInfo.vehicleTypeName == dictService.car_type[j].name){
        $scope.goodsInfo.vehicleType = dictService.car_type[j].id;
      }

    };

    for (var g = 0; g < dictService.validate_type.length; g++) {
      if($scope.goodsInfo.availablePeriodName == dictService.validate_type[g].name){
        $scope.goodsInfo.availablePeriod = dictService.validate_type[g].id;
      }

    };

    if(!$scope.goodsInfo.destination){
      $scope.goodsInfo.destination = "全国";
    }
    infoText += $scope.goodsInfo.placeOfDeparture;
   infoText += '→' + $scope.goodsInfo.destination;


    if ($scope.goodsInfo.goodsItemGrossWeight && $scope.goodsInfo.goodsItemGrossWeight > 0 && $scope.goodsInfo.goodsClassificationCode) {
      infoText += ',有' + $scope.goodsInfo.goodsItemGrossWeight + '吨';
      var goodsType = $scope.goodsInfo.goodsClassificationName;
      infoText += goodsType;
    } else if ($scope.goodsInfo.goodsItemGrossWeight && $scope.goodsInfo.goodsItemGrossWeight > 0 && !$scope.goodsInfo.goodsClassificationCode) {
      infoText += ',有货' + $scope.goodsInfo.goodsItemGrossWeight + '吨';
    } else if ($scope.goodsInfo.goodsClassificationCode) {
      var goodsType = $scope.goodsInfo.goodsClassificationName;
      infoText += ',有' + goodsType;
    } else {
      infoText += ',有货';
    }

    if ($scope.goodsInfo.vehicleType && $scope.goodsInfo.vehicleTypeName!='不限') {
      infoText += ',求' ;
      infoText += $scope.goodsInfo.vehicleTypeName;
    } else {
      $scope.goodsInfo.vehicleTypeName='';
      infoText += ',求车';
    }
    $scope.goodsInfo.infoText = infoText;
  }

  $scope.addGoods = function() {

    $scope.buildGoodsInfoText();
      loginService.pushGoodsInfo($scope.goodsInfo).then(function(response) {
        if (response.data && response.data.code == "200") {
          $scope.showMsg("货源发布成功！");
          $state.go('tab.order');
        } else {
          $scope.showMsg("提交数据错误");
        }
      });

  };

  $scope.showMsg = function(txt) {
      var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
      $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
      });
      $scope.popover.show();
      $timeout(function() {
        $scope.popover.hide();
      }, 1000);
    }

  $scope.backGo = function() {
    $ionicHistory.goBack();
  };

})
