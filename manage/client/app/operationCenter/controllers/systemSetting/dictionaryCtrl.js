'use strict';

var dictionaryApp = angular.module('opCenterApp');
dictionaryApp.controller('dictionaryCtrl', ['$scope', 'systemSettingService','ngDialog', function ($scope,systemSettingService,ngDialog) {
	var vm=this;
	$scope.pdictList=[];
	vm.pdictLists=function(){
			systemSettingService.GetDictionaryLists({"page":"1","rows":"999","pdictid":"0"}).then(function(data){
			if (data.status==200) {
				if (data.data.code==200) {
					$scope.pdictList.length=0;
					for (var i = data.data.body.data.length - 1; i >= 0; i--) {
						var pd={dictname:data.data.body.data[i].dictname,dictid:data.data.body.data[i].dictid};
						$scope.pdictList.push(pd);
					};
				};

			};
		});
	};
	vm.dictsList=function(){
		vm.postData={page:$scope.paginationConf.currentPage,
					 rows:$scope.paginationConf.itemsPerPage
					};
					if ($scope.pdictid!=null) {
						systemSettingService.GetDictionaryLists({"pdictid":$scope.pdictid}).then(function(res){
							if (res.status==200) {
								vm.dicts=res.data.body.data;
								$scope.paginationConf.totalItems=res.data.body.totalRecords;
							}
						});
					}else{
						systemSettingService.GetDictionaryLists(vm.postData).then(function(data){
							if (data.status==200) {
							vm.dicts=data.data.body.data;
							$scope.paginationConf.totalItems=data.data.body.totalRecords;
							};
						});
				};
	};

	vm.clickToSearch=function(){
	vm.dictsList();
	}
	vm.clickToDelete=function(rc){
		if(confirm('确认是否要删除[' + rc.dictname + ']?')) {

			systemSettingService.DeleteDictById(rc.dictid).then(function(data){
				if (data.status==200) {
					vm.pdictLists();
					vm.dictsList();
					 dialog.notify('删除成功！', 'success');
				}else{
					dialog.notify(data.data.msg, 'error');
				};
			});
		}
	};
	vm.clickToAdd=function(){
		ngDialog.open({
			template : 'app/operationCenter/views/systemSetting/dictAdd.html',
			className: "ngdialog-theme-default custom-box",
				      scope : $scope,//将scope传给test.html,以便显示地址详细信息
				      preCloseCallback : function(data) {
				        if(data == true){
				        	vm.pdictLists();
				        	vm.dictsList();
				        	//alert("添加成功!");
				        }
				    }
				});
	};
	vm.clickToEdit=function(v){
		$scope.v=v;
		ngDialog.open({
			template : 'app/operationCenter/views/systemSetting/dictAdd.html',
			className: "ngdialog-theme-default custom-box",
				      scope :$scope,//将scope传给test.html,以便显示地址详细信息
				      preCloseCallback : function(data) {
				        if(data == true){
				        	vm.pdictLists();
				        	vm.dictsList();
				        	$scope.v=null;
				        	// dialog.notify('修改成功！', 'success');
				        }else{
				        	$scope.v=null;
				        	// dialog.notify(data.data.msg, 'error');
				        }
				    }
				});
	};
	// vm.clickToUpdatemodel=function(){
	// 	  ngDialog.open({
	// 	  	className:'ngdialog-theme-default custom-box',
	// 	  	template: 'app/operationCenter/views/auditManage/viewAudit.html' ,
	// 	  	scope:$scope,
	// 	  	preCloseCallback : function(data) {
 //            if(data != null && data.status=="200"){
 //             	 vm.workattList();
 //                alert("添加成功!");
 //            }
 //        }});
	// };
        // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
      // totalItems:800
    };
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', vm.dictsList);
    vm.pdictLists();
	vm.dictsList();
}]);
