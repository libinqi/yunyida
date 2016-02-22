'use strict';

var app = angular.module('opCenterApp');
app.controller('roomChartDataCtrl', ['$scope', '$http', 'dialog', 'dataCenterService', function ($scope, $http, dialog, dataCenterService) {
    var vm = this;
    vm.datetype = "";

    vm.sumIncomeWithStep = function(){

        dataCenterService.hotelSumIncomeWithStep(vm.queryRoom).then(function (response) {
            if(response.data.code == "200"){
                vm.roomData = response.data.body; 
                vm.fillChart(vm.roomData);
            }
            else{
                vm.roomData = [];
                vm.fillChart(null);
                // dialog.notify(response.data.msg, 'error');
            }
        });
    }

    //年每月
    vm.selectData = function(range,step){
        vm.queryRoom = {
            beginTime : "",
            endTime : "",
            type : "",
            step : ""
        }
        if(range == '2'){
            vm.datetype ="1";
            vm.queryRoom.type = range;
            vm.queryRoom.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '3'){
            vm.datetype = "2";
            vm.queryRoom.type = range;
            vm.queryRoom.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '5'){
            vm.datetype = "3";
            vm.queryRoom.type = range;
            vm.queryRoom.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == ''){
            vm.datetype ="";
            vm.queryRoom.type = "";
            vm.queryRoom.step = "";
            vm.queryRoom.beginTime = vm.dateToyyyyMMdd(vm.startdate);
            vm.queryRoom.endTime = vm.dateToyyyyMMdd(vm.enddate);
            if(vm.queryRoom.beginTime == ""){
                dialog.notify("请选择开始时间!", 'error');
                return false;
            }
            if(vm.queryRoom.endTime == ""){
                dialog.notify("请选择结束时间!", 'error');
                return false;
            }
            var s1 = new Date(vm.queryRoom.beginTime);
            var s2 = new Date(vm.queryRoom.endTime);
            var days = s2.getTime() - s1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24)) +1;
            if(time == 1){
                vm.datetype = "1";
                vm.queryRoom.step = "1";
                vm.sumIncomeWithStep();
            }
            else if(time > 1  && time <= 31){
                vm.datetype = "2";
                vm.queryRoom.step = "2";
                vm.sumIncomeWithStep();
            }
            else if(time > 31){
                vm.datetype = "3";
                vm.queryRoom.step = "3";
                vm.sumIncomeWithStep();
            }
            else if(time <= 0){
                vm.roomData = [];
                vm.fillChart(null);
                dialog.notify("开始时间不能大于结束时间!", 'error');
            }
            
        }
    }

    vm.selectStep = function(step){
        vm.queryRoom.step = step;
        vm.sumIncomeWithStep();
    }

    //填充图形报表
    vm.fillChart = function(roomData){
        var labels = [];
        var data = [];

        $scope.options = { datasetFill:false, responsive:true, scaleLabel : "<%=value%>元"};
        $scope.series = ['收入'];
        $scope.colours = ['#EE4000'];

        if(roomData!=null){
            for(var p in roomData){ 
                labels.push(p);
                data.push(roomData[p]);
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
}]);