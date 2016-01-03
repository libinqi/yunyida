'use strict';

angular.module('starter.controllers').controller('AllOrderCtrl', function($scope, $http, $timeout, $ionicModal,$ionicLoading, $ionicHistory, $ionicPopover, $state, $stateParams, Userinfo, loginService) {

  var tag =0;
  $scope.isActive = $stateParams.data ? $stateParams.data : 'a';

  $scope.changeTab = function(evt) {
    var elem = evt.currentTarget;
    $scope.isActive = elem.getAttributeNode('data-active').value;
    // $scope.items = [];
    // $scope.page = 1;
    $scope.pendinglist=[];
    $scope.orderlist=[];
    $scope.historyorderlist=[];
    $scope.load_over = true;
    $scope.querydata.page = 1;
    if ($scope.isActive == 'a') {
      tag=2;
      $scope.doRefresh1();
    }
    if ($scope.isActive == 'b') {
      tag=0;
      $scope.doRefresh2();
    }
    if ($scope.isActive == 'c') {
      tag=1;
      $scope.doRefresh2();
    }

  }

  //撤销订单
   $scope.cancelOrder = function (orderId) {
      var params = {
      orderId:orderId
    }
      $http.post(ApiUrl + '/ws/morder/bizOrder/cancelOrder', params)
      .success(function(data) {
        if (data.code==200) {
            $scope.showMsg('撤单成功');
            $scope.doRefresh();
        }
      });
  }

//确认收货
  $scope.confirmPickup = function (orderId) {
    var params = {
      orderId:orderId
    }
      $http.post(ApiUrl + '/ws/morder/bizOrder/confirmPickup', params)
      .success(function(data) {
        if (data.code==200) {
            $scope.showMsg('操作成功');
           $scope.doRefresh();
        }
      });
  }

  //确认签收
  $scope.confirmSign = function (orderId) {
    var params = {
      orderId:orderId
    }
      $http.post(ApiUrl + '/ws/morder/bizOrder/confirmSign', params)
      .success(function(data) {
        if (data.code==200) {
            $scope.showMsg('签收成功');
            $scope.doRefresh();
        }
      });
  }

//评价按钮
  $scope.pingjia = function(orderId){
    $state.go('evaluateorder',{data:orderId});

  }

//详情页面
  $scope.orderdetail =  function(orderId){
    $state.go('orderdetail', {data:orderId});
  }

  $scope.querydata = {
    page: 1,
    rows: 8,
    placeOfDeparture: '',
    destination: '',
    consignorID:Userinfo.data.userid,
    issuerEnterpriseId: Userinfo.data.enterpriseid,
    order: 'issueDateTime',
    sort: 'DESC'
  // issuerEnterpriseId:user.datasource
  };
  // $scope.querydata = {
  //   page: 1,
  //   rows: 10,
  //   consignorID:'',
  //   issuerEnterpriseId:'',
  //   order: 'createTime',
  //   sort: 'DESC'
  // };

  // $scope.querydata.consignorID=Userinfo.data.userid;
  // $scope.querydata.issuerEnterpriseId=Userinfo.data.enterpriseid;

// $ionicLoading.show({
//         template: "加载中..."
//       });
  //下拉刷新
  $scope.doRefresh1 = function() {
    $scope.pendinglist=[];
    $scope.orderlist=[];
    $scope.historyorderlist=[];
    $scope.querydata.page = 1;
    $scope.load_over1 = true;
    $scope.loadMore1();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.pulltext = function() {
    $timeout(function() {
      $scope.pulltextchange = '订单刷新';
    })
  };
  //更多
  $scope.loadMore1 = function() {

    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function() {
    $scope.querydata.status = null;
    $scope.querydata.goodsResStatus = "GYYX,GWYX";
    $scope.querydata.issuerEnterpriseId = Userinfo.data.enterpriseid;

    $http.get(ApiUrl + '/ws/sinfo/bizGoodsInfo/getlist',{ params: $scope.querydata})
      .success(function(data) {
         if ($scope.querydata.page > data.body.totalPage) {
            $scope.load_over1 = false;
            return;
          }

        if (data.body.data) {
            $scope.pendinglist = $scope.pendinglist.concat(data.body.data);
             for (var i = 0; i < data.body.data.length; i++) {
               $scope.getGoodsIntentionList(data.body.data[i]);
             }
            $scope.querydata.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }

        // }
      });


    }, 200);
  };

  //货源意向
  $scope.getGoodsIntentionList = function(item) {
    var goodsIntentionJson = {
      page: 1,
      rows: 999,
      goodsId: ""
    }
    goodsIntentionJson.goodsId = item.goodsId;
    loginService.getGoodsIntentionList(goodsIntentionJson).then(function(response) {
      if (response.data && response.data.code == "200") {
        var length = response.data.body.data.length;
        item.yxList = response.data.body.data[length-1];
        item.yxCount = response.data.body.totalRecords;
        if(item.yxCount!=0){
          item.textname='意向客户';
        }else{
          item.textname='';
        }
      }
    });
  };

  $scope.enter = function(item){
    $state.go('placecarlist',{data:item.goodsId});

  }

  //下拉刷新
  $scope.doRefresh2 = function() {
    $scope.orderlist=[];
    $scope.querydata.page = 1;
    $scope.load_over2 = true;
    $scope.loadMore2();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.pulltext = function() {
    $timeout(function() {
      $scope.pulltextchange = '订单刷新';
    })
  };
  //更多
  $scope.loadMore2 = function() {

    //这里使用定时器是为了缓存一下加载过程，防止加载过快
    $timeout(function() {
    $scope.querydata.status = tag;
    $scope.querydata.goodsResStatus = null;
    $http.get(ApiUrl + '/ws/morder/bizOrder/getlist',{ params: $scope.querydata})
      .success(function(data) {
         if ($scope.querydata.page > data.body.totalPage) {
            $scope.load_over2 = false;
            return;
          }

        if (data.body.data) {
          if(tag==0){
            $scope.orderlist = $scope.orderlist.concat(data.body.data);

          }else if(tag==1){
            $scope.historyorderlist = $scope.historyorderlist.concat(data.body.data);

          }
            $scope.querydata.page++;
            $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });


    }, 200);
  };
  //查看货源详情
  $scope.goodsdetail = function(item){
    $scope.goodsinfo = item;
    $scope.detail.show();

  }
  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/order/mygoodsdetail.html ', {
    scope: $scope
  }).then(function(detail) {
    $scope.detail = detail;
  });
    //返回
  $scope.closedetail = function() {
    $scope.detail.hide();
  };


  $scope.backGo = function() {
    $ionicHistory.goBack();
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

  $scope.doRefresh1();

});
