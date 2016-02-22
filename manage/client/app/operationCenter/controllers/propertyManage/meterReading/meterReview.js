'use strict';

var meterReadingApp = angular.module('opCenterApp');
meterReadingApp.controller('meterReviewCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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

    vm.submitData = {
        id:$scope.meterid
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
        vm.getDoorMRentInfo(queryFMR);
    }

    //查询仪表类型
    vm.getMeterList = function(doorid){
        propertyService.getMeterList(doorid).then(function (response) {
            if(response.data.code == "200"){
                vm.ybzl = response.data.body;
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

    vm.getDoorMRentInfo = function(data){
        propertyService.getDoorMRentInfo(data).then(function (response) {
            if(response.data.code == "200"){
                vm.doorMRentInfo = response.data.body;
                vm.jsondata.customer.enterpriseid = vm.doorMRentInfo.customer.enterpriseid;
                vm.jsondata.customername = vm.doorMRentInfo.customer.contactname;
                vm.jsondata.contactphone = vm.doorMRentInfo.customer.telephonenumber;
            }
        });
    }

    //抄表明细查询
    vm.getmRentInfo = function(){
        propertyService.getmRentInfo($scope.meterid).then(function (response) {
            if(response.data.code == "200"){
                vm.jsondata = response.data.body;
                vm.getMeterList(vm.jsondata.door.id);
            }
        });
    }

    //新增OR修改
    vm.review = function(){
        if($scope.myForm.$valid){
          propertyService.meterReview(vm.submitData).then(function (response) {
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
    vm.getmRentInfo();
}]);