angular.module('starter.controllers').controller('GoodsListCtrl', function ($scope, $state, loginService, UserInfo, $ionicListDelegate, $timeout, $ionicPopover, $ionicHistory, $ionicModal, $ionicPopup) {
  if (!UserInfo.data.userId) {
    $state.go('login');
    return;
  }

  window.plugins.jPushPlugin.setTagsWithAlias([UserInfo.data.userId, UserInfo.data.phoneNumber], UserInfo.data.userType);

  $scope.user = UserInfo.data;
  $scope.pulltextchange = '下拉刷新';

  $scope.query = {
    page: 1,
    rows: 8,
    sCity: '',//起始城市
    sCityCode: '',
    eCity: '',//目的城市
    eCityCode: '',
    goodsType: '零担'//货物类型:零担, 整车, 城市配送
  };

  $scope.banner = [
    {img: 'img/banner2.jpg', url: '', title: ''},
    {img: 'img/banner3.jpg', url: '', title: ''}
  ];

  $scope.changeGoodsType = function (type) {
    $scope.query.goodsType = type;
    $scope.doRefresh();
  }

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

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.goodsList = [];
    $scope.query.page = 1;
    $scope.load_over = false;
    $scope.loadMore();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';

  };
  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '快速刷新货源';
    })
  };
  //更多
  $scope.goodsList = [];
  $scope.load_over = true;
  $scope.loadMore = function () {
    //$scope.load_over = false;
    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function () {
      io.socket.get('/goods/list', $scope.query, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          if (body.length > 0) {
            $scope.goodsList = $scope.goodsList.concat(body);
            $scope.query.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = true;
          }
          else {
            $scope.goodsList = $scope.goodsList.concat([]);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.load_over = false;
          }
        }
      });
    }, 200);
  };

  $scope.queryGoods = function () {
    $scope.doRefresh();
  };

  //$timeout(function () {
  //  $scope.loadMore();
  //});

  if ($scope.user.userType == '物流企业') {
    io.socket.get('/enterprise/' + $scope.user.userId, function serverResponded(body, JWR) {
      if (JWR.statusCode == 200) {
        $scope.user.enterprise = body;
      }
    });
  }

  //货物查询
  $scope.goodsQuery = function () {
    $scope.queryModal.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/goodsQuery.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.queryModal = detail;
  });

  //确认货物查询
  $scope.enterQuery = function () {
    $scope.queryModal.hide();
    $scope.queryGoods();
  };

  //重置货物查询
  $scope.resetQuery = function () {
    $scope.query.sCity = '';
    $scope.query.sCityCode = '';
    $scope.query.eCity = '';
    $scope.query.eCityCode = '';
  };

  //关闭货物查询
  $scope.closeQuery = function () {
    $scope.queryModal.hide();
  };


  //查看货物详情
  $scope.goodsDetail = function (item) {
    $scope.goodsItem = item;
    $scope.detail.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/goods/goodsDetail.html ', {
    scope: $scope
  }).then(function (detail) {
    $scope.detail = detail;
  });
  //关闭货物详情
  $scope.closeDetail = function () {
    $scope.detail.hide();
  };

  $scope.addOrder = function (goodsItem) {
    var goodsOrder = goodsItem.goodsOrders[0];
    if ($scope.user.userType == '司机' && goodsItem.goodsType == '零担') {
      $scope.showMsg('司机无法受理零担业务！');
      return false;
    }
    else if ($scope.user.userType == '物流企业'
      && ($scope.user.enterprise && $scope.user.enterprise.businessType.indexOf(goodsItem.goodsType) < 0)) {
      $scope.showMsg('您暂时无法受理' + goodsItem.goodsType + '业务！');
      return false;
    }
    io.socket.get('/order/carrierOrder', {
      orderStatus: '已报价',
      userId: $scope.user.userId,
      page: 1,
      row: 10
    }, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        if (body.length >= 1) {
          var confirmPopup = $ionicPopup.confirm({
            title: '报价提醒',
            template: '您有1个订单未确认接单不能继续报价，是否马上去确认?',
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
              $scope.closeDetail();
              $state.go('tab.order');
            }
          });
        }
        else {
          io.socket.get('/order/carrierOrder', {
            orderStatus: '已接单',
            userId: $scope.user.userId,
            page: 1,
            row: 10
          }, function serverResponded(body, JWR) {
            if (JWR.statusCode !== 200) {
              $scope.showMsg('请求失败,网络不给力！');
            }
            else {
              if (body.length >= 10) {
                var confirmPopup = $ionicPopup.confirm({
                  title: '接单提醒',
                  template: '您已有10个订单未确认承运不能继续接单，是否马上确认承运？',
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
                    $state.go('tab.order');
                  }
                });
              }
              else {
                io.socket.post('/order/addOrder', {
                  orderId: goodsOrder.goodsOrderId,
                  userId: $scope.user.userId
                }, function serverResponded(body, JWR) {
                  if (JWR.statusCode !== 200) {
                    $scope.showMsg('请求失败,网络不给力！');
                  }
                  else {
                    $scope.showMsg('报价成功！');
                    $scope.closeDetail();
                    $state.go('tab.order');
                  }
                });
              }
            }
          });
        }
      }
    });
  };

});
