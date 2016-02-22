'use strict';

var app = angular.module('parkMonitorApp');
app.controller('rankingDataCtrl', function($scope,indexRankService) {
  var vm = this;

  vm.query = {
    currentTime:"",
    type:"Y",
    kind:""
  };

  //指标排名 入园车辆
  vm.getParkInCarByTime = function () {
    vm.query.kind="V";
    indexRankService.getParkInfoByTime(vm.query).then(function(response) {
      if (response.data.code == "200") {
        $scope.inOutData = response.data.body;
        for (var i = 0; i < $scope.inOutData.length; i++) {
          $scope.inOutData[i].rank = i+1;
        }
      }
      vm.getParkGoodsByTime();
    });
  };





    vm.getParkGoodsByTime = function () {
      vm.query.kind="GS";
      indexRankService.getParkInfoByTime(vm.query).then(function(response) {
        if (response.data.code == "200") {
          $scope.goodsData = response.data.body;
          for (var i = 0; i < $scope.goodsData.length; i++) {
            $scope.goodsData[i].rank = i+1;
          }
        }
        vm.getParkVehicleByTime();
      });
    }

    vm.getParkVehicleByTime = function () {
      vm.query.kind="VS";
      indexRankService.getParkInfoByTime(vm.query).then(function(response) {
        if (response.data.code == "200") {
          $scope.vehicleData = response.data.body;
          for (var i = 0; i < $scope.vehicleData.length; i++) {
            $scope.vehicleData[i].rank = i+1;
          }
        }
        vm.getParkTimeByTime();
      });
    }

    vm.getParkTimeByTime = function () {
      vm.query.kind="T";
      indexRankService.getParkInfoByTime(vm.query).then(function(response) {
        if (response.data.code == "200") {
          $scope.timeData = response.data.body;
          for (var i = 0; i < $scope.timeData.length; i++) {
            $scope.timeData[i].rank = i+1;
          }
        }
        vm.getParkThroughputByTime();
      });
    }
    vm.getParkThroughputByTime = function () {
      vm.query.kind="TH";
      indexRankService.getParkInfoByTime(vm.query).then(function(response) {
        if (response.data.code == "200") {
          $scope.throughputData = response.data.body;
          for (var i = 0; i < $scope.throughputData.length; i++) {
            $scope.throughputData[i].rank = i+1;
          }
        }
      });
    }



  vm.selectData = function(type){
    if(type){
      vm.query.type = type;
      vm.query.currentTime = vm.curentTime();
    }
    else{
      vm.query.type = "";
      vm.query.currentTime = "";
    }

    vm.getParkInCarByTime();
  }


  vm.curentTime = function(){
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒
    var clock = year + "-";
    if(month < 10) clock += "0";
    clock += month + "-";
    if(day < 10) clock += "0";
    clock += day + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
  }

  vm.query.currentTime = vm.curentTime();
  vm.getParkInCarByTime();

});
