'use strict';

var app = angular.module('priceMonitorApp');
app.controller('oilPriceCtrl', ['$scope', '$http', 'PriceService', function($scope, $http, PriceService) {
  var vm = this;

  vm.query = 'changsha';

  //油价数据统计
  $scope.newUserByTimeConfig = {
    forceClear:true,
    title : {
        text: '油价数据统计',
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

  //油价数据统计
  vm.getOilPrice = function () {
    PriceService.getOilPrice(vm.query).then(function (response) {
      if (response.data.body && response.data.code == "200") {
        vm.data = response.data.body;
        vm.data.chartCode0 = eval("(" + vm.data.chartCode0 + ")");
        vm.data.chartCode90 = eval("(" + vm.data.chartCode90 + ")");
        vm.data.chartCode93 = eval("(" + vm.data.chartCode93 + ")");
        vm.data.chartCode97 = eval("(" + vm.data.chartCode97 + ")");
        $scope.gas0 = vm.data.gas0;
        $scope.gas90 = vm.data.gas90;
        $scope.gas93 = vm.data.gas93;
        $scope.gas97 = vm.data.gas97;
        var jsonData1 = {
          name:"0号柴油",
          datapoints:[]
        };
        var jsonData2 = {
          name:"90号汽油",
          datapoints:[]
        };

        var jsonData3 = {
          name:"93号汽油",
          datapoints:[]
        };

        var jsonData4 = {
          name:"97号汽油",
          datapoints:[]
        };
        angular.forEach(vm.data.chartCode0, function (item, key) {
          var inItem1 = {
            x:item.d,
            y:item.s
          };
          if(inItem1){
            jsonData1.datapoints.push(inItem1);
          }

        });
        angular.forEach(vm.data.chartCode90, function (item, key) {
          var inItem2 = {
            x:item.d,
            y:item.s
          };
          if(inItem2){
            jsonData2.datapoints.push(inItem2);
          }

        });
        angular.forEach(vm.data.chartCode93, function (item, key) {
          var inItem3 = {
            x:item.d,
            y:item.s
          };
          if(inItem3){
            jsonData3.datapoints.push(inItem3);
          }

        });
        angular.forEach(vm.data.chartCode97, function (item, key) {
          var inItem4 = {
            x:item.d,
            y:item.s
          };
          if(inItem4){
            jsonData4.datapoints.push(inItem4);
          }

        });

        // 报表数据填充
          $scope.newUserByTimeData = [jsonData1,jsonData2,jsonData3,jsonData4];

      }
    });
  };
vm.getOilPrice();

}]);
