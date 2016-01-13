'use strict';

angular.module('starter.controllers').controller('AllOrderCtrl', function ($scope, $http, $timeout, $ionicModal, $ionicLoading, $ionicHistory, $ionicPopover, $state, $stateParams, UserInfo) {
  //撤销订单
  $scope.cancelOrder = function (orderId) {
    var params = {
      orderId: orderId
    }
    $http.post(ApiUrl + '/ws/morder/bizOrder/cancelOrder', params)
      .success(function (data) {
        if (data.code == 200) {
          $scope.showMsg('撤单成功');
          $scope.doRefresh();
        }
      });
  }

//确认收货
  $scope.confirmPickup = function (orderId) {
    var params = {
      orderId: orderId
    }
    $http.post(ApiUrl + '/ws/morder/bizOrder/confirmPickup', params)
      .success(function (data) {
        if (data.code == 200) {
          $scope.showMsg('操作成功');
          $scope.doRefresh();
        }
      });
  }

  //确认签收
  $scope.confirmSign = function (orderId) {
    var params = {
      orderId: orderId
    }
    $http.post(ApiUrl + '/ws/morder/bizOrder/confirmSign', params)
      .success(function (data) {
        if (data.code == 200) {
          $scope.showMsg('签收成功');
          $scope.doRefresh();
        }
      });
  }

//评价按钮
  $scope.pingjia = function (orderId) {
    $state.go('evaluateorder', {data: orderId});

  }

//详情页面
  $scope.orderdetail = function (orderId) {
    $state.go('orderdetail', {data: orderId});
  }

  $scope.orderlist = [];
  $scope.load_over = true;
  $scope.pulltextchange = '下拉刷新';

  $scope.query = {
    page: 1,
    rows: 8,
    userId: UserInfo.data.userId
  };

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.orderlist = [];
    $scope.query.page = 1;
    $scope.load_over = true;
    $scope.loadMore();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '刷新订单';
    })
  };
  //更多
  $scope.loadMore = function () {
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/goods/userGoodsOrder', $scope.query, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          if (body.length > 0) {
            $scope.orderlist = $scope.orderlist.concat(body);
            $scope.query.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
          else{
            $scope.load_over = false;
            $scope.orderlist = $scope.orderlist.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
        }
      });
    }, 800);
  };

  //查看订单详情
  $scope.orderDetail = function (item) {
    $scope.orderItem = item;
    $scope.detail.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/order/allOrderDetail.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.detail = detail;
  });
  //返回
  $scope.closeDetail = function () {
    $scope.detail.hide();
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
    }, 1000);
  }

  //$scope.doRefresh();

});
