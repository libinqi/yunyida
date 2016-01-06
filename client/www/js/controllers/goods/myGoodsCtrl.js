angular.module('starter.controllers').controller('MyGoodsCtrl', function($scope,$state,loginService,UserInfo,$ionicListDelegate,$timeout,$ionicPopover,$ionicHistory,$http) {
	var user = UserInfo.data;
  $scope.pulltextchange = '下拉刷新';
var vm = this;
	vm.querydata = {
    page: 1,
    rows: 8,
    placeOfDeparture: '',
    destination: '',
    issuerUserId: user.userid,
    order: 'issueDateTime',
    sort: 'DESC'
  // issuerEnterpriseId:user.datasource
  };

  //货源意向
  vm.getGoodsIntentionList = function(item) {
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

  //删除我的货源
  $scope.delGoodsInfo = function(goodsId) {
        loginService.delGoodsInfo(goodsId).then(function(response) {
          if (response.data.code == "200") {
              $scope.showMsg("删除货源成功！");
              $scope.loadMore();
          } else {

          }
        });

  }

  $scope.enter = function(item){
    $state.go('placecarlist',{data:item.goodsId});

  }
  //下单查询货源信息
  $scope.placeOrde = function(goodsIntentionId){
    var querydata = {
      goodsIntentionId:goodsIntentionId      //货源ID
    }
    var flagtab = {
      flagtab:1
    }
    UserInfo.save(querydata);
    UserInfo.save(flagtab);
    $state.go('order.orderstep1');

  }

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

  //下拉刷新
  $scope.doRefresh = function() {
    $scope.items=[];
    vm.querydata.page = 1;
    $scope.load_over = true;
    $scope.loadMore();
    // 停止广播ion-refresher
      $scope.$broadcast('scroll.refreshComplete');
      $scope.pulltextchange = '下拉刷新';

  };
   $scope.pulltext = function() {
    $timeout(function() {
      $scope.pulltextchange = '快速刷新货源';
    })
  };
  //更多
  $scope.items=[];
  $scope.load_over = true;
  $scope.loadMore = function() {

  //这里使用定时器是为了缓存一下加载过程，防止加载过快
  $timeout(function() {
    // vm.querydata.page = 1;
    vm.querydata.status = null;
    loginService.getPendingList(vm.querydata).then(function(response) {
      if (response.data.code == "200") {
        if (vm.querydata.page > response.data.body.totalPage) {
            $scope.load_over = false;
            return;
        }
       $scope.items = $scope.items.concat(response.data.body.data);
        vm.querydata.page++;
        $scope.$broadcast("scroll.infiniteScrollComplete");
        for (var i = 0; i < response.data.body.data.length; i++) {
          vm.getGoodsIntentionList(response.data.body.data[i]);
        }
      }else{

      }
    });
   },200);
  };


})
