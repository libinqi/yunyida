'use strict';

var app = angular.module('opCenterApp');
app.controller('propertyChartDataCtrl', ['$scope', '$http', 'dialog', 'dataCenterService', function ($scope, $http, dialog, dataCenterService) {
    var vm = this;

	// vm.propertyData =[];
	// vm.query = {
	// 	startDate:"",
	// 	endDate:""
	// };
 //    //每日数据
 //    vm.propertyFeesByDay = function(){
 //        vm.queryFeesByDay = vm.dateToyyyyMMdd($scope.queryFeesByDay);
 //        dataCenterService.propertyFeesByDay(vm.queryFeesByDay).then(function (response) {
 //        	vm.propertyData = [];
 //            if(response.data.code == "200"){
 //                var data = response.data.body;
 //                vm.propertyData.push(data);
 //                vm.fillChart(vm.propertyData);
 //            }
 //            else{
 //                vm.propertyData = [];
 //                vm.fillChart(null);
 //            }
 //        });
 //    }

 //    //每月日收入
 //    vm.propertyPerDayFeesByMonth = function(){
 //        vm.queryPerDayFeesByMonth = vm.dateToyyyyMM($scope.queryPerDayFeesByMonth);
 //        dataCenterService.propertyPerDayFeesByMonth(vm.queryPerDayFeesByMonth).then(function (response) {
 //        	vm.propertyData = [];
 //            if(response.data.code == "200"){
 //                vm.propertyData = response.data.body;
 //                vm.fillChart(vm.propertyData);
 //            }
 //            else{
 //                vm.propertyData = [];
 //                vm.fillChart(null);
 //            }
 //        });
 //    }

 //    //季度收入
 //    vm.propertyQuaterFeesByYear = function(){
 //        vm.queryQuaterFeesByYear = vm.dateToYYYY($scope.queryQuaterFeesByYear);
 //        dataCenterService.propertyQuaterFeesByYear(vm.queryQuaterFeesByYear).then(function (response) {
 //        	vm.propertyData = [];
 //            if(response.data.code == "200"){
 //                vm.propertyData = response.data.body;
 //                vm.fillChart(vm.propertyData);
 //            }
 //            else{
 //                vm.propertyData = [];
 //                vm.fillChart(null);
 //            }
 //        });
 //    }

 //    //季度收入
 //    vm.propertyPerMonthFeesByYear = function(){
 //        vm.queryPerMonthFeesByYear = vm.dateToYYYY($scope.queryPerMonthFeesByYear);
 //        dataCenterService.propertyPerMonthFeesByYear(vm.queryPerMonthFeesByYear).then(function (response) {
 //        	vm.propertyData = [];
 //            if(response.data.code == "200"){
 //                vm.propertyData = response.data.body;
 //                vm.fillChart(vm.propertyData);
 //            }
 //            else{
 //                vm.propertyData = [];
 //                vm.fillChart(null);
 //            }
 //        });
 //    }

 //    //时间段收入
 //    vm.propertyFeesBySEDay = function(){
 //        vm.query.startDate = vm.dateToyyyyMMdd($scope.startDate);
 //        vm.query.endDate = vm.dateToyyyyMMdd($scope.endDate);
 //        dataCenterService.propertyFeesBySEDay(vm.query).then(function (response) {
 //        	vm.propertyData = [];
 //            if(response.data.code == "200"){
 //                var data = response.data.body;
 //                data.daytime = "总额";
 //                vm.propertyData.push(data);
 //                vm.fillChart(vm.propertyData);
 //            }
 //            else{
 //                vm.propertyData = [];
 //                vm.fillChart(null);
 //            }
 //        });
 //    }

    vm.sumIncomeWithStep = function(){

        dataCenterService.propertySumIncomeWithStep(vm.queryProperty).then(function (response) {
            if(response.data.code == "200"){
                vm.propertyData = response.data.body; 
                vm.fillChart(vm.propertyData);
            }
            else{
                vm.propertyData = [];
                vm.fillChart(null);
                // dialog.notify(response.data.msg, 'error');
            }
        });
    }

    //年每月
    vm.selectData = function(range,step){
        vm.queryProperty = {
            beginTime : "",
            endTime : "",
            type : "",
            step : ""
        }
        if(range == '2'){
            vm.datetype ="1";
            vm.queryProperty.type = range;
            vm.queryProperty.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '3'){
            vm.datetype = "2";
            vm.queryProperty.type = range;
            vm.queryProperty.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == '5'){
            vm.datetype = "3";
            vm.queryProperty.type = range;
            vm.queryProperty.step = step;
            vm.sumIncomeWithStep();
        }
        else if(range == ''){
            vm.datetype ="";
            vm.queryProperty.type = "";
            vm.queryProperty.step = "";
            vm.queryProperty.beginTime = vm.dateToyyyyMMdd(vm.startdate);
            vm.queryProperty.endTime = vm.dateToyyyyMMdd(vm.enddate);
            if(vm.queryProperty.beginTime == ""){
                dialog.notify("请选择开始时间!", 'error');
                return false;
            }
            if(vm.queryProperty.endTime == ""){
                dialog.notify("请选择结束时间!", 'error');
                return false;
            }
            var s1 = new Date(vm.queryProperty.beginTime);
            var s2 = new Date(vm.queryProperty.endTime);
            var days = s2.getTime() - s1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24)) +1;
            if(time == 1){
                vm.datetype = "1";
                vm.queryProperty.step = "1";
                vm.sumIncomeWithStep();
            }
            else if(time > 1  && time <= 31){
                vm.datetype = "2";
                vm.queryProperty.step = "2";
                vm.sumIncomeWithStep();
            }
            else if(time > 31){
                vm.datetype = "3";
                vm.queryProperty.step = "3";
                vm.sumIncomeWithStep();
            }
            else if(time <= 0){
                vm.propertyData = [];
                vm.fillChart(null);
                dialog.notify("开始时间不能大于结束时间!", 'error');
            }
            
        }
    }

    vm.selectStep = function(step){
        vm.queryProperty.step = step;
        vm.sumIncomeWithStep();
    }

    //填充图形报表
    vm.fillChart = function(data){
    	var daytime = [];
		var rent = [];
		var wateramt = [];
		var elecamt = [];
		var broadband = [];
		var other = [];

		$scope.options = { datasetFill:false, responsive:true, scaleLabel : "<%=value%>元"};
		$scope.series = ['房租费','水费','电费','宽带费','其他收费'];
        $scope.colours = ['#FF7F24','#FF4040','#A020F0','#8B5A2B','#48D1CC'];

        if(data!=null && data.length > 0){
	        data.forEach(function(item){  
	            daytime.push(item.daytime);
				rent.push(item.rent);
				wateramt.push(item.wateramt);
				elecamt.push(item.elecamt);
				broadband.push(item.broadband);
				other.push(item.other);
	        })
	        $scope.labels = daytime;
	        $scope.data = [rent, wateramt, elecamt, broadband, other];
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

}]);