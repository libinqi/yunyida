/**
 * Created by libinqi on 2015/6/7.
 */
'use strict';

var meterReadingApp = angular.module('opCenterApp');
meterReadingApp.controller('meterReadingCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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
        type:"0",
        metermonth:""
    };

    //门面租赁信息列表查询
    vm.getMRentList = function(){
        vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
        vm.querydata.metermonth = vm.dateToyyyyMM($scope.metermonth);
        propertyService.getMRentList(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.mRentList = response.data.body.data;
                // 变更分页的总数
                $scope.paginationConf.totalItems = response.data.body.totalRecords;
            }
        });
    }

    vm.query = function(){
        if($scope.paginationConf.currentPage != 1){
            $scope.paginationConf.currentPage = 1;
        }
        else{
            vm.getMRentList();
        }
    }

    //新增
    vm.addMeterClick = function () {
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/meterReading/meterAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMRentList();
                     dialog.notify('添加成功！', 'success');
                }
            }
        });
    };

    //编辑
    vm.editMeterClick = function (meterid) {
        $scope.meterid = meterid;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/meterReading/meterEdit.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMRentList();
                    dialog.notify('编辑成功！', 'success');
                }
            }
        });
    };

    //审核
    vm.reviewMeterClick = function (meterid) {
        $scope.meterid = meterid;
        dialog.open({
            template: 'app/operationCenter/views/propertyManage/meterReading/meterReview.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data != null && data.code=="200"){
                    vm.getMRentList();
                    dialog.notify('审核成功！', 'success');
                }
            }
        });
    };

    //删除
    vm.clickToDelete = function (mRent) {
        dialog.confirmDialog('确认是否要删除[' + mRent.door.doorno + ']?').then(function (data) {
            if (data) {
                propertyService.mRentDelete(mRent.id).then(function (response) {
                    if(response.data.code == "200"){
                        vm.getMRentList();
                        dialog.notify('删除成功！', 'success');
                    }
                    else{
                      dialog.notify(response.data.msg, 'error');
                    }
                });
            }
        });
    }

    vm.stausToCN = function(staus){
        if(staus == "0"){
            return "未审核";
        }
        else{
            return "已审核";
        }
    }

    vm.dateToyyyyMM = function(datetime){
        if(datetime!=null){
            var now = new Date(datetime);
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var clock = year + "-";
            if(month < 10) clock += "0";
            clock += month;
            return(clock); 
        }
        else{
            return "";
        }
    }

    vm.dateToyyyyMM = function(datetime){
        if(datetime!=null){
            var now = new Date(datetime);
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var clock = year + "-";
            if(month < 10) clock += "0";
            clock += month;
            return(clock); 
        }
        else{
            return "";
        }
    }

    vm.dateToString = function(datetime){ 
        if(datetime!=null){
            var now = new Date(datetime);
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日
            var clock = year + "-";
            if(month < 10) clock += "0";
            clock += month + "-";
            if(day < 10) clock += "0";
            clock += day;
            return clock; 
        }
        else{
            return "";
        }
    }

    vm.getMRentList();
    //初始化查询
    // vm.getfeescalelist();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', vm.getMRentList);
}]);