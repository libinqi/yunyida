'use strict';

var app = angular.module('platMonitorApp');
app.controller('userMonitorDataCtrl', ['$scope', '$http', 'dialog', 'infoMonitorService', function($scope, $http, dialog, infoMonitorService) {
  var vm = this;

  vm.query = {
    currentTime:"",
    type:"Y",
    beginTime:"",
    endTime:"",
    top:4
  };

  //用户分类数量统计
  $scope.usersByUserTypeConfig = {
    forceClear:true,
    title : {
        text: '用户类型',
        subtext: ''
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal',
        x : 'left',
        y: 'bottom',
        data:[]
    },
    radius : ['40%', '60%'],
    itemStyle: {
        normal: {
            label: { show: false },
            labelLine: { show: false }
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

  //用户分类数量统计
  vm.getUsersByUserType = function () {
    infoMonitorService.getUsersByUserType(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"用户类型",
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
        $scope.usersByUserTypeConfig.legend.data = groupData;
        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.usersByUserTypeData = [jsonData];
        }
      }
    });
  };


  //用户活跃情况统计
  vm.getUserByUserActive = function () {
    infoMonitorService.getUserByUserActive(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        vm.userByUserActiveData = response.data.body;
      }
    });
  };

  //累计用户数
  vm.getUserTotal = function () {
    infoMonitorService.getUserTotal(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        vm.userTotalData = response.data.body;
      }
    });
  };

  //新增用户统计
  $scope.newUserByTimeConfig = {
    forceClear:true,
    title : {
        text: '新增用户统计',
        subtext: ''
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
      show:false
    },
    calculable : true,
  };

  //新增用户统计
  vm.getNewUserByTime = function () {
    infoMonitorService.getNewUserByTime(vm.query).then(function (response) {
      if (response.data && response.data.code == "200") {
        var data = response.data.body;
        var jsonData = {
          name:"新增用户",
          datapoints:[]
        };

        angular.forEach(data, function (item, key) {
          var inItem = {
            x:item.time,
            y:item.count
          };
          jsonData.datapoints.push(inItem);
        });

        // 报表数据填充
        if(jsonData.datapoints.length > 0){
          $scope.newUserByTimeData = [jsonData];
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

    vm.getUsersByUserType();
    vm.getUserByUserActive();
    vm.getUserTotal();
    vm.getNewUserByTime();
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
  vm.getUsersByUserType();
  vm.getUserByUserActive();
  vm.getUserTotal();
  vm.getNewUserByTime();
}]);
