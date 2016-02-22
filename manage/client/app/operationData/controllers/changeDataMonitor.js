'use strict';

var app = angular.module('platMonitorApp');
app.controller('infoMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
      currentTime:"",
      type:"Y"
  };
  //报表参数配置
  $scope.config = {
    forceClear:true,
    title: '',
    subtitle: '',
    debug: false,
    showXAxis: true,
    legend:{y:'bottom'},
    showYAxis: true,
    showLegend: true,
    stack: false,
  };

  //查询数据列表
  vm.getInfoMonitorData = function () {
    vm.query.currentTime = vm.curentTime();
    infoMonitorService.getInfoMonitorData(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        vm.infoMonitorData = response.data.body;
        var goodsData = {
          name:"货源信息",
          datapoints:[]
        };

        var vehicleData = {
          name:"车源信息",
          datapoints:[]
        };

        var storeData = {
          name:"仓储信息",
          datapoints:[]
        };

        var lineData = {
          name:"专线信息",
          datapoints:[]
        };
        var stationData = {
          name:"场站信息",
          datapoints:[]
        };
        var portData = {
          name:"港口信息",
          datapoints:[]
        };

        //数据分类
        angular.forEach(vm.infoMonitorData.resultList, function (item, key) {
          //货源信息
          var goodsItem = {
              x:item.time,
              y:item.goodsCount
          };
          //车源信息
          var vehicleItem = {
              x:item.time,
              y:item.vehicleCount
          };
          //仓储信息
          var orderItem = {
              x:item.time,
              y:item.storeCount
          };
          //专线
          var lineItem = {
              x:item.time,
              y:item.lineCount
          };
          //场站
          var stationItem = {
              x:item.time,
              y:item.stationCount
          };
          //港口
          var portItem = {
              x:item.time,
              y:item.portCount
          };


          //货
          if(goodsItem){
              goodsData.datapoints.push(goodsItem);
          }
          //车
          if(vehicleItem){
              vehicleData.datapoints.push(vehicleItem);
          }
          //订单
          if(orderItem){
              storeData.datapoints.push(orderItem);
          }
          //用户
          if(lineItem){
              lineData.datapoints.push(lineItem);
          }
          //场站
          if(stationItem){
              stationData.datapoints.push(stationItem);
          }
          //港口
          if(portItem){
              portData.datapoints.push(portItem);
          }
        });
        if(goodsData.datapoints.length > 0 || vehicleData.datapoints.length > 0 || storeData.datapoints.length > 0 || lineItem.datapoints.length > 0 || stationData.datapoints.length >0 || portData.datapoints.length >0){
          // 报表数据填充
          $scope.infoMonitorData = [goodsData, vehicleData, storeData, lineData,stationData,portData];
        }

      }
    });
  };

  //选择查询
  vm.selectData = function(type){
      vm.query.type = type;
      vm.getInfoMonitorData();
  }

  // 获取系统时间
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

  vm.getInfoMonitorData();
}]);
