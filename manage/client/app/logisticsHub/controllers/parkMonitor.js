var app = angular.module('parkMonitorApp');
app.controller('LineChartController', function($scope, monitorServices) {
  var vm = this;
  vm.query={
    type:'P'
  }

    vm.querychoose={
      type:'Y'
    }

  vm.getParkDistribution = function() {
  vm.query.type = 'P';

    monitorServices.getParkDistribution().then(function(response) {
      if (response.data.code == "200") {
        vm.datalist = response.data.body.resultList;
        $scope.total = response.data.body.total;

        for (var i = 0; i < vm.datalist.length; i++) {
          // for (var j = 0; j < vm.datalist[i].parkList.length; j++) {
          var configData = $scope.configMap.map.data;
            for (var k = 0; k < configData.length; k++) {
              if(vm.datalist[i].locationCityName == configData[k].name){
                configData[k].value = vm.datalist[i].parkNumOfCity;
              }
            }
          // }
        }

      }
    });
  }



  var pageload = {
    datapoint: [

    ]
  };
  $scope.mapData = [pageload];

  $scope.configMap = {
    map: {
      mapType: '湖南',
       type: 'map',
       scaleLimit:{min:1,max:1},
       itemStyle:{
           normal:{label:{show:true}},
           emphasis:{label:{show:true}}
       },
       mapLocation: {
           x: 'center',
           y: 'center',
           width:300,
           height:600
       },
       roam: false,
       data:[
           {name: '怀化市',value: 0},
           {name: '永州市',value: 0},
           {name: '邵阳市',value: 0},
           {name: '郴州市',value: 0},
           {name: '常德市',value: 0},
           {name: '湘西土家族苗族自治州',value: 0},
           {name: '衡阳市',value: 0},
           {name: '岳阳市',value: 0},
           {name: '益阳市',value: 0},
           {name: '长沙市',value: 0},
           {name: '株洲市',value: 0},
           {name: '张家界市',value: 0},
           {name: '娄底市',value: 0},
           {name: '湘潭市',value: 0}
       ]

    },


    dataRange: {
        orient: 'bottom',
        x: 'left',
        splitList: [
            {start: 15, label: '高', color: '#ea5e47'},
            {start: 10, end: 15, label: '', color: '#fd7c54'},
            {start: 6, end: 10, label: '', color: '#fcaf43'},
            {start: 2, end: 6, label: '', color: '#fccc50'},
            {end: 2, label: '低', color: '#f6dc75'}
        ]
      },
      event: {
        type: 'click',
        fn: function(param) {
          // var selectname =
        }
      }
  };


  $scope.showParkDetail = false;
  // 详情页面
  $scope.toggleParkDetail = function(item) {
    if(item){
      $scope.params = item;
      vm.getParkDetail();

    }
    $scope.showParkDetail = !$scope.showParkDetail;

  }


//展示折线图数据
  vm.getParkDetail = function() {
    var date = new Date();
    var currentTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if(!$scope.params){
      return;
    }
    monitorServices.getParkDetail(currentTime, vm.querychoose.type, $scope.params.parkid, $scope.params.parkcode).then(function(response) {
      if (response.data.code == "200") {
        $scope.goodsSum = response.data.body.goodsSum;
        $scope.pickingCycleSum = response.data.body.pickingCycleSum;
        $scope.throughSum = response.data.body.throughSum;
        $scope.vehicleInOutSum = response.data.body.vehicleInOutSum;
        $scope.vehicleSum = response.data.body.vehicleSum;
        $scope.parkDetailData  = response.data.body.resultList;

        vm.goodsData = {
          name:"货源",
          datapoints:[]
        };

        vm.vehicleData = {
          name:"车源",
          datapoints:[]
        };

        vm.inOutData = {
          name:"进出园",
          datapoints:[]
        };

        vm.tonnnageData = {
          name:"吞吐量",
          datapoints:[]
        };
        vm.pickData = {
          name:"配送周期",
          datapoints:[]
        };
        //数据分类
        angular.forEach($scope.parkDetailData, function (item, key) {
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
          //车源出入
          var vehicleInOut = {
            x:item.time,
            y:item.vehicleInOutCount
          }
          //吞吐量
          var Tonnnage = {
            x:item.time,
            y:item.vehicleInTonnnage+item.vehicleOutTonnage
          }
          //配货周期
          var pickingTime = {
            x:item.time,
            y:item.pickingCycle
          }

          //货
          if(goodsItem){
              vm.goodsData.datapoints.push(goodsItem);
          }
          //车源
          if(vehicleItem){
              vm.vehicleData.datapoints.push(vehicleItem);
          }
          //车源出入
          if(vehicleInOut){
              vm.inOutData.datapoints.push(vehicleInOut);
          }
          //货
          if(Tonnnage){
              vm.tonnnageData.datapoints.push(Tonnnage);
          }
          //周期
          if(pickingTime){
              vm.pickData.datapoints.push(pickingTime);
          }

        });
        $scope.parkMonitorData = [vm.goodsData, vm.vehicleData, vm.inOutData, vm.tonnnageData,vm.pickData];

      }
    });

  }


    $scope.configLine = {
      title: '',
      subtitle: '',
      debug: false,
      showXAxis: true,
      legend:{y:'bottom'},
      showYAxis: true,
      showLegend: true,
      stack: false,
      width:800,
      height:300,
      forceClear : true

    };

  vm.getParkDistribution();
$scope.$watch('vm.querychoose.type', vm.getParkDetail);


});
