angular.module('starter.controllers').controller('PlaceCarListCtrl', function($scope,$state,loginService,Userinfo,$ionicModal,$ionicListDelegate,$stateParams,$timeout,$ionicPopover,$ionicHistory,$http) {


  //货源意向
  $scope.getGoodsIntentionList = function() {
    var goodsIntentionJson = {
      page: 1,
      rows: 999,
      goodsId: ""
    }
    goodsIntentionJson.goodsId = $stateParams.data;
    loginService.getGoodsIntentionList(goodsIntentionJson).then(function(response) {
      if (response.data && response.data.code == "200") {
        $scope.items = response.data.body.data;
      }
    });
  };
//查看意向车源详情
  $scope.placecardetail = function(item){
      $scope.carinfo = item;
       $scope.detail.show();
  }

  //触发弹出层事件
  $ionicModal.fromTemplateUrl('templates/car/placecarlistdetail.html ', {
    scope: $scope
  }).then(function(detail) {
    $scope.detail = detail;
  });
    //返回
  $scope.closedetail = function() {
    $scope.detail.hide();
  };




  //下单查询货源信息
  $scope.placeOrde = function(goodsIntentionId){
    var querydata = {
      goodsIntentionId:goodsIntentionId      //货源ID
    }
    var flagtab = {
      flagtab:1
    }
    Userinfo.save(querydata);
    Userinfo.save(flagtab);
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
  $scope.getGoodsIntentionList();

})
