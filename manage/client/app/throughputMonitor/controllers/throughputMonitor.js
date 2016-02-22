'use strict';

var app = angular.module('transportMonitorApp');
app.controller('throughputDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    currentTime:"",
    type:"Y",
    beginTime:"",
    endTime:""
  };

//全省货物吞吐量占比
  $scope.topThroughputByCityConfig = {
    forceClear:true,
    title : {
        text: '地市吞吐量占比',
        subtext: ''
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'right',
        data:[]
    },
    // radius : ['40%', '70%'],
    itemStyle : {
        normal : {
            label : {
                show : true
            },
            labelLine : {
                show : true
            }
        },
        emphasis : {
            label : {
                show : true,
                position : 'center',
                textStyle : {
                    fontSize : '20',
                    fontWeight : 'bold'
                }
            }
        }
    },
    calculable : true
  };

  //全省货物吞吐量占比
  vm.getTopThroughputByCity = function () {
    infoMonitorService.getTopThroughputByCity(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"吞吐量",
          datapoints:[]
        };

        var groupData = [];

        angular.forEach(data, function (item, key) {
          var provinceItem = {
            x:item.name,
            y:item.throughput
          };
          groupData.push(provinceItem.x);
          jsonData.datapoints.push(provinceItem);
        });
        $scope.topThroughputByCityConfig.legend.data = groupData;
        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.topThroughputByCityData = [jsonData];
        }
      }
    });
  };

  //全省货物吞吐量统计
  $scope.throughputByTimeConfig = {
    forceClear:true,
    title : {
        text: '吞吐量统计',
        subtext: '单位：万吨'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true
  };

  //货物吞吐量统计
  vm.getThroughputByTime = function () {
    infoMonitorService.getThroughputByTime(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        $scope.allThroughput=0;
        for (var i = 0; i < data.length; i++) {
          $scope.allThroughput = $scope.allThroughput + data[i].throughput;
        }
        var jsonData = {
          name:"吞吐量",
          smooth:true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var inItem = {
            x:item.time,
            y:item.throughput
          };
          jsonData.datapoints.push(inItem);
        });

        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.throughputByTimeData = [jsonData];
        }
      }
    });
  };

  //省内城市排名
  $scope.throughputByCityConfig = {
    forceClear:true,
    title : {
        text: '吞吐量分布',
        subtext: '单位：万吨'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true
  };

  //省内城市排名
  vm.getThroughputByCity = function () {
    infoMonitorService.getThroughputByCity(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"吞吐量",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var inItem = {
            x:item.name,
            y:item.throughput
          };
          jsonData.datapoints.push(inItem);
        });

        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.throughputByCityData = [jsonData];
        }
      }
    });
  };

  vm.selectData = function(type){
    if(type){
      vm.query.type = type;
      vm.query.currentTime = vm.curentTime();
      vm.query.beginTime = "";
      vm.query.endTime = "";
    }
    else{
      vm.query.type = "";
      vm.query.currentTime = "";
      vm.query.beginTime = vm.dateToyyyyMMdd(vm.startdate);
      vm.query.endTime = vm.dateToyyyyMMdd(vm.enddate);
    }

    vm.getTopThroughputByCity();
    vm.getThroughputByTime();
    vm.getThroughputByCity();
  }

  vm.ResetQuery = function(){
    vm.query.type = "Y";
    vm.query.currentTime = vm.curentTime();
    vm.query.beginTime = "";
    vm.query.endTime = "";
    vm.selectData(vm.query.type);
  }

  vm.dateToyyyyMMdd = function(datetime){
    if(datetime){
      var now = new Date(datetime);
      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日
      var clock = year + "-";
      if(month < 10) clock += "0";
      clock += month + "-";
      if(day < 10) clock += "0";
      clock += day;
      return(clock);
    }
    else{
      return "";
    }
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
  vm.getTopThroughputByCity();
  vm.getThroughputByTime();
  vm.getThroughputByCity();
}]);
