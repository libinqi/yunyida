'use strict';

var app = angular.module('priceMonitorApp');
app.controller('transportPriceCtrl', ['$scope', '$http', 'PriceService', function($scope, $http, PriceService) {
  var vm = this;

  vm.query = {
    page:1,
    rows:100,
    startDate:'',
    endDate:'',
    sort:'asc',
    order:'pubDate'
  };

  //运价指数统计
  $scope.newUserByTimeConfig = {
    forceClear:true,
    title : {
        text: '运价指数统计',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    debug: false,
    showXAxis: true,
    legend:{y:'bottom'},
    showYAxis: true,
    showLegend: true,
    stack: false,
  };

  //运价指数统计
  vm.getTransportPrice = function () {
    vm.query.endDate = vm.curentTime();
    vm.query.startDate = vm.curentTime(1);
    PriceService.getTransportPrice(vm.query).then(function (response) {
      if (response.data.body && response.data.code == "200") {
        vm.data = response.data.body.data;
        var jsonData1 = {
          name:"同比指数",
          datapoints:[]
        };
        var jsonData2 = {
          name:"定基指数",
          datapoints:[]
        };
        var jsonData3 = {
          name:"环比指数",
          datapoints:[]
        };

        angular.forEach(vm.data, function (item, key) {
          var inItem1 = {
            x:item.statisticalTime+'-'+item.statisticalPeriods,
            y:item.chainPriceIndex
          };
          if(inItem1){
            jsonData1.datapoints.push(inItem1);
          }

        });
        angular.forEach(vm.data, function (item, key) {
          var inItem2 = {
            x:item.statisticalTime+'-'+item.statisticalPeriods,
            y:item.freightIndex
          };
          if(inItem2){
            jsonData2.datapoints.push(inItem2);
          }

        });
        angular.forEach(vm.data, function (item, key) {
          var inItem3 = {
            x:item.statisticalTime+'-'+item.statisticalPeriods,
            y:item.linkIndex
          };
          if(inItem3){
            jsonData3.datapoints.push(inItem3);
          }

        });
        // 报表数据填充
          $scope.newUserByTimeData = [jsonData1,jsonData2,jsonData3];

      }
    });
  };

  // 获取系统时间
  vm.curentTime = function(a){
    if(!a){
      var now = new Date();
      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日
      var clock = year + "-";
      if(month < 10) clock += "0";
      clock += month + "-";
      if(day < 10) clock += "0";
      clock += day;
      return(clock);
    }else{
      var now = new Date();
      var year = now.getFullYear()-a;     //年
      var month = now.getMonth() + 2;     //月
      var day = now.getDate();            //日
      var clock = year + "-";
      if(month < 10) clock += "0";
      clock += month + "-";
      if(day < 10) clock += "0";
      clock += day;
      return(clock);
    }

  }
vm.getTransportPrice();

}]);
