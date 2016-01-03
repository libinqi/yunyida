'use strict';

angular.module('starter.controllers').controller('PlaceOrderCtrl', function($scope,$ionicHistory, $http, $timeout, $ionicLoading, $ionicPopover, $state, Userinfo, loginService) {

	$scope.userData = Userinfo.data;
	if($scope.userData.flagtab==1){
		var querydata = {
      		goodsIntentionId:$scope.userData.goodsIntentionId       //货源ID
   		}
		//获取货源信息
		$scope.getOrder=function(){
	  $http.get(ApiUrl + '/ws/morder/bizOrder/getOrderNo', {
        params: querydata
      }).success(function(data) {
        if(data.code == "200"){
        	$scope.orderData = data.body;
        }
      })
	}
	 	$scope.getOrder();
	 	 var flagtab = {
     		 flagtab:2
    	}
	 	Userinfo.save(flagtab);
	 	$scope.userData = Userinfo.data;
	}
	 $scope.backGo = function() {
       $ionicHistory.goBack();
     };

	//下一步
	$scope.stepNext = function() {
		if($scope.orderData.consigneeInfo==undefined || $scope.orderData.consigneeInfo==''){
			$scope.showMsg('请填写收货人');
			return;
		}
		var reg = /^1\d{10}$/;
		if($scope.orderData.consigneeTelephoneNumber==undefined || $scope.orderData.consigneeTelephoneNumber==''){
			$scope.showMsg('请填写收货人联系电话');
			return;
		}else if(!reg.test($scope.orderData.consigneeTelephoneNumber)){
			$scope.showMsg('收货人联系电话格式错误');
			return;
		}

		if($scope.orderData.streetAndNumberOrPOBox==undefined || $scope.orderData.streetAndNumberOrPOBox==''){
			$scope.showMsg('请填写收货地址');
			return;
		}
    	$state.go('order.orderstep2');
 	}

 	//下一步
	$scope.stepNext1 = function() {
		if($scope.orderData.goodsNumber==undefined || $scope.orderData.goodsNumber==''){
			$scope.showMsg('请填写件数');
			return;
		}
		if($scope.orderData.monetaryTotalAmount==undefined || $scope.orderData.monetaryTotalAmount==''){
			$scope.showMsg('请填写货物总值');
			return;
		}
		if($scope.orderData.freightCharges==undefined || $scope.orderData.freightCharges==''){
			$scope.showMsg('请填写运费');
			return;
		}

    // var reg = /^1\d{10}$/;
    	$state.go('order.orderstep3');
 	}

 	//确认
	$scope.addbizOrder = function() {
		$scope.orderData.dataSource = Userinfo.data.datasource;
		 $http.post(ApiUrl + '/ws/morder/bizOrder/save', $scope.orderData).success(function(data) {
        if(data.code == "200"){
        	$scope.showMsg('下单成功');
        	$state.go('tab.index');
        	// $scope.orderData = data.body;
        }
      })

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

})
