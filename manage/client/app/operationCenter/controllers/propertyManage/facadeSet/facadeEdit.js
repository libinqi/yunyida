'use strict';

app.controller('facadeEditCtrl',['$scope','$http', 'propertyService',function ($scope, $http, propertyService) {
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
    doormeter:[{meter:{dictid:""},isprovide:""}] // 门面仪表
  };

  //门面详细查询
  vm.getDoorplateInfo = function(){
    propertyService.getDoorplateInfo($scope.facade.id).then(function (response) {
      if(response.data.code == "200"){
        vm.jsondata = response.data.body;
      }
    });
  }

  vm.checkedBox = function(isprovide){
    // var sss = this;
    if(isprovide=="1"){
      return "0";
    }
    else{
      return "1";
    }
  }

  //新增OR修改
  vm.edit = function(){
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
    if($scope.myForm.$valid){
      propertyService.facadeEdit(vm.jsondata).then(function (response) {
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

  vm.getDoorplateInfo();
  vm.szqy = $scope.dictList["SZQY"];
  vm.fx = $scope.dictList["FX"];
}]);