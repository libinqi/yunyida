'use strict';

var app = angular.module('supplyMonitorApp');
app.controller('timeMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    currentTime:'',
    type:'D'
  };
  vm.typechoose = {
    type:'P'
  };

  //实时运力排名
  vm.getCapacityDistributionByPCity = function () {
    vm.typechoose.type = 'P';
    infoMonitorService.getCapacityDistributionByPCity(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        $scope.data = response.data.body;
        $scope.allcar=0;
        for (var i = 0; i < $scope.data.length; i++) {
          $scope.allcar = $scope.allcar + $scope.data[i].count;
        }
        $scope.alltonnage=0;
        for (var i = 0; i < $scope.data.length; i++) {
          $scope.alltonnage = $scope.alltonnage + $scope.data[i].tonnage;
        }
        var jsonDataCity = {
          name:"分布",
          datapoints:[]
        };
        angular.forEach($scope.data, function (item, key) {
          var cityItem = {
            x:item.name,
            y:item.tonnage
          };
          jsonDataCity.datapoints.push(cityItem);

        });
        // 报表数据填充
        if(jsonDataCity.datapoints.length > 0){
          $scope.inData = [jsonDataCity];
        }
      }
    });

  };

  vm.getTotalCapacityByTime = function () {

    infoMonitorService.getTotalCapacityByTime(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;

        var jsonDataTonnage = {
          type:"line",
          name:"运力",
          datapoints:[]
        };



        angular.forEach(data, function (item, key) {
          var tonnageItem = {
            x:item.time,
            y:item.tonnage
          };
          jsonDataTonnage.datapoints.push(tonnageItem);


        });

        // 报表数据填充
        if(jsonDataTonnage.datapoints.length > 0){
          $scope.timeData = [jsonDataTonnage];
        }
      }
    });

  };
  //运力排名：
  $scope.timeConfig = {
    forceClear:true,
    title: '实时运力变化(全省)',
    subtitle: '单位：万吨',
    debug: false,
    showXAxis: true,
    legend:{y:'bottom'},
    showYAxis: true,
    showLegend: true,
    stack: false,
  };

  //实时运力分布
  $scope.inoutConfig = {
    forceClear:true,
    title : {
        text: '实时运力分布',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true
  };


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

  vm.getCapacityDistributionByPCity();
  vm.getTotalCapacityByTime();

}]);
