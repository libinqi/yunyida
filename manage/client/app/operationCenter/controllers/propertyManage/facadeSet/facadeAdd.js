'use strict';

app.controller('facadeAddCtrl',['$scope','$http', 'propertyService',function ($scope, $http, propertyService) {
  var vm = this;
  vm.activeTab = "1";

  vm.jsondata = {
    doorno:"", // 门面号
    place:"", // 门面位置
    region:{ dictid:"" },// 所在区域
    fangxing:{ dictid:"" },// 房型
    acreage:0,// 面积
    remark:"", // 备注
    status:"0",// 状态（0 空闲 1 已租赁）
    doormeter:[{meter:{dictid:""},isprovide:"0"}] // 门面仪表
  };

  //新增OR修改
  vm.add = function(){
    var mtList = [];
    // vm.jsondata.cartypecode = $scope.cartype.cartypecode;
    for(var i=0; i< vm.szqy.length; i++){
      if(vm.szqy[i].dictid == vm.jsondata.region.dictid) {
        vm.jsondata.region.dictname = vm.szqy[i].dictname;
        break;
      }
    }
    for(var i=0; i< vm.fx.length; i++){
      if(vm.fx[i].dictid == vm.jsondata.fangxing.dictid) {
        vm.jsondata.fangxing.dictname = vm.fx[i].dictname;
        break;
      }
    }
    for(var i=0; i<  vm.ybzl.length; i++){ 
      var mt = { 
        meter:{dictid:"", dictname:""}, 
        isprovide:""
      }
      mt.meter.dictid = vm.ybzl[i].dictid;
      mt.meter.dictname = vm.ybzl[i].dictname;
      mt.isprovide = vm.ybzl[i].isprovide;
      mtList.push(mt);
    }
    vm.jsondata.doormeter = mtList;
    if($scope.myForm.$valid){
      propertyService.facadeAdd(vm.jsondata).then(function (response) {
        if(response.data.code == "200"){
          $scope.closeThisDialog(response.data);
        }
      });
    }
    $scope.myForm.submitted = true;
  }

  vm.cancel = function(){
    $scope.closeThisDialog(null);
  }

  vm.ybzl = $scope.dictList["YBZL"];
  vm.szqy = $scope.dictList["SZQY"];
  vm.fx = $scope.dictList["FX"];
}]);