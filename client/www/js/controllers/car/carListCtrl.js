angular.module('starter.controllers').controller('CarListCtrl', function ($rootScope, $state, $http, $scope, $ionicModal, $ionicScrollDelegate, $location, $ionicHistory, $ionicLoading, loginService, cacheService, UserInfo, $timeout, geolocationService, $filter, dictService) {

  $scope.carInfoList = {
    currentPage: 1,
    itemsPerPage: 10,
    sCity: '',
    eCity: '',
    vehicleType: '',
    vehicleLength: '',
    loadWeight: ''
  }


  $scope.locationInfo = geolocationService.locationInfo;
  var province = $scope.locationInfo.province;
  province = province.replace(/省/g, "");
  var city = $scope.locationInfo.city;
  city = city.replace(/市/g, "");

  $scope.carInfoList.sCity = province + city;

  $scope.pulltextchange = '下拉刷新';

  $scope.backGo = function () {
    $ionicHistory.goBack();
    $scope.detail.hide();
  };


  //下拉刷新
  $scope.doRefresh = function () {
    $scope.carInfoList.currentPage = 1;
    $scope.load_over = true;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      var svehiclelength, evehiclelength, sweight, eweight;
      var vehicleType = $scope.carInfoList.vehicleType == "不限" ? '' : $scope.carInfoList.vehicleType;
      if ($scope.carInfoList.vehicleLength) {
        svehiclelength = dictService.getDictItem('car_length', $scope.carInfoList.vehicleLength).value[0];
        evehiclelength = dictService.getDictItem('car_length', $scope.carInfoList.vehicleLength).value[1];
      } else {
        svehiclelength = '';
        evehiclelength = '';
      }

      if ($scope.carInfoList.loadWeight) {
        sweight = dictService.getDictItem('goods_weight', $scope.carInfoList.loadWeight).value[0];
        eweight = dictService.getDictItem('goods_weight', $scope.carInfoList.loadWeight).value[1];
      } else {
        sweight = '';
        eweight = '';
      }
      loginService.carInfoQuery($scope.carInfoList.currentPage,
        $scope.carInfoList.itemsPerPage,
        $scope.carInfoList.sCity,
        $scope.carInfoList.eCity,
        vehicleType,
        svehiclelength,
        evehiclelength,
        sweight,
        eweight
      ).then(function (response) {
        if (response.data.code == "200" && response.data.body.data) {
          $scope.items = [];
          $scope.items = response.data.body.data;
          $scope.carInfoList.currentPage++;
          $scope.$broadcast("scroll.refreshComplete");

        } else {
          $scope.items = [];
          $scope.$broadcast("scroll.refreshComplete");
        }
      });
    }, 200);
    // 停止广播ion-refresher
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '快速找车';
    })
  };
  //更多
  $scope.items = [];
  $scope.load_over = true;
  // $ionicLoading.show({
  //       template: "加载中..."
  //     });
  $scope.loadMore = function () {
    var vehicleType = $scope.carInfoList.vehicleType == "不限" ? '' : $scope.carInfoList.vehicleType;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      var svehiclelength, evehiclelength, sweight, eweight;
      var vehicleType = $scope.carInfoList.vehicleType == "不限" ? '' : $scope.carInfoList.vehicleType;
      if ($scope.carInfoList.vehicleLength) {
        svehiclelength = dictService.getDictItem('car_length', $scope.carInfoList.vehicleLength).value[0];
        evehiclelength = dictService.getDictItem('car_length', $scope.carInfoList.vehicleLength).value[1];
      } else {
        svehiclelength = '';
        evehiclelength = '';
      }

      if ($scope.carInfoList.loadWeight) {
        sweight = dictService.getDictItem('goods_weight', $scope.carInfoList.loadWeight).value[0];
        eweight = dictService.getDictItem('goods_weight', $scope.carInfoList.loadWeight).value[1];
      } else {
        sweight = '';
        eweight = '';
      }

      loginService.carInfoQuery($scope.carInfoList.currentPage,
        $scope.carInfoList.itemsPerPage,
        $scope.carInfoList.sCity,
        $scope.carInfoList.eCity,
        vehicleType,
        svehiclelength,
        evehiclelength,
        sweight,
        eweight
      ).then(function (response) {
        if ($scope.carInfoList.currentPage > response.data.body.totalPage) {
          $scope.load_over = false;
          return;
        }

        if (response.data && response.data.code == "200") {
          $scope.items = $scope.items.concat(response.data.body.data);
          $scope.carInfoList.currentPage++;
          $scope.$broadcast("scroll.infiniteScrollComplete");

        } else {

        }
      });
    }, 200);
  };

//触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/car/find.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });
  //图标弹出查询页面
  $scope.search = function () {
    $scope.modal.show();
  };
  //返回和查询
  $scope.closesearch = function () {
    $scope.modal.hide();
    $scope.doRefresh();
  };
  //重置
  $scope.research = function () {
    $scope.carInfoList = {
      currentPage: 1,
      itemsPerPage: 10,
      sCity: '',
      eCity: '',
      vehicleType: '',
      vehicleLength: '',
      loadWeight: ''
    }
  };


  // $scope.carinfo = $rootScope.carinfo || {};
  $scope.interdetail = function (item) {
    $scope.carinfo = item;
    $scope.detail.show();
  };
  //返回
  $scope.closedetail = function () {
    $scope.detail.hide();
  };

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/car/item-cardetail.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.detail = detail;
  });


  //托运
  $scope.consign = function (infoId) {
    $http.get(ApiUrl + '/ws/sinfo/bizGoodsInfo/getlistWithLic', {
      params: {
        page: 1,
        rows: 10,
        issuerUserId: UserInfo.data.userid
      }
    }).success(function (data) {
      if (data.body && data.body.data.length > 0) {
        $scope.detail.hide();
        $state.go('choosegoods', {data: infoId});
      } else {
        $scope.showMsg('还没有货源请去发布货源！');
      }
    });


  }


})
