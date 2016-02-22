'use strict';

var leaseManageApp = angular.module('opCenterApp');
leaseManageApp.controller('leaseManageCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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
        status:""
    };

    //门面租赁信息列表查询
    vm.getMLeaseList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        propertyService.getMLeaseList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.mLeaseList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.querylist = function(){
        if($scope.paginationConf.currentPage == 1){
            vm.getMLeaseList();
        }
        else{
            $scope.paginationConf.currentPage = 1;
        }
    }

    //添加
    vm.addLeaseClick = function () {
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/leaseManage/leaseAdd.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMLeaseList();
                    dialog.notify('添加成功！', 'success');
                }
            }
        });
    }

    //编辑
    vm.editLeaseClick = function (leaseid) {
        $scope.leaseid = leaseid;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/leaseManage/leaseEdit.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMLeaseList();
                    dialog.notify('编辑成功！', 'success');
                }
            }
        });
    }

    //审核
    vm.checkLeaseClick = function (leaseid) {
        $scope.leaseid = leaseid;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/leaseManage/leaseChecking.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMLeaseList();
                    dialog.notify('审核成功！', 'success');
                }
            }
        });
    }

    //查看
    vm.viewLeaseClick = function (leaseid) {
        $scope.leaseid = leaseid;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/leaseManage/leaseView.html',
            className: 'ngdialog-theme-default big-box',
            scope: $scope,
            preCloseCallback: function (data) {
                // if(data != null && data.code=="200"){
                //     vm.getMLeaseList();
                //     alert("审核成功!");
                // }
            }
        });
    }

    vm.clickToDelete = function (mLease) {
        dialog.confirmDialog('确认是否要删除[' + mLease.contractno + ']?').then(function (data) {
        if (data) {
            propertyService.mLeaseDelete(mLease.id).then(function (response) {
                if(response.data.code == "200"){
                    vm.getMLeaseList();
                    dialog.notify('删除成功！', 'success');
                }
                else{
                    dialog.notify(response.data.msg + '', 'error');
                }
            });
        }
      });
    }

    vm.codeToString= function(code){
        if(code=='1'){
            return "执行中";
        }
        else if(code=='2'){
            return "已完成";
        }
        else{
            return "未执行";
        }
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

    vm.szqy = $scope.dictList["SZQY"];
    vm.fx = $scope.dictList["FX"];
    //初始化查询
    // vm.getMLeaseList();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getMLeaseList);
}]);