'use strict';

angular.module('starter.controllers').controller('AllOrderCtrl', function ($rootScope, $scope, $http, $location, $timeout, $ionicModal, $ionicLoading, $ionicHistory, $ionicPopover, $ionicPopup, $ionicSideMenuDelegate, $state, $stateParams, UserInfo) {
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
    {status: '已下单', count: 0},
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
    io.socket.get('/order/shipperOrderStatis', $scope.query, function serverResponded(body, JWR) {
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
      io.socket.get('/order/userOrder', $scope.query, function serverResponded(body, JWR) {
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
    }, 200);
  };

  if ($location.search().refresh) {
    if ($scope.detail) {
      $scope.detail.hide();
    }
    $scope.driverInfoModal.hide();
    if ($scope.driverInfoModal) {
      $scope.driverInfoModal.hide();
    }
    if($scope.evaluate)
    {
      $scope.evaluate.hide();
    }
    $scope.loadMore();
  }
  //$timeout(function () {
  //  $scope.loadMore();
  //});

  // Resume refresh
  $rootScope.$on('onResumeCordova', function (event) {
    if ($scope.detail) {
      $scope.detail.hide();
    }
    $scope.driverInfoModal.hide();
    if ($scope.driverInfoModal) {
      $scope.driverInfoModal.hide();
    }
    if($scope.evaluate)
    {
      $scope.evaluate.hide();
    }
    $scope.loadMore();
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
      case '已下单':
        img = 'order1';
        break;
      case '已报价':
        img = 'order2';
        break;
      case '已接单':
        img = 'order3';
        break;
      case '已承运':
        img = 'order4';
        break;
      case '已完成':
        img = 'order5';
        break;
      case '已取消':
        img = 'order6';
        break;
    }
    return img;
  }


  $scope.driverInfo;
  $scope.driverItem;

  //触发承运人详情选择弹出层事件
  $ionicModal.fromTemplateUrl('templates/order/driverInfo.html ', {
    scope: $scope
  }).then(function (modal) {
    $scope.driverInfoModal = modal;
  });
  //弹出承运人详情选择页面
  $scope.showDriverInfo = function () {
    $scope.driverInfoModal.show();
  };
  //隐藏承运人详情选择页面
  $scope.hideDriverInfo = function () {
    $scope.driverInfoModal.hide();
  };

  $scope.getDriver = function (item) {
    io.socket.get('/user/' + item.userId, function serverResponded(user, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.driverInfo = user;
        $scope.getGoodsLine($scope.driverInfo);
        var url = $scope.driverInfo.userType == '司机' ? '/driver/' + $scope.driverInfo.userId : '/enterprise/' + $scope.driverInfo.userId;
        io.socket.post(url, function serverResponded(body, JWR) {
          if (JWR.statusCode !== 200) {
            $scope.showMsg('请求失败,网络不给力！');
          }
          else {
            $scope.driverItem = body;
            //$scope.showDriverInfo();
          }
        });
      }
    });
  }

  $scope.getGoodsLine = function (item) {
    io.socket.get('/goodsLine/userGoodsLine', {
      userId: item.userId,
      page: 1,
      rows: 50,
      orderStatus: '已完成'
    }, function serverResponded(data, JWR) {
      if (JWR.statusCode == 200) {
        item.goodsLines = data;
      }
    });
  }

  $scope.getCarrierOrder = function (item) {
    io.socket.get('/order/carrierOrder', {
      userId: item.userId,
      page: 1,
      rows: 50,
      orderStatus: '已完成'
    }, function serverResponded(data, JWR) {
      if (JWR.statusCode == 200) {
        $timeout(function () {
          item.orderList = data;
        });
      }
    });
  }

  $scope.getCarrierEvaluation = function (item) {
    io.socket.get('/order/carrierEvaluation', {carrier: item.userId}, function serverResponded(data, JWR) {
      if (JWR.statusCode == 200) {
        $timeout(function () {
          item.orderTotal = data.body.orderTotal;
          item.evaluationScore = data.body.evaluationScore;
          if (item.evaluationScore) {
            item.evaluationScore = item.evaluationScore.toString();
            if (item.evaluationScore.length == 1) {
              item.evaluationScore += '.0';
            }
          }
          else {
            item.evaluationScore = '5.0';
          }
        });
      }
    });
  }

  //查看订单详情
  $scope.orderDetail = function (item) {
    $scope.orderItem = item;
    if ($scope.orderItem.carrier) {
      $scope.getCarrierEvaluation($scope.orderItem.carrier);
      $scope.getDriver($scope.orderItem.carrier);
      $scope.getCarrierOrder($scope.orderItem.carrier);
    }
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

  //取消订单
  $scope.cancelOrder = function (orderId) {
    var confirmPopup = $ionicPopup.confirm({
      title: '取消订单',
      template: '您确定要取消订单吗?',
      buttons: [
        {
          text: '暂不取消', onTap: function (e) {
          return false;
        }
        },
        {
          text: '确定', type: 'button-assertive', onTap: function (e) {
          return true;
        }
        }
      ]
    });
    confirmPopup.then(function (res) {
      if (res) {
        io.socket.post('/order/cancelOrder', {orderId: orderId}, function serverResponded(body, JWR) {
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
            $scope.closeDetail();
          }
        });
      }
    });
  }

  //重新发布订单
  $scope.refreshOrder = function (orderId) {
    if ($scope.orderItem && $scope.orderItem.goods.publishType == '指定发货') {
      var confirmPopup = $ionicPopup.confirm({
        title: '重新发布订单',
        template: '此订单即转化为随机发货订单，是否继续?',
        buttons: [
          {
            text: '暂不发布', onTap: function (e) {
            return false;
          }
          },
          {
            text: '确定', type: 'button-assertive', onTap: function (e) {
            return true;
          }
          }
        ]
      });
      confirmPopup.then(function (res) {
        if (res) {
          io.socket.post('/order/refreshOrder', {orderId: orderId}, function serverResponded(body, JWR) {
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
              $scope.closeDetail();
            }
          });
        }
      });
    }
    else {
      var confirmPopup = $ionicPopup.confirm({
        title: '重新发布订单',
        template: '您确定要重新发布订单吗?',
        buttons: [
          {
            text: '暂不发布', onTap: function (e) {
            return false;
          }
          },
          {
            text: '确定', type: 'button-assertive', onTap: function (e) {
            return true;
          }
          }
        ]
      });
      confirmPopup.then(function (res) {
        if (res) {
          io.socket.post('/order/refreshOrder', {orderId: orderId}, function serverResponded(body, JWR) {
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
              $scope.closeDetail();
            }
          });
        }
      });
    }
  }

  //删除订单
  $scope.deleteOrder = function (orderId) {
    var confirmPopup = $ionicPopup.confirm({
      title: '删除订单',
      template: '您确定要删除订单吗?',
      buttons: [
        {
          text: '取消', onTap: function (e) {
          return false;
        }
        },
        {
          text: '确定', type: 'button-assertive', onTap: function (e) {
          return true;
        }
        }
      ]
    });
    confirmPopup.then(function (res) {
      if (res) {
        io.socket.post('/order/deleteOrder', {orderId: orderId}, function serverResponded(body, JWR) {
          if (JWR.statusCode !== 200) {
            $scope.showMsg('请求失败,网络不给力！');
          }
          else {
            for (var i = 0; i < $scope.orderList.length; i++) {
              if ($scope.orderList[i].goodsOrderId == body.goodsOrderId) {
                if (body.status) {
                  $scope.orderList[i] = body;
                }
                else {
                  $scope.orderList.splice(i, 1);
                  if ($scope.orderItem) {
                    $scope.closeDetail();
                  }
                  $timeout(function () {
                    $scope.flag.showDelete = false;
                  });
                }
              }
            }
            $scope.closeDetail();
          }
        });
      }
    });
  }

  $scope.peisong = function (orderId) {
    $location.url('/tab/index?orderId=' + orderId);
    $scope.closeDetail();
  }

  var fentip = ["很差", "一般", "好", "很好", "非常好"];
  $scope.isPMouseEnter = false;
  $scope.selectPeople = 0;
  $scope.msgPeople = "请给此项打分";

  $scope.evaluateData = {
    orderId: '',
    evaluationLevel: '',
    evaluationContent: ''
  };

  //订单评价
  $scope.orderEvaluate = function (orderId) {
    $scope.evaluateData.orderId = orderId;
    $scope.evaluate.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/order/evaluateOrder.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.evaluate = detail;
  });
  //关闭订单评价
  $scope.closeEvaluate = function () {
    $scope.evaluate.hide();
  };

  $scope.evaluatePeopleClass = function (num) {
    var rtnClass = "";
    if ($scope.isPMouseEnter) {
      if ($scope.selectPeople >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    else {
      if ($scope.evaluateData.evaluationLevel >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    return rtnClass;
  }

  $scope.evaluatePeopleClick = function (num) {
    $scope.evaluateData.evaluationLevel = num;
    $scope.msgPeople = fentip[num - 1];
  }

  $scope.peopleMouseEnter = function (num) {
    $scope.selectPeople = num;
    $scope.isPMouseEnter = true;
    $scope.msgPeople = fentip[num - 1];
  }

  $scope.peopleMouseLeave = function (num) {
    $scope.selectPeople = num;
    $scope.isPMouseEnter = false;
    if ($scope.evaluateData.evaluationLevel > 0) {
      $scope.msgPeople = fentip[$scope.evaluateData.evaluationLevel - 1];
    }
    else {
      $scope.msgPeople = "请给此项打分";
    }
  }

  //评价
  $scope.evaluateSubmit = function () {
    if (!$scope.evaluateData.evaluationLevel) {
      $scope.showMsg("请进行满意度评分");
      return;
    }

    io.socket.post('/order/evaluateOrder', $scope.evaluateData, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        for (var i = 0; i < $scope.orderList.length; i++) {
          if ($scope.orderList[i].goodsOrderId == body.goodsOrderId) {
            if (body.status) {
              $scope.orderList[i] = body;
              $scope.showMsg('感谢您的评价!');
              $scope.closeDetail();
              $scope.closeEvaluate();
            }
          }
        }
      }
    });
  }

  //$scope.doRefresh();
});
