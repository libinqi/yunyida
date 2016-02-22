'use strict';

var app = angular.module('supplyMonitorApp');
app.controller('vehicleMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    currentTime:"",
    type:"Y",
    beginTime:"",
    endTime:"",
    top:4
  };


  //省内车源与省外车源对比
  $scope.inoutConfig = {
    forceClear:true,
    title : {
        text: '省内外车源信息对比',
        subtext: ''
    },
    legend:{
      orient : 'vertical',
      x : 'right',
      data:[]
    },
    subtitle: '',
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

  //省内车源与省外车源对比
  vm.getVehicleResByProvince = function () {
    infoMonitorService.getVehicleResByProvince(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"来源",
          datapoints:[]
        };

        var countryData = [];

        angular.forEach(data, function (item, key) {
          var provinceItem = {
            x:item.name+' '+item.ratio+'%',
            y:item.count
          };
          countryData.push(provinceItem.x);
          jsonData.datapoints.push(provinceItem);

        });
        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.inoutData = [jsonData];
        }
        $scope.inoutConfig.legend.data = countryData;
      }
    });
  };

  //外地车牌数量统计
  $scope.otherProvinceConfig = {
    forceClear:true,
    title : {
        text: '省外车辆占比',
        subtext: ''
    },
    legend:{
      orient : 'vertical',
      x : 'right',
      data:[]
    },
    subtitle: '',
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

  //外地车牌数量统计
  vm.getVehicleTopByOtherProvince = function () {
    infoMonitorService.getVehicleTopByOtherProvince(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"来源",
          datapoints:[]
        };

        var countryData = [];

        angular.forEach(data, function (item, key) {
          var provinceItem = {
            x:item.name+' '+item.ratio+'%',
            y:item.count
          };
          countryData.push(provinceItem.x);
          jsonData.datapoints.push(provinceItem);

        });
        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.topData = [jsonData];
        }
        $scope.otherProvinceConfig.legend.data = countryData;
      }
    });
  };

  //省内车源排名
  $scope.distributionByPCityConfig = {
    forceClear:true,
    title: '地市发车信息统计',
    subtitle: '',
    debug: false,
    showXAxis: true,
    legend:{y:'bottom'},
    showYAxis: true,
    showLegend: true,
    stack: false,
  };

  //省内车源排名
  vm.getVehicleResDistributionByPCity = function () {
    infoMonitorService.getVehicleResDistributionByPCity(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonDataCount = {
          type:"bar",
          name:"数量",
          datapoints:[]
        };

        var jsonDataTonnage = {
          type:"line",
          name:"载重",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var countItem = {
            x:item.name,
            y:item.count
          };
          jsonDataCount.datapoints.push(countItem);

          var tonnageItem = {
            x:item.name,
            y:item.tonnage
          };
          jsonDataTonnage.datapoints.push(tonnageItem);
        });

        // 报表数据填充
        if(jsonDataCount.datapoints.length > 0 || jsonDataTonnage.datapoints.length > 0){
          $scope.distributionByPCityData = [jsonDataCount,jsonDataTonnage];
        }
      }
    });
  };

  //省内热门城市
  $scope.topByCityConfig = {
    forceClear:true,
    title : {
        text: '省内热门城市',
        subtext: ''
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
    theme:'green'
  };

  //省内热门城市
  vm.getVehicleResTopByCity = function () {
    infoMonitorService.getVehicleResTopByCity(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"来源",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var jsonItem = {
            x:item.name,
            y:item.count
          };
          jsonData.datapoints.push(jsonItem);
        });

        if(jsonData.datapoints.length > 0){
          // 报表数据填充
          $scope.topByCityData = [jsonData];
        }
      }
    });
  };

  //省外热门城市
  $scope.topByOtherProvinceConfig = {
    forceClear:true,
    title : {
        text: '热门目的省份',
        subtext: ''
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
    }
  };

  //省外热门城市
  vm.getVehicleResTopByOtherProvince = function () {
    infoMonitorService.getVehicleResTopByOtherProvince(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"来源",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var jsonItem = {
            x:item.name,
            y:item.count
          };
          jsonData.datapoints.push(jsonItem);
        });

        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.topByOtherProvinceData = [jsonData];
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

    vm.getVehicleResByProvince();
    vm.getVehicleTopByOtherProvince();
    vm.getVehicleResDistributionByPCity();
    // vm.getVehicleResTopByCity();
    vm.getVehicleResTopByOtherProvince();
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
  vm.getVehicleResByProvince();
  vm.getVehicleTopByOtherProvince();
  vm.getVehicleResDistributionByPCity();
  // vm.getVehicleResTopByCity();
  vm.getVehicleResTopByOtherProvince();
}]);
