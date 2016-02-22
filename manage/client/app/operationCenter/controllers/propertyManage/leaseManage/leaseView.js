'use strict';

var leaseManageApp = angular.module('opCenterApp');
leaseManageApp.controller('leaseViewCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
    var vm = this;

    vm.leaseList = {
        contractno:"",
        customerno:"",
        customername:"",
        deposit:0,
        contactphone:"", 
        signdate:"",
        validitydate:"",
        startdate:"",
        enddate:"",
        status:"0",
        door:{id:""},
        detailList:[{service:{dictid:""},cycle:{dictid:""},standard:{dictid:""},startdate:"",degrees:0,price:0,unit:{dictid:""}}]
    }

    vm.queryEnterpriseList = {
        page: 1, 
        rows: 999,
        // status:"1",
        usertype:"3"
    }

    //查询明细
    vm.getMLeaseInfo = function(){
        propertyService.getMLeaseInfo($scope.leaseid).then(function (response) {
          if(response.data.code == "200"){
            vm.leaseList = response.data.body;
            vm.signdate = vm.leaseList.signdate;
            vm.startdate = vm.leaseList.startdate;
            vm.enddate = vm.leaseList.enddate;
          }
        });
    }

    //企业、货主用户查询
    vm.getEnterpriseList = function(){
        propertyService.getEnterpriseList(vm.queryEnterpriseList).then(function (response) {
            if(response.data.code == "200"){
                vm.enterpriseList = response.data.body.data;
            }
        });
    }

    //收费项目OR仪表
    vm.getYBZL = function(){
        propertyService.getDictListByPcodes("YBZL,SFXM").then(function (response) {
          if(response.data.code == "200"){
            vm.ybzl = response.data.body;
          }
        });
    }

    // //门面租赁信息列表查询
    // vm.getDoorplateList = function(){
    //     propertyService.getDoorplateList(vm.querydata).then(function (response) {
    //         if(response.data.code == "200"){
    //             vm.doorplateList = response.data.body.data;
    //         }
    //     });
    // }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.getYBZL();
    vm.sfzq = $scope.dictList["SFZQ"];
    vm.sfbz = $scope.dictList["SFBZ"];
    vm.sfdw = $scope.dictList["SFDW"];
    // vm.getDoorplateList();
    vm.getEnterpriseList();
    vm.getMLeaseInfo();
}]);