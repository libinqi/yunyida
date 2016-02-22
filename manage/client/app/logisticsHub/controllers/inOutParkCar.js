
var app = angular.module('parkMonitorApp');
app.controller('inOutParkCarController', function($scope,$timeout, inOutParkCarServices) {
	var vm = this;

	//汇总出入园区信息
	vm.getInOutParkInfo = function() {
		inOutParkCarServices.getInOutParkInfo().then(function(response) {
			if (response.data.code == "200") {
				$scope.sumOutCarCount = response.data.body.sumOutCarCount;
				$scope.sumInCarCount = response.data.body.sumInCarCount;
				$scope.sumAbnormalCarCount = response.data.body.sumAbnormalCarCount;
				vm.arrayPark = response.data.body.resultList;
			}
		});
	}
	// 获取出入园车辆信息列表100条
	vm.getAbnormalCarList = function(){
		inOutParkCarServices.getAbnormalCarList(1,100).then(function(response){
			if (response.data.code == "200") {
				vm.abnormalCarList = response.data.body.data;
				for (var i = 0; i < vm.abnormalCarList.length; i++) {
					vm.abnormalCarList[i].entrytime = vm.abnormalCarList[i].entrytime.substr(11);
					if(vm.abnormalCarList[i].outtime){
						vm.abnormalCarList[i].outtime = vm.abnormalCarList[i].outtime.substr(11);
					}
				}
			}
		});
	}

	vm.getInOutParkInfo();
	vm.getAbnormalCarList();

//定时任务一分钟刷新
  vm.getList = function() {
        setInterval(function(){
            $scope.$apply(vm.getInOutParkInfo);
            $scope.$apply(vm.getAbnormalCarList);

       },60000);

   }
   vm.getList();

$scope.showInParkAbnormalCar = false;
$scope.toggleInParkAbnormalCar = function() {
  inOutParkCarServices.getInOutParkAbnormalCar().then(function(response) {
    if (response.data.code == "200") {
      $scope.abnormalCarList = response.data.body;
      for (var i = 0; i < $scope.abnormalCarList.length; i++) {
        $scope.abnormalCarList[i].entrytime = $scope.abnormalCarList[i].entrytime.substr(11);
        if($scope.abnormalCarList[i].outtime){
          $scope.abnormalCarList[i].outtime = $scope.abnormalCarList[i].outtime.substr(11);
        }
      }
    }
    $scope.showInParkAbnormalCar = !$scope.showInParkAbnormalCar;
  });
}


  $scope.showInParkDetail = false;
  // 详情页面
  $scope.toggleInParkDetail = function(id) {
    if(id){
      inOutParkCarServices.getCarDetailById(id).then(function(response) {
        if (response.data.code == "200") {
          $scope.parkCarDetail = response.data.body;
          $scope.parkCarDetail.entrytime = $scope.parkCarDetail.entrytime.substr(11);
          if($scope.parkCarDetail.outtime){
            $scope.parkCarDetail.outtime = $scope.parkCarDetail.outtime.substr(11);
          }
        }
        $scope.showInParkDetail = !$scope.showInParkDetail;
      });
    }else{
      $scope.showInParkDetail = !$scope.showInParkDetail;
    }
  }

	var speed=40;
	var demo=document.getElementById("demo");
	var demo2=document.getElementById("demo2");
	var demo1=document.getElementById("demo1");
	demo2.innerHTML=demo1.innerHTML;
	var oldScrollTop = 0;
	function Marquee(){
		oldScrollTop = demo.scrollTop;
		demo.scrollTop++;
		if(oldScrollTop!= 0 && oldScrollTop == demo.scrollTop)
		  demo.scrollTop =0;
	}
	var MyMar=setInterval(Marquee,speed);
	demo.onmouseover=function() {
		clearInterval(MyMar);
	}
	demo.onmouseout=function() {
		MyMar=setInterval(Marquee,speed);
	}
});
