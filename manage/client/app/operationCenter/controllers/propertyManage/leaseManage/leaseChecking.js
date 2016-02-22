'use strict';

var leaseManageApp = angular.module('opCenterApp');
leaseManageApp.controller('leaseCheckCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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

    //收费周期
    vm.getSFZQ = function(){
        propertyService.getDictListByParentDictCode("SFZQ").then(function (response) {
            if(response.data.code == "200"){
                vm.sfzq = response.data.body;
            }
        });
    }

    //收费标准
    vm.getSFBZ = function(){
        propertyService.getDictListByParentDictCode("SFBZ").then(function (response) {
            if(response.data.code == "200"){
                vm.sfbz = response.data.body;
            }
        });
    }

    //收费单位
    vm.getSFDW = function(){
        propertyService.getDictListByParentDictCode("SFDW").then(function (response) {
            if(response.data.code == "200"){
                vm.sfdw = response.data.body;
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

    //添加空白行
    vm.addChargesList = function(){
        var charges = { servicecode:"",
        service:"",
        cycle:"",
        standard:"",
        startdate:"",
        degrees:"",
        price:"",
        unit:"" };
        vm.leaseList.detailList.push(charges);
    }

    //删除一行数据
    vm.delChargesList = function(index){
        vm.leaseList.detailList.splice(index,1);
    }

      //新增OR修改
    vm.edit = function(){
        if($scope.myForm.$valid){
            vm.leaseList.signdate = vm.dateToyyyyMMdd(vm.signdate);
            vm.leaseList.startdate = vm.dateToyyyyMMdd(vm.startdate);
            vm.leaseList.enddate = vm.dateToyyyyMMdd(vm.enddate);
            for(var i=0; i< vm.enterpriseList.length; i++){
                if(vm.enterpriseList[i].enterpriseid == vm.leaseList.customer.enterpriseid) {
                    vm.leaseList.customername = vm.enterpriseList[i].contactname;
                    break;
                }
            }
            for(var i=0; i< vm.leaseList.detailList.length; i++){
                vm.leaseList.detailList[i].startdate = vm.dateToyyyyMMdd(vm.leaseList.detailList[i].startdate);
            }
            propertyService.mLeaseCheck($scope.leaseid).then(function (response) {
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

    vm.dateToyyyyMMdd = function(datetime){
        if(datetime!=null){
            var now = new Date(datetime);
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日
            var clock = year + "-";
            if(month < 10) clock += "0";
            clock += month + "-";
            if(day < 10) clock += "0";
            clock += day + " ";
            clock += "00:00:00";
            return(clock); 
        }
        else{
            return "";
        }
    }

    vm.getYBZL();
    vm.sfzq = $scope.dictList["SFZQ"];
    vm.sfbz = $scope.dictList["SFBZ"];
    vm.sfdw = $scope.dictList["SFDW"];
    // vm.getDoorplateList();
    vm.getEnterpriseList();
    vm.getMLeaseInfo();
}]);