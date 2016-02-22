'use strict';

var kapp = angular.module('commonApp');
kapp.controller('historyLeaveCtrl', ['$scope', '$http', 'dialog', 'auditManageService', function ($scope, $http, dialog, auditManageService) {

    var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 3,
        //以下实际应用中可注释
        totalItems:0
    };

    vm.querydata = {
        page: 1, 
        rows: 3,
        deptname:"",
        realname:"",
        startdate:"",
        enddate:"",
        order:"updatetime",
        sort:"DESC",
        datasource:user.datasource
    };

    vm.jsondata = {

    }

    //请假明细查询
    vm.getLeaveAppInfo = function(leaveappid){
        auditManageService.getLeaveAppInfo(leaveappid).then(function (response) {
            if(response.data.code == "200"){
                vm.activeTab = 3;
                vm.jsondata = response.data.body;
            }
        });
    }

        //请假信息查询
    vm.getLeaveAppList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        auditManageService.getLeaveAppList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.leaveAppList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.delteLeaveApp = function (item) {
      dialog.confirmDialog('您确定要删除吗？').then(function (data) {
        if (data) {
            auditManageService.delteLeaveApp(item.id).then(function (response) {
                if(response.data != null && response.data.code=="200"){
                  vm.getLeaveAppList();
                  dialog.notify('删除成功！', 'success');
                }
                else{
                  dialog.notify(response.data.msg, 'error');
                }
            });
        }
      });
    }

    vm.defStartDate = function(){ 
        var now = new Date();
        now = new Date(now.valueOf() + 1*24*60*60*1000);
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
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

    vm.totalDateTime = function(){
        var dtStart = new Date(vm.SDate);
        var dtend = new Date(vm.EDate);
        var date3=dtend.getTime()-dtStart.getTime();  //时间差的毫秒数
        //计算出小时数
        var hours=date3/(3600*1000);
        var rtn = 0;
        rtn = hours / 24
        vm.jsondata.day = rtn.toFixed(1);
    }

        //新增OR修改
    vm.saveOrUpdateLeaveApp = function(){
        //用户ID
        vm.jsondata.userid = user.userid;
        //部门ID
        vm.jsondata.deptid = user.deptid;
        //状态
        vm.jsondata.status = "0";
        vm.jsondata.starttime = vm.dateToString(vm.SDate);
        vm.jsondata.endtime = vm.dateToString(vm.EDate);
        auditManageService.saveOrUpdateLeaveApp(vm.jsondata).then(function (response) {
            if(response.data.code == "200"){
                vm.getLeaveAppList();
                dialog.notify(response.data.msg, 'success');
            }
            else{
                dialog.notify(response.data.msg, 'error');
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
                vm.saveOrUpdateLeaveApp();
            }
        }
        $scope.myForm.submitted = true;
    }

    vm.activeNew = function(){
        vm.activeTab = 1;
        vm.jsondata = {};
        vm.SDate = vm.defStartDate();
        vm.EDate = vm.defEndDate();
        vm.totalDateTime();
        $scope.myForm.submitted = false;
    }

    vm.activeList = function(){
        vm.activeTab = 2;
        vm.getLeaveAppList();
    }

    //取消
    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.qjlx = $scope.dictList["QJLX"];
    vm.getLeaveAppList();
    vm.SDate = vm.defStartDate();
    vm.EDate = vm.defEndDate();
    vm.totalDateTime();

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getLeaveAppList);
    $scope.$watch('vm.SDate', vm.totalDateTime);
    $scope.$watch('vm.EDate', vm.totalDateTime);
    
}]);