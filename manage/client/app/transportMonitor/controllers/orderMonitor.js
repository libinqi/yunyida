'use strict';

var app = angular.module('supplyMonitorApp');
app.controller('orderMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    currentTime:"",
    type:"Y",
    beginTime:"",
    endTime:"",
    top:4
  };

  //订单成交数量
  $scope.orderByTimeConfig = {
    forceClear:true,
    radius : ['50%', '80%'],
    title: '订单成交数量',
    subtitle: '',
    debug: false
  };

  //订单成交数量
  vm.getOrderByTime = function () {
    infoMonitorService.getOrderByTime(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonDataCount = {
          // type:"bar",
          name:"订单条数",
          datapoints:[]
        };

        // var jsonDataTonnage = {
        //   // type:"line",
        //   name:"总吨数",
        //   datapoints:[]
        // };

        angular.forEach(data, function (item, key) {
          var countItem = {
            x:item.time,
            y:item.count
          };
          jsonDataCount.datapoints.push(countItem);

          // var tonnageItem = {
          //   x:item.time,
          //   y:item.tonnage
          // };
          // jsonDataTonnage.datapoints.push(tonnageItem);
        });

        if(jsonDataCount.datapoints.length > 0){
          // 报表数据填充
          $scope.orderByTimeData = [jsonDataCount];
        }
      }
    });
  };


  //订单数量统计
  $scope.moneyByPeriodConfig = {
    forceClear:true,
    title : {
        text: '订单数量统计',
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
    radius : ['40%', '60%'],
    itemStyle: {
        normal: {
            label: { show: true },
            labelLine: { show: true }
        },
        emphasis: {
            label: {
                show: true,
                position: 'center',
                textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                }
            }
        }
    },
    calculable : true
  };

  //订单数量统计
  vm.getMoneyByPeriod = function () {
    infoMonitorService.getMoneyByPeriod(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"来源",
          datapoints:[]
        };

        var groupData = [];

        angular.forEach(data, function (item, key) {
          var provinceItem = {
            x:item.name+' '+item.ratio+'%',
            y:item.count
          };
          groupData.push(provinceItem.x);
          jsonData.datapoints.push(provinceItem);
        });
        $scope.moneyByPeriodConfig.legend.data = groupData;
        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.moneyByPeriodData = [jsonData];
        }
      }
    });
  };

  //订单金额统计
  $scope.moneyByTimeConfig = {
    forceClear:true,
    title: '订单金额统计',
    subtitle: '',
    debug: false,
    showXAxis: true,
    legend:{y:'bottom'},
    showYAxis: true,
    showLegend: false,
    stack: false,
  };

  //订单金额统计
  vm.getMoneyByTime = function () {
    infoMonitorService.getMoneyByTime(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"金额",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var outItem = {
            x:item.time,
            y:item.money
          };
          jsonData.datapoints.push(outItem);
        });
        if(jsonData.datapoints.length > 0){
          // 报表数据填充
          $scope.moneyByTimeData = [jsonData];
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

    vm.getOrderByTime();
    vm.getMoneyByPeriod();
    vm.getMoneyByTime();
  }

  vm.ResetQuery = function(){
    vm.query.type = "D";
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
  vm.getOrderByTime();
  vm.getMoneyByPeriod();
  vm.getMoneyByTime();
}]);
