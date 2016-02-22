'use strict';

var app = angular.module('opCenterApp');
app.controller('parkingChartDataCtrl', ['$scope', '$http', 'dialog', 'dataCenterService', function ($scope, $http, dialog, dataCenterService) {
    var vm = this;
    vm.datetype = "";
    // //月每日数据
    // vm.countParkMonthIncome = function(){
    //     vm.queryMonth = vm.dateToyyyyMM($scope.queryMonth);
    //     dataCenterService.countParkMonthIncome(vm.queryMonth).then(function (response) {
    //         if(response.data.code == "200"){
    //             vm.parkData = response.data.body;
    //             vm.fillChart(vm.parkData);
    //         }
    //         else{
    //             vm.parkData = [];
    //             vm.fillChart(null);
    //             // dialog.notify(response.data.msg, 'error');
    //         }
    //     });
    // }

    // //季度
    // vm.countParkQuaterIncome = function(){
    //     vm.queryQuater = vm.dateToYYYY($scope.queryQuater);
    //     dataCenterService.countParkQuaterIncome(vm.queryQuater).then(function (response) {
    //         if(response.data.code == "200"){
    //             vm.parkData = response.data.body;
    //             vm.fillChart(vm.parkData);
    //         }
    //         else{
    //             vm.parkData = [];
    //             vm.fillChart(null);
    //             // dialog.notify(response.data.msg, 'error');
    //         }
    //     });
    // }

    // //年每月
    // vm.countParkYearIncome = function(){
    //     vm.queryYear = vm.dateToYYYY($scope.queryYear);
    //     dataCenterService.countParkYearIncome(vm.queryYear).then(function (response) {
    //         if(response.data.code == "200"){
    //             vm.parkData = response.data.body;
    //             vm.fillChart(vm.parkData);
    //         }
    //         else{
    //             vm.parkData = [];
    //             vm.fillChart(null);
    //             // dialog.notify(response.data.msg, 'error');
    //         }
    //     });
    // }

    vm.sumIncomeWithStep = function(){

        dataCenterService.parkSumIncomeWithStep(vm.queryPark).then(function (response) {
            if(response.data.code == "200"){
                vm.parkData = response.data.body; 
                vm.fillChart(vm.parkData);
            }
            else{
                vm.parkData = [];
                vm.fillChart(null);
                // dialog.notify(response.data.msg, 'error');
            }
        });
    }

    //年每月
    vm.selectData = function(range,step){
        vm.queryPark = {
            beginTime : "",
            endTime : "",
            type : "",
            step : ""
        }
        if(range == '2'){
            vm.datetype ="1";
            vm.queryPark.type = range;
            vm.queryPark.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '3'){
            vm.datetype = "2";
            vm.queryPark.type = range;
            vm.queryPark.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '5'){
            vm.datetype = "3";
            vm.queryPark.type = range;
            vm.queryPark.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == ''){
            vm.datetype ="";
            vm.queryPark.type = "";
            vm.queryPark.step = "";
            vm.queryPark.beginTime = vm.dateToyyyyMMdd(vm.startdate);
            vm.queryPark.endTime = vm.dateToyyyyMMdd(vm.enddate);
            if(vm.queryPark.beginTime == ""){
                dialog.notify("请选择开始时间!", 'error');
                return false;
            }
            if(vm.queryPark.endTime == ""){
                dialog.notify("请选择结束时间!", 'error');
                return false;
            }
            var s1 = new Date(vm.queryPark.beginTime);
            var s2 = new Date(vm.queryPark.endTime);
            var days = s2.getTime() - s1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24)) +1;
            if(time == 1){
                vm.datetype = "1";
                vm.queryPark.step = "1";
                vm.sumIncomeWithStep();
            }
            else if(time > 1  && time <= 31){
                vm.datetype = "2";
                vm.queryPark.step = "2";
                vm.sumIncomeWithStep();
            }
            else if(time > 31){
                vm.datetype = "3";
                vm.queryPark.step = "3";
                vm.sumIncomeWithStep();
            }
            else if(time <= 0){
                vm.parkData = [];
                vm.fillChart(null);
                dialog.notify("开始时间不能大于结束时间!", 'error');
            }
        }
    }

    vm.selectStep = function(step){
        vm.queryPark.step = step;
        vm.sumIncomeWithStep();
    }

    //填充图形报表
    vm.fillChart = function(parkData){
        var labels = [];
        var data = [];

        $scope.options = { datasetFill:false, responsive:true, scaleLabel : "<%=value%>元"};
        $scope.series = ['收入'];
        $scope.colours = ['#EE4000'];
        if(parkData!=null){
            for(var p in parkData){ 
                labels.push(p);
                data.push(parkData[p]);
            }
            
            $scope.labels = labels;
            $scope.data = [data];
        }
        else{
            $scope.labels = [];
            $scope.data = [];
        }
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
            clock += day;
            return(clock); 
        }
        else{
            return "";
        }
    }

    // vm.dateToyyyyMM = function(datetime){
    //     if(datetime!=null){
    //         var now = new Date(datetime);
    //         var year = now.getFullYear();       //年
    //         var month = now.getMonth() + 1;     //月
    //         var clock = year + "-";
    //         if(month < 10) clock += "0";
    //         clock += month;
    //         return(clock); 
    //     }
    //     else{
    //         return "";
    //     }
    // }

    // vm.dateToYYYY = function(datetime){
    //     if(datetime!=null){
    //         var now = new Date(datetime);
    //         var year = now.getFullYear();       //年
    //         var clock = year;
    //         return(clock); 
    //     }
    //     else{
    //         return "";
    //     }
    // }
}]);