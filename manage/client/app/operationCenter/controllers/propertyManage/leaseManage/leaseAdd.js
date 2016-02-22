'use strict';

var leaseManageApp = angular.module('opCenterApp');
leaseManageApp.controller('leaseAddCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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
        detailList:[]
    }

    vm.queryEnterpriseList = {
        page: 1, 
        rows: 999,
        // status:"1",
        usertype:"3"
    }

    //收费项目OR仪表
    vm.getYBZL = function(){
        propertyService.getDictListByPcodes("YBZL,SFXM").then(function (response) {
          if(response.data.code == "200"){
            vm.ybzl = response.data.body;
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

    //企业、货主用户查询
    vm.getEnterpriseList = function(){
        propertyService.getEnterpriseList(vm.queryEnterpriseList).then(function (response) {
            if(response.data.code == "200"){
                vm.enterpriseList = response.data.body.data;
            }
        });
    }

    // vm.doorplateChange = function(){
    //     // vm.leaseList.door.id
    // }

    vm.chooseDoor = function(){
        if(vm.leaseList.doorarry != null){
            $scope.item_ids = vm.leaseList.doorarry;
            $scope.item_names = vm.leaseList.doornoArry;
        }
        else{
            $scope.item_ids = [];
            $scope.item_names = [];
        }
        
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/leaseManage/chooseDoor.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.ids != null){  
                    vm.leaseList.doorarry = data.ids;
                    vm.leaseList.doornoArry = data.names;
                    vm.leaseList.doornos = data.names.join(",");
                    vm.getServiceMeter(data.ids.join(","));
                }
            }
        });
    }

    //门面收费项目列表查询
    vm.getServiceMeter = function(doorids){
        var queryMeter = {
            doorids : doorids
        }
        propertyService.getServiceMeter(queryMeter).then(function (response) {
            if(response.data.code == "200"){
                vm.leaseList.detailList = response.data.body;
            }
        });
    }

    // //添加空白行
    // vm.addChargesList = function(){
    //     var charges = { servicecode:"",
    //     service:"",
    //     cycle:"",
    //     standard:"",
    //     startdate:"",
    //     degrees:"",
    //     price:"",
    //     unit:"" };
    //     vm.leaseList.detailList.push(charges);
    // }

    // //删除一行数据
    // vm.delChargesList = function(index){
    //     vm.leaseList.detailList.splice(index,1);
    // }

      //新增OR修改
    vm.add = function(){
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
        propertyService.mLeaseAdd(vm.leaseList).then(function (response) {
            if(response.data.code == "200"){
                $scope.closeThisDialog(response.data);
            }
            else{
                dialog.notify(response.data.msg, 'error');
            }
          });
        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.getNowDate = function(){ 
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        // var hh = now.getHours();         //时
        // var mm = now.getMinutes();       //分
        // var ss = now.getSeconds();       //秒
        var clock = year + "-";
        if(month < 10) clock += "0";
        clock += month + "-";
        if(day < 10) clock += "0";
        clock += day;
        // if(hh < 10) clock += "0";
        // clock += hh + ":";
        // if (mm < 10) clock += '0'; 
        // clock += mm + ":"; 
        // if (ss < 10) clock += '0'; 
        // clock += ss; 
        // clock += "00:00:00";
        return clock;
    }

    vm.getLastDate = function(){ 
        var now = new Date();
        var year = now.getFullYear() + 1;   //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        // var hh = now.getHours();         //时
        // var mm = now.getMinutes();       //分
        // var ss = now.getSeconds();       //秒
        var clock = year + "-";
        if(month < 10) clock += "0";
        clock += month + "-";
        if(day < 10) clock += "0";
        clock += day;
        // if(hh < 10) clock += "0";
        // clock += hh + ":";
        // if (mm < 10) clock += '0'; 
        // clock += mm + ":"; 
        // if (ss < 10) clock += '0'; 
        // clock += ss; 
        // clock += "00:00:00";
        return clock; 
    }

    vm.dateToString = function(date){ 
        var now = new Date(date);
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        // var hh = now.getHours();            //时
        // var mm = now.getMinutes();          //分
        // var ss = now.getSeconds();          //秒
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
        clock += "00:00:00";
        return clock; 
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
    vm.signdate = vm.getNowDate();
    vm.startdate = vm.getNowDate();
    vm.enddate = vm.getLastDate();
    vm.getEnterpriseList();
    vm.getDoorplateList();
}]);