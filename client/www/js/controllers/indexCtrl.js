'use strict';

angular.module('starter.controllers').controller('IndexCtrl', function($scope, $rootScope, $state, $http, $ionicPopover, $cordovaGeolocation, $timeout,$ionicModal,Userinfo, geolocationService) {
  if (!Userinfo.data.userid) {
    $state.go('start');
  }

  $scope.count = 0;
  $scope.page = 1;
  $scope.page_size = 10;
  $scope.load_over = true;
  // $scope.title = geolocationService.locationInfo.city ? '物流管家(' + geolocationService.locationInfo.city + ')' : '物流管家';
  $scope.title = '物流管家';
  $scope.carList = [];

  $scope.pulltextchange = '下拉刷新';

  $scope.pulltext = function() {
    $timeout(function() {
      $scope.pulltextchange = '快速找车、发货';
    })
  }

  // $rootScope.$on('geolocation.load', function() {
  //   $scope.title = geolocationService.locationInfo.city ? '物流管家(' + geolocationService.locationInfo.city + ')' : '物流管家';
  // });

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

  $scope.doRefresh = function() {
    $scope.count = 0;
    $scope.page = 1;
    $scope.page_size = 10;
    $scope.load_over = true;
    $scope.carList = [];
    $scope.loadCar();
    $scope.$broadcast("scroll.refreshComplete");
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.loadCar = function() {
    $timeout(function() {
      $http.get(ApiUrl + '/ws/sinfo/bizVehicleInfo/search', {
        params: {
          page: $scope.page,
          rows: $scope.page_size
        }
      }).success(function(data) {
        if (data.body && data.body.data.length > 0) {
          Userinfo.remove('unread_msg_count');
          if ($scope.page > 3) {
            $scope.load_over = false;
            return;
          }
          $scope.count = data.body.totalRecords;
          $scope.carList = $scope.carList.concat(data.body.data);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
          $scope.load_over = false;
          $scope.carList = $scope.carList.concat([]);
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }).error(function(data, status, headers, config) {
        $scope.showMsg('请求失败,网络不给力！');
      });
    }, 800);
  }

 $scope.interdetail = function(item) {
    $scope.carinfo = item;
    $scope.detail.show();
  };
  //返回
  $scope.closedetail = function() {
    $scope.detail.hide();
  };

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/car/item-cardetail.html ', {
    scope: $scope
  }).then(function(detail) {
    $scope.detail = detail;
  });

//托运
  $scope.consign = function(infoId){
    $http.get(ApiUrl + '/ws/sinfo/bizGoodsInfo/getlistWithLic', {
        params: {
          page: 1,
          rows: 10,
          issuerUserId: Userinfo.data.userid
        }
      }).success(function(data) {
        if (data.body && data.body.data.length > 0) {
            $scope.detail.hide();
            $state.go('choosegoods',{data:infoId});
        } else {
          $scope.showMsg('还没有货源请去发布货源！');
        }
      });


  }




  // $scope.doRefresh();
});
