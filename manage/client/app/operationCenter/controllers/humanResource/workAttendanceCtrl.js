'use strict';

var humanManageApp = angular.module('opCenterApp');
humanManageApp.controller('workAttendanceCtrl', ['$scope', 'humanServices','ngDialog','auditManageService', function ($scope,humanServices,ngDialog,auditManageService) {
	var vm=this;
	 moment.locale('zh-cn');
	vm.workattList=function(){
		vm.postData={page:$scope.paginationConf.totalItems==0?1:$scope.paginationConf.currentPage,
					 rows:$scope.paginationConf.itemsPerPage,
					 realname:vm.realname,
					 attendanceorg:vm.attendanceorg,
					 startdate:vm.myDate,
					 enddate:vm.myEDate	};
		humanServices.getworkList(vm.postData).then(function(data){
			if (data.status==200) {
			vm.workatts=data.data.body.data;
			$scope.paginationConf.totalItems=data.data.body.totalRecords;
			};
		});
	};
	vm.clickToAdd=function(){
		vm.workattList();
	};
	    //部门列表查询
    vm.getSysDeptList = function(){
        auditManageService.getSysDeptList({"page":1,"rows":999}).then(function (response) {
            if(response.data.code == "200"){
                vm.sysDeptList = response.data.body.data;
            }
        });
    }
	vm.clickToUpdatemodel=function(){
		  ngDialog.open({
		  	className:'ngdialog-theme-default custom-box',
		  	template: 'app/operationCenter/views/auditManage/viewAudit.html' ,
		  	scope:$scope,
		  	preCloseCallback : function(data) {
            if(data != null && data.status=="200"){
             	 vm.workattList();
                alert("添加成功!");
            }
        }});
	};
        // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
      // totalItems:800
    };

    $scope.ResetQuery = function(){
        vm.attendanceorg ="";
        vm.realname ="";
        vm.myDate = "";
        vm.myEDate = "";
        $scope.paginationConf.currentPage = 1;
        $scope.paginationConf.itemsPerPage = 10;
        vm.workattList();
    }

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', vm.workattList);
     vm.getSysDeptList();
	vm.workattList();
}]);