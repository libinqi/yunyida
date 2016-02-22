'use strict';

var app = angular.module('opCenterApp');
app.controller('leaveAuditListCtrl', ['$scope', '$http', 'dialog', 'auditManageService', function ($scope, $http, dialog, auditManageService) {
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
        rows: 10,
        deptname:"",
        realname:"",
        startdate:"",
        enddate:""
    };

    vm.queryDept ={
        page: 1, 
        rows: 999
    }

    //请假信息查询
    vm.getLeaveAppList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        vm.querydata.startdate = vm.dateToString(vm.SDate);
        vm.querydata.enddate = vm.dateToString(vm.EDate);
        auditManageService.getLeaveAppList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.leaveAppList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    //部门列表查询
    vm.getSysDeptList = function(){
        auditManageService.getSysDeptList(vm.queryDept).then(function (response) {
            if(response.data.code == "200"){
                vm.sysDeptList = response.data.body.data;
            }
        });
    }

    vm.query = function(){
      if($scope.paginationConf.currentPage>1){
        $scope.paginationConf.currentPage = 1;
      }
      vm.getLeaveAppList();
    }

    //查看请假信息
    vm.viewLeaveAppClick = function (leaveappid) {
        $scope.viewState = "0";
        $scope.leaveappid = leaveappid;
        dialog.open({
            template: 'app/operationCenter/views/auditManage/viewAudit.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {

            }
        });
    }

    //添加请假信息
    vm.addLeaveAppClick = function () {
      $scope.viewState = "1";
      $scope.leaveappid = "";
      dialog.open({
          template: 'app/operationCenter/views/auditManage/viewAudit.html',
          className: 'ngdialog-theme-default custom-box',
          scope: $scope,
          preCloseCallback: function (data) {
              if(data != null && data.code=="200"){
                vm.getLeaveAppList();
                dialog.notify('添加成功！', 'success');
              }
          }
      });
    }

    //审核请假信息
    vm.auditLeaveAppClick = function (leaveappid) {
      $scope.viewState = "3";
      $scope.leaveappid = leaveappid;
      dialog.open({
          template: 'app/operationCenter/views/auditManage/auditLeaveApp.html',
          className: 'ngdialog-theme-default custom-box',
          scope: $scope,
          preCloseCallback: function (data) {
              if(data != null && data.code=="200"){
                vm.getLeaveAppList();
                dialog.notify('审核成功！', 'success');
              }
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

    vm.ResetQuery = function(){
      vm.SDate = null;
      vm.EDate = null;
      vm.querydata.deptid = "";
      vm.querydata.realname = "";
      vm.querydata.startdate = "";
      vm.querydata.enddate = "";
      
      $scope.paginationConf.currentPage = 1;
      vm.getLeaveAppList();
    };

    vm.dateToString = function(datetime){
        if(datetime!=null){
            var now = new Date(datetime);
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
            clock += day;
            // if(hh < 10) clock += "0";
            // clock += hh + ":";
            // if (mm < 10) clock += '0'; 
            // clock += mm + ":"; 
            // if (ss < 10) clock += '0'; 
            // clock += ss; 
            return(clock); 
        }
        else{
            return "";
        }
    }

    vm.getSysDeptList();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getLeaveAppList);
}]);