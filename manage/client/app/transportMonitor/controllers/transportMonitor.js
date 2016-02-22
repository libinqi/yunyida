'use strict';

var app = angular.module('supplyMonitorApp');
app.controller('goodsMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    type:'D'
  };


  //运力统计
  $scope.inoutConfig = {
    forceClear:true,
    title : {
        text: '运力统计',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true,
    theme:'blue'
  };

  //在册运力
  vm.getGoodsByProvince = function () {
    infoMonitorService.getIndexDistribution('C').then(function (response) {
      if (response.data && response.data.code == "200") {
        var data1 = response.data.body.resultList;
        $scope.data1 = response.data.body.total;
        var jsonData1 = {
          name:"在册运力",
          datapoints:[]
        };
        angular.forEach(data1, function (item, key) {
          item.name = (item.name).replace("市","");
          var inItem = {
            x:item.name,
            y:item.count
          };
          jsonData1.datapoints.push(inItem);
        });

        // 报表数据填充
        if(jsonData1.datapoints.length > 0){
          $scope.inData = [jsonData1];
        }

      }
    });

    infoMonitorService.getIndexDistribution('V').then(function (response) {
      if (response.data && response.data.code == "200") {
        var data2 = response.data.body.resultList;
        $scope.data2 = response.data.body.total;
        var jsonData2 = {
          name:"在册车辆",
          datapoints:[]
        };

        angular.forEach(data2, function (item, key) {
          item.name = (item.name).replace("市","");
          var outItem = {
            x:item.name,
            y:item.count
          };
          jsonData2.datapoints.push(outItem);
        });

        // 报表数据填充
        if(jsonData2.datapoints.length > 0){
          $scope.outData = [jsonData2];
        }
        }
      });



  };

  //运力排名：
  $scope.topConfig = {
    forceClear:true,
    title : {
        text: '运力排名',
        subtext: '单位：百分比'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true,
    xAxis : {
      // orient:'right',
      type: 'value'
    },
    yAxis : {
      // orient:'top',
      type : 'category'
    },
    theme:'red'
  };

  //运力排名：
  vm.getOtherIndexDistribution = function () {
    infoMonitorService.getOtherIndexDistribution('C').then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"所占百分比",
          datapoints:[]
        };

        // var countryData = [];
        // vm.topData = [];

        angular.forEach(data, function (item, key) {
          item.name = (item.name).replace("市","");
          var topItem = {
            x:item.name,
            y:item.ratio
          };
          // countryData.push(item.name);
          jsonData.datapoints.push(topItem);
          // topData.push(vm.TopProvinceData);
        });

        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.topData = [jsonData];
        }
        // $scope.topConfig.yAxis[0].data = countryData.join(",");
      }
    });
  };

  //在册车辆
  $scope.outConfig = {
    forceClear:true,
    title : {
        text: '在册车辆',
        subtext: '单位：辆'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true,
    theme:'blue'
  };



  //在册运力
  $scope.inConfig = {
    forceClear:true,
    title : {
        text: '在册运力',
        subtext: '单位：万吨'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true,
    theme:'yellow'
  };




  vm.getGoodsByProvince();
  vm.getOtherIndexDistribution();
  // vm.getGoodsDistributionByPCity();
  // vm.getGoodsDistributionByDCity();
}]);
