'use strict';

angular.module('starter.controllers').controller('AllOrderDetailCtrl', ['$scope', '$stateParams', '$http', 'loginService', '$state', '$ionicPopover', '$timeout', '$ionicHistory', function ($scope, $stateParams, $http, loginService, $state, $ionicPopover, $timeout, $ionicHistory) {

  //运单详情查询
  $scope.getOrderInfo = function () {
    loginService.getOrderInfo($stateParams.data).then(function (response) {
      if (response.data.code == "200") {
        $scope.orderdetail = response.data.body;
      }
    });
  }

  //撤销订单
  $scope.cancelOrder = function (orderId) {
    var params = {
      orderId: orderId
    }
    $http.post(ApiUrl + '/ws/morder/bizOrder/cancelOrder', params)
      .success(function (data) {
        if (data.code == 200) {
          $scope.showMsg('撤单成功');
          $state.go('tab.order');
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
          $state.go('tab.order');
          // $scope.getOrderList(0);
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
          $state.go('tab.order');
          // $scope.getOrderList(0);
        }
      });
  }

  //评价按钮
  $scope.pingjia = function (orderId) {
    $state.go('evaluateorder', {data: orderId});

  }

  $scope.getOrderInfo();

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
    $scope.driverInfo = item;
    var url = $scope.driverInfo.userType == '司机' ? '/driver/' + $scope.driverInfo.userId : '/enterprise/' + $scope.driverInfo.userId;
    io.socket.post(url, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.driverItem = body;
        $scope.showDriverInfo();
      }
    });
  }

}]);
