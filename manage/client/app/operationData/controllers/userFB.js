var app = angular.module('platMonitorApp');
app.controller('userFBController', function($scope, indexCenterServices) {
  var vm = this;
vm.query = {
  type:'P'
}

  vm.getIndexDistribution = function() {
    indexCenterServices.getIndexDistribution(vm.query.type).then(function(response) {
      if (response.data.code == "200") {
        vm.datalist = response.data.body.resultList;
        vm.getOtherIndexDistribution();

        if(vm.query.type =='P'){
          $scope.barTitleName = '用户分布';
          $scope.pieTitleName = '分布比例';
          $scope.configMap.dataRange.max = 30;
        }

        //填充地图
        for (var i = 0; i < vm.datalist.length; i++) {
          // for (var j = 0; j < vm.datalist[i].parkList.length; j++) {
          var configData = $scope.configMap.map.data;
            for (var k = 0; k < configData.length; k++) {
              if(vm.datalist[i].name == configData[k].name){
                configData[k].value = vm.datalist[i].ratio;
              }
            }
          // }
        }
//填充柱状图
        vm.barData = {
          name:"分布",
          datapoints:[]
        };

        angular.forEach(vm.datalist, function (item, key) {
          item.name = (item.name).replace("市","");
          var outItem = {
            x:item.name,
            y:item.count
          };
          vm.barData.datapoints.push(outItem);
        });
        //地市资源分析
        $scope.barConfig = {
          title : {
              text: $scope.barTitleName,
              subtext: ''
          },
          tooltip : {
              trigger: 'axis'
          },
          legend: {
            show:false
          },
          width:700,
          height:250,
          calculable : true,
          forceClear : true
        };

        // 报表数据填充
        $scope.barData = [vm.barData];
      }
    });
  }



  vm.getIndexDistribution();

  vm.getOtherIndexDistribution= function() {
    indexCenterServices.getOtherIndexDistribution(vm.query.type).then(function(response) {
      if (response.data) {
        var datalist = response.data.body;
        vm.inoutProvinceData = {
          name:"占比",
          datapoints:[]
        };

        //地市资源占比
        $scope.pieConfig = {
          title : {
              text: $scope.pieTitleName,
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
          calculable : false,
          forceClear : true
        };

        $scope.pieConfig.legend.data = [];
        if(datalist.length > 0){
          angular.forEach(datalist, function (item, key) {
            item.name = (item.name).replace("市","");
            cityItem = {
              x:item.name+' '+item.ratio+'%',
              y:item.count
            };

            vm.inoutProvinceData.datapoints.push(cityItem);

            // $scope.inoutConfig.legend.data = [];
            $scope.pieConfig.legend.data.push(cityItem.x);
          });
          $scope.pieData = [vm.inoutProvinceData];
        }

      }
    });
  }

//地图数据
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
           height:800
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
    toolbox: {
        show : false,
        orient: 'vertical',
        x:'right',
        y:'center',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false}
        }
    },
    legend : {
        x:'right',
        data:['随机数据']
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
      forceClear : true,
      event: {
        type: 'click',
        fn: function(param) {
          // var selectname =
        }
      }
  };




//展示折线图数据
  vm.getParkDetail = function() {
    var date = new Date();
    var currentTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if(!$scope.params){
      return;
    }
    monitorServices.getParkDetail(currentTime, vm.query.type, $scope.params.parkid, $scope.params.parkcode).then(function(response) {
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
        debug: true,
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        stack: false,
        forceClear : true

    };


});
