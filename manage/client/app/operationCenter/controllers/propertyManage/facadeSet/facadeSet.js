'use strict';

var facadeSetApp = angular.module('opCenterApp');
facadeSetApp.controller('facadeSetCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
	var vm = this;

	// 配置分页基本参数
 	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10,
		//以下实际应用中可注释
		totalItems:0
	};

  	vm.doorplateList = [];
	vm.querydata = {
		page: 1, 
		rows: 10,
		regionid:"",
		fangxingid:""
	};
	//门面查询
	vm.getDoorplateList = function(){
		vm.querydata.page = $scope.paginationConf.currentPage;
        if(vm.querydata.page <= 0){
            vm.querydata.page = 1;
        }
		propertyService.getDoorplateList(vm.querydata).then(function (response) {
			if(response.data.code == "200"){
				vm.doorplateList = response.data.body.data;
				// 变更分页的总数
          		$scope.paginationConf.totalItems = response.data.body.totalRecords;
			}
		});
	}

	vm.search = function(){
		if($scope.paginationConf.currentPage == 1){
			vm.getDoorplateList();
		}
		else{
			$scope.paginationConf.currentPage = 1;
		}
	}

	vm.clickToAdd = function () {
    dialog.open({ 
      template : 'app/operationCenter/views/propertyManage/facadeSet/facadeAdd.html',
      className: 'ngdialog-theme-default custom-box',
      scope : $scope,//将scope传给test.html,以便显示地址详细信息  
      preCloseCallback : function(data) {
        // if(confirm('Are you sure you want to close without saving your changes?')) {
        //   return true;
        // }
        // return false;
        if(data != null && data.code=="200"){
          vm.getDoorplateList();
          dialog.notify('添加成功！', 'success');
        }
      }
    });
  }

  vm.clickToEdit = function (facade) {
    $scope.facade = facade;
    dialog.open({ 
      template : 'app/operationCenter/views/propertyManage/facadeSet/facadeEdit.html',
      className: 'ngdialog-theme-default custom-box',
      scope : $scope,//将scope传给test.html,以便显示地址详细信息  
      preCloseCallback : function(data) {
        // if(confirm('Are you sure you want to close without saving your changes?')) {
        //   return true;
        // }
        // return false;
        if(data != null && data.code=="200"){
          vm.getDoorplateList();
          dialog.notify('编辑成功！', 'success');
        }
      }
    });
  }

  vm.clickToView = function (facade) {
    $scope.facade = facade;
    dialog.open({ 
      template : 'app/operationCenter/views/propertyManage/facadeSet/facadeView.html',
      className: 'ngdialog-theme-default custom-box',
      scope : $scope,//将scope传给test.html,以便显示地址详细信息  
      preCloseCallback : function(data) {
      }
    });
  }

  vm.clickToDelete = function (facade) {
    if(confirm('确认是否要删除[' + facade.doorno + ']?')) {
		propertyService.facadeDelete(facade.id).then(function (response) {
			if(response.data.code == "200"){
				vm.getDoorplateList();
				dialog.notify('删除成功！', 'success');
			}
			else{
				dialog.notify(response.data.msg, 'error');
			}
		});
    }
  }

  	vm.statusToCN = function(status){
		if(status == '0'){
			return "空闲";
		}
		else{
			return "已租赁";
		}
	}

	vm.szqy = $scope.dictList["SZQY"];
  	vm.fx = $scope.dictList["FX"];

	//初始化查询
	// vm.getfeescalelist();
	// 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
	$scope.$watch('paginationConf.currentPage', vm.getDoorplateList);
}]);