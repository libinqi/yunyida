'use strict';

var dictAddApp = angular.module('opCenterApp');
dictAddApp.controller('dictAddCtrl', ['$scope', 'dialog', 'systemSettingService', function ($scope, dialog, systemSettingService) {
  var vm = this;
  vm.jsondata={dictcode:'',dictname:'',dictorder:'',pdictcode:'',dictlevel:'',pdictid:'',dictstatusname:'',dictstatus:'1'};
  vm.dictAddCtrl = function(){
  			if ($scope.v!=null) {
			  systemSettingService.GetDictById($scope.v.dictid).then(function(data){
			  	if (data.status==200) {
				  	vm.jsondata.dictid=data.data.body.dictid;
				  	vm.jsondata.dictcode=data.data.body.dictcode;
				  	vm.jsondata.dictname=data.data.body.dictname;
				  	vm.jsondata.dictorder=data.data.body.dictorder;
				  	vm.jsondata.pdictcode=data.data.body.pdictcode;
				  	vm.jsondata.dictlevel=data.data.body.dictlevel;
				  	vm.jsondata.dictstatus=data.data.body.dictstatus;
				  	vm.jsondata.dictstatusname=data.data.body.dictstatusname;
			  	};
			  });
   //          dialog.notify('新增人员成功！', 'success');
   //          dialog.notify(response.data.msg, 'error');
            };
  };
  vm.update=function(){
  		if($scope.myForm.$valid){
			vm.jsondata.pdictid=$scope.pdictid==null?"0":$scope.pdictid;
  			vm.jsondata.dictstatusname=vm.jsondata.dictstatus==1?"有效":"无效";
  			if ($scope.v!=null) {
  			}
			systemSettingService.SaveOrUpdateDict(vm.jsondata).then(function(data){
				if (data.status==200) {
					if (data.data.code==200) {
						 $scope.closeThisDialog(true);
						 dialog.notify('新增/修改字典成功！', 'success');
						}else{
							$scope.closeThisDialog(false);
							dialog.notify(data.data.msg, 'error');
						};
					}else{
						$scope.closeThisDialog(false);
						dialog.notify(data.data.msg, 'error');
					};
			});
  		}
  		$scope.myForm.submitted = true;
  };
  vm.cancel=function(){
  		$scope.closeThisDialog(null);
  };
  vm.dictAddCtrl();
}]);
