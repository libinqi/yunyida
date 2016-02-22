'use strict';

var app = angular.module('parkMonitorApp');
app.controller('nationalplatformCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    beginTime:"",
    endTime:"",
    step:"2"
  };

  //国家平台资源数据统计图
  $scope.nationDataResourceConfig = {
    forceClear:true,
    title : {
        text: '国家平台资源数据统计',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    legend:{y:'bottom'},
    smooth:true,
    itemStyle: {normal: {areaStyle: {type: 'default'}}},
    calculable : true
  };

  //国家平台资源数据统计图
  vm.getNationDataResource = function () {
    infoMonitorService.getNationDataResource(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var vehicleData = {
          name:"车源",
          datapoints:[]
        };

        var goodsData = {
          name:"货源",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var vehicleItem = {
            x:item.time,
            y:item.vehicleNums
          };
          var goodsItem = {
            x:item.time,
            y:item.goodsNums
          };

          vehicleData.datapoints.push(vehicleItem);
          goodsData.datapoints.push(goodsItem);
        });

        // 报表数据填充
        if(vehicleData.datapoints.length > 0 || goodsData.datapoints.length > 0){
          $scope.nationDataResourceData = [vehicleData,goodsData];
        }
      }
    });
  };

  vm.queryData = function(){
    vm.query.beginTime = vm.dateToyyyyMMdd(vm.startdate);
    vm.query.endTime = vm.dateToyyyyMMdd(vm.enddate);
    if(!vm.query.beginTime){
      dialog.notify('起始时间不能为空！', 'error');
      return;
    }
    if(!vm.query.endTime){
      dialog.notify('结束时间不能为空！', 'error');
      return;
    }
    if(!vm.query.step){
      dialog.notify('统计类型不能为空！', 'error');
      return;
    }
    vm.getNationDataResource();
  }

  vm.ResetQuery = function(){
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    year = year-2;

    var clock = year + "-";
    if(month < 10) clock += "0";
    clock += month + "-";
    if(day < 10) clock += "0";
    clock += day + " ";

    vm.startdate = clock;
    vm.enddate = vm.curentTime();
    vm.query.step = "2";
    vm.queryData();
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
    // if(hh < 10) clock += "0";
    // clock += hh + ":";
    // if (mm < 10) clock += '0';
    // clock += mm + ":";
    // if (ss < 10) clock += '0';
    // clock += ss;
    return(clock);
  }
  vm.ResetQuery();
}]);
