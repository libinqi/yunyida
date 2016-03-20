'use strict';

angular.module('starter.controllers').controller('AllOrderCtrl', function ($rootScope, $scope, $http, $timeout, $location, $ionicModal, $ionicLoading, $ionicHistory, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate, $state, $stateParams, UserInfo) {
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

  $scope.orderList = [];
  $scope.load_over = true;
  $scope.pulltextchange = '下拉刷新';

  $scope.flag = {
    showDelete: false
  };

  $scope.query = {
    page: 1,
    rows: 8,
    orderStatus: '',
    userId: UserInfo.data.userId
  };

  $scope.orderStatisList = [
    {status: '全部', count: 0},
    {status: '已报价', count: 0},
    {status: '已接单', count: 0},
    {status: '已承运', count: 0},
    {status: '已取消', count: 0},
    {status: '已完成', count: 0}
  ];

  $scope.toggleLeft = function () {
    //$ionicSideMenuDelegate.toggleLeft();
    //$timeout(function () {
    $scope.getOrderStatis();
    //});
  };

  $scope.getOrderStatis = function () {
    io.socket.get('/order/carrierOrderStatis', $scope.query, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        if (body.length > 0) {
          $scope.orderStatisList = body;
        }
        $ionicSideMenuDelegate.toggleLeft();
      }
    });
  }

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.orderList = [];
    $scope.query.page = 1;
    $scope.load_over = false;
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
    //$scope.load_over = false;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/order/carrierOrder', $scope.query, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          if (body.length > 0) {
            $scope.orderList = $scope.orderList.concat(body);
            $scope.query.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = true;
          }
          else {
            $scope.orderList = $scope.orderList.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = false;
          }
        }
      });
    }, 800);
  };

  if ($location.search().refresh) {
    if ($scope.detail) {
      $scope.detail.hide();
    }
    $scope.doRefresh();
  }
  //$timeout(function () {
  //  $scope.loadMore();
  //});
  $rootScope.$on('orderRefresh', function (event) {
    if ($scope.detail) {
      $scope.detail.hide();
    }
    $scope.doRefresh();
  });

  // Resume refresh
  $rootScope.$on('onResumeCordova', function (event) {
    if ($scope.detail) {
      $scope.detail.hide();
    }
    $scope.doRefresh();
  });

  // System events
  document.addEventListener("resume", resume, false);

  function resume() {
    var div = document.getElementsByTagName('body')[0];
    var scope = angular.element(div).scope();
    var rootScope = scope.$root;
    rootScope.$apply(function () {
      rootScope.$broadcast('onResumeCordova');
    });
  }

  $scope.orderFilter = function (orderStatus) {
    if (orderStatus == '全部')orderStatus = '';
    $scope.query.orderStatus = orderStatus;
    $scope.doRefresh();
    $scope.toggleLeft();
  }

  $scope.orderStatusPic = function (orderStatus) {
    var img = '';
    switch (orderStatus) {
      case '已报价':
        img = 'order1';
        break;
      case '已接单':
        img = 'order2';
        break;
      case '已承运':
        img = 'order3';
        break;
      case '已完成':
        img = 'order4';
        break;
      case '已取消':
        img = 'order5';
        break;
    }
    return img;
  }

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
  //关闭订单详情
  $scope.closeDetail = function () {
    $scope.detail.hide();
  };

  //取消已报价
  $scope.cancelOrder = function (orderId, goodsOrderStatus) {
    var orderStatus = goodsOrderStatus == "已报价" ? "报价" : "接单";
    var confirmPopup = $ionicPopup.confirm({
      title: '取消已报价',
      template: '您确定要取消' + orderStatus + '吗?',
      buttons: [
        {
          text: '暂不取消', onTap: function (e) {
          return false;
        }
        },
        {
          text: '确定', type: 'button-positive', onTap: function (e) {
          return true;
        }
        }
      ]
    });
    confirmPopup.then(function (res) {
      if (res) {
        io.socket.post('/order/unAddOrder', {
          orderId: orderId
        }, function serverResponded(body, JWR) {
          if (JWR.statusCode !== 200) {
            $scope.showMsg('请求失败,网络不给力！');
          }
          else {
            for (var i = 0; i < $scope.orderList.length; i++) {
              if ($scope.orderList[i].goodsOrderId == body.goodsOrderId) {
                $scope.orderList[i] = body;
                if ($scope.orderItem) {
                  $scope.orderItem = body;
                }
              }
            }
            $scope.showMsg('取消' + orderStatus + '成功！');
            $scope.closeDetail();
            $scope.doRefresh();
          }
        });
      }
    });
  }

  //已接单
  $scope.confirmOrder = function (orderId) {
    io.socket.post('/order/updateOrder', {orderId: orderId, orderStatus: '已接单'}, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        for (var i = 0; i < $scope.orderList.length; i++) {
          if ($scope.orderList[i].goodsOrderId == body.goodsOrderId) {
            $scope.orderList[i] = body;
            if ($scope.orderItem) {
              $scope.orderItem = body;
            }
          }
        }
        $scope.showMsg('已接单成功！');
      }
    });
  }


  $scope.carrierOrder = {
    pricing: '',
    orderId: ''
  }

  //已承运
  $scope.confirmCarrier = function (orderId) {
    $scope.carrierOrder.orderId = orderId;
    $scope.confirmCarrierOrder.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/order/carrierOrder.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.confirmCarrierOrder = detail;
  });
  //关闭已承运
  $scope.closeCarrier = function () {
    $scope.confirmCarrierOrder.hide();
  };

  //运费
  $scope.carrierSubmit = function () {
    if (!$scope.carrierOrder.pricing && $scope.carrierOrder.pricing <= 0) {
      $scope.showMsg("请输入运费");
      return;
    }

    if (isNaN($scope.carrierOrder.pricing) || parseInt($scope.carrierOrder.pricing) <= 0) {
      $scope.showMsg("您输入的运费格式不正确");
      return;
    }

    io.socket.post('/order/confirmCarrier', $scope.carrierOrder, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        for (var i = 0; i < $scope.orderList.length; i++) {
          if ($scope.orderList[i].goodsOrderId == body.goodsOrderId) {
            if (body.status) {
              $scope.orderList[i] = body;
              if ($scope.orderItem) {
                $scope.orderItem = body;
              }
              $scope.closeCarrier();
              $scope.showMsg('承运成功，幸苦啦!');
              $scope.closeDetail();
              $scope.doRefresh();
            }
          }
        }
      }
    });
  }

  $scope.evaluatePeopleClass = function (num) {
    var rtnClass = "";
    if ($scope.orderItem.evaluationLevel >= num) {
      rtnClass = "stared";
    }
    else {
      rtnClass = "star";
    }
    return rtnClass;
  }
});
