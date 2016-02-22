'use strict';

var meterReadingApp = angular.module('opCenterApp');
meterReadingApp.controller('meterAddCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
	var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems:0
    };

    vm.querydata = {
        page: 1, 
        rows: 999,
        status:"1"
    };

    vm.jsondata = {
        door:{id:""},
        customer:{enterpriseid:""},
        customername:"",
        contactphone:"",
        currentread:0,
        currentreaddate:"",
        lastread:0,
        lastreaddate:"",
        tablenumber:0,
        pooltabnumber:0
    }

    vm.doorplateChange = function(){
        var queryFMR ={
            doorno:""
        }
        vm.getMeterList(vm.jsondata.door.id);
        for(var i=0; i< vm.doorplateList.length; i++){
          if(vm.doorplateList[i].id == vm.jsondata.door.id) {
            queryFMR.doorno = vm.doorplateList[i].doorno;
            break;
          }
        }
        propertyService.getDoorMRentInfo(queryFMR).then(function (response) {
            if(response.data.code == "200"){
                vm.doorMRentInfo = response.data.body;
                if(vm.doorMRentInfo != null && vm.doorMRentInfo.customer != null){
                    vm.jsondata.customer.enterpriseid = vm.doorMRentInfo.customer.enterpriseid;
                    vm.jsondata.customername = vm.doorMRentInfo.customer.contactname;
                    vm.jsondata.contactphone = vm.doorMRentInfo.customer.telephonenumber;
                }
                else{
                    vm.jsondata.customer.enterpriseid = "";
                    vm.jsondata.customername = "";
                    vm.jsondata.contactphone = "";
                }
            }
        });
    }

    vm.meterChange = function(){
        vm.jsondata.lastread = 0;
        vm.jsondata.lastreaddate = 0;
        vm.jsondata.currentread = 0;
        vm.jsondata.tablenumber = 0;
        var queryMeter ={
            doorno:"",
            meterid :""
        }
        for(var i=0; i< vm.doorplateList.length; i++){
          if(vm.doorplateList[i].id == vm.jsondata.door.id) {
            queryMeter.doorno = vm.doorplateList[i].doorno;
            break;
          }
        }
        queryMeter.meterid = vm.jsondata.meter.dictid;
        propertyService.getDoorMRentInfo(queryMeter).then(function (response) {
            if(response.data.code == "200"){
                vm.meterMRentInfo = response.data.body;
                if(vm.meterMRentInfo != null){
                    vm.jsondata.lastread = vm.meterMRentInfo.lastread;
                    vm.jsondata.lastreaddate = vm.meterMRentInfo.lastreaddate;
                    vm.jsondata.currentread = vm.jsondata.lastread;
                    vm.jsondata.tablenumber = vm.jsondata.lastread;
                }
            }
        });
    }

    //查询仪表类型
    vm.getMeterList = function(doorid){
        propertyService.getMeterList(doorid).then(function (response) {
            if(response.data.code == "200"){
                vm.ybzl = response.data.body;
                vm.meterChange();
            }
            else{
                vm.ybzl = null;
            }
        });
    }

    //门面租赁信息列表查询
    vm.getDoorplateList = function(){
        propertyService.getDoorplateList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.doorplateList = response.data.body.data;
            }
        });
    }

    //新增OR修改
    vm.add = function(){
        if($scope.myForm.$valid){
          propertyService.meterAdd(vm.jsondata).then(function (response) {
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

    vm.getDoorplateList();
}]);