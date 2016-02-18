angular.module('starter.controllers').controller('GoodsListCtrl', function ($scope, $state, loginService, UserInfo, $ionicListDelegate, $timeout, $ionicPopover, $ionicHistory, $ionicModal,$ionicPopup) {
  $scope.user = UserInfo.data;
  $scope.pulltextchange = '下拉刷新';

  $scope.query = {
    page: 1,
    rows: 8,
    goodsType: '零担'//货物类型:零担, 整车, 城市配送
  };

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
    $scope.load_over = false;
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

  $scope.addOrder = function (goodsOrderId) {
    io.socket.post('/order/carrierOrder', {
      orderStatus: '接单',
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
            title: '接单提醒',
            template: '您有订单未确认不能接单，是否马上去确认?',
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
        else{
          io.socket.post('/order/carrierOrder', {
            orderStatus: '确认接单',
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
                  template: '您有订单未承运不能接单，是否马上去承运?',
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
              else{
                io.socket.post('/order/addOrder', {
                  orderId: goodsOrderId,
                  userId: $scope.user.userId
                }, function serverResponded(body, JWR) {
                  if (JWR.statusCode !== 200) {
                    $scope.showMsg('请求失败,网络不给力！');
                  }
                  else {
                    $scope.showMsg('接单成功！');
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
