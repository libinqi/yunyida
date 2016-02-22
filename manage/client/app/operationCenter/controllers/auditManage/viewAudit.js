'use strict';

var app = angular.module('opCenterApp');
app.controller('viewAuditCtrl', ['$scope', '$http', 'dialog', 'auditManageService', function ($scope, $http, dialog, auditManageService) {

    var vm = this;

    vm.jsondata = {

    }

    //请假明细查询
    vm.getLeaveAppInfo = function(){
        auditManageService.getLeaveAppInfo($scope.leaveappid).then(function (response) {
            if(response.data.code == "200"){
                vm.jsondata = response.data.body;
            }
        });
    }

    vm.defStartDate = function(){ 
        var now = new Date();
        now = new Date(now.valueOf() + 1*24*60*60*1000);
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();        //日
        var clock = year + "-";
        if(month < 10) clock += "0";
        clock += month + "-";
        if(day < 10) clock += "0";
        clock += day + " ";
        clock += "00:00:00"
        return(clock); 
    }

    vm.defEndDate = function(){ 
        var now = new Date();
        now = new Date(now.valueOf() + 1*24*60*60*1000);
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();        //日
        var clock = year + "-";
        if(month < 10) clock += "0";
        clock += month + "-";
        if(day < 10) clock += "0";
        clock += day + " ";
        clock += "23:59:59"; 
        return(clock); 
    }

    vm.dateToString = function(datetime){ 
        var now = new Date(datetime);
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

    //新增OR修改
    vm.saveOrUpdateLeaveApp = function(){
        if($scope.viewState == "1"){
            //用户ID
            vm.jsondata.userid = user.userid;
            //部门ID
            vm.jsondata.deptid = user.deptid;
            //状态
            vm.jsondata.status = "0";
        }
        vm.jsondata.starttime = vm.dateToString(vm.SDate);
        vm.jsondata.endtime = vm.dateToString(vm.EDate);
        auditManageService.saveOrUpdateLeaveApp(vm.jsondata).then(function (response) {
            if(response.data.code == "200"){
              $scope.closeThisDialog(response.data);
            }
        });
    }

    //审核
    vm.auditLeaveApp = function(){
        vm.jsondata.updator = user.userid;
        auditManageService.saveOrUpdateLeaveApp(vm.jsondata).then(function (response) {
            if(response.data.code == "200"){
              $scope.closeThisDialog(response.data);
            }
        });
    }

    //更新
    vm.update = function(){
        if($scope.myForm.$valid){
            var beginDate = vm.dateToString(vm.SDate);
            var endDate = vm.dateToString(vm.EDate)
            var d1 = new Date(beginDate);  
            var d2 = new Date(endDate);  

            if(beginDate != "" && endDate != "" && d1 >= d2) {
                dialog.notify("开始时间不能大于结束时间！", 'error');
            }
            else{
                if($scope.viewState == "0"){
                    //查看
                }
                else if($scope.viewState == "1" || $scope.viewState == "2"){
                    //新增OR修改
                    vm.saveOrUpdateLeaveApp();
                }
                else if($scope.viewState == "3"){
                    //审核
                    vm.auditLeaveApp();
                }
            }
        }
        $scope.myForm.submitted = true;
    }

    //取消
    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.pass = function(){
        //状态
        vm.jsondata.status = "1";
    }

    vm.rejected = function(){
        //状态
        vm.jsondata.status = "2";
    }
    
    if($scope.leaveappid != ""){
        vm.getLeaveAppInfo();
    }
    vm.SDate = vm.defStartDate();
    vm.EDate = vm.defEndDate();

}]);