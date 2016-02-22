'use strict';

var facadeSetApp = angular.module('opCenterApp');
facadeSetApp.controller('chooseDoorCtrl', ['$scope', '$http', 'dialog', 'propertyService', function ($scope, $http, dialog, propertyService) {
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
		fangxingid:"",
		status:"0"
	};

	vm.allSelected = false;
	vm.item_ids = [];
	vm.item_names = [];
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
          		vm.checkDefaultItems();
			}
		});
	}

    vm.selectAllItems = function () {
        if (vm.allSelected) {
            angular.forEach(vm.doorplateList, function (item, key) {
                if (vm.item_ids.indexOf(item.id) == -1) {
                    vm.item_ids.push(item.id);
                    vm.item_names.push(item.doorno);
                    vm.doorplateList[key].selected = true;
                }
            });
        }
        else {
            angular.forEach(vm.doorplateList, function (item, key) {
                vm.item_ids.splice(vm.item_ids.indexOf(item.id), 1);
                vm.item_names.splice(vm.item_names.indexOf(item.doorno), 1);
                vm.doorplateList[key].selected = false;
            });
        }
    };

    vm.selectItem = function (item) {
        if (item.selected) {
            vm.item_ids.push(item.id);
            vm.item_names.push(item.doorno);
        }
        else {
            vm.item_ids.splice(vm.item_ids.indexOf(item.id), 1);
            vm.item_names.splice(vm.item_names.indexOf(item.doorno), 1);
        }
        if (vm.item_ids.length == vm.doorplateList.length) {
            vm.allSelected = true;
        }
        if (vm.item_ids.length == 0 || vm.item_ids.length != vm.doorplateList.length) {
            vm.allSelected = false;
        }
    };

    vm.checkDefaultItems = function () {
    	if(vm.item_ids!= null){
    		angular.forEach(vm.doorplateList, function (dpItem, dpKey) {
	        	angular.forEach(vm.item_ids, function (idItem, idKey) {
	        		if(dpItem.id == idItem){
	        			vm.doorplateList[dpKey].selected = true;
	        		}
				});
		    });
    	}
	}

	vm.search = function(){
		$scope.paginationConf.currentPage = 1;
		vm.getDoorplateList();
	}

	vm.btnSure = function(){
		var data = {
			ids:[],
			names:[]
		};
		data.ids = vm.item_ids;
		data.names = vm.item_names;
		$scope.closeThisDialog(data);
	}

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

	vm.statusToCN = function(status){
		if(status == '0'){
			return "空闲";
		}
		else{
			return "已租赁";
		}
	}

	vm.item_ids = $scope.item_ids;
	vm.item_names = $scope.item_names;
  	vm.szqy = $scope.dictList["SZQY"];
  	vm.fx = $scope.dictList["FX"];
	//初始化查询
	// 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
	$scope.$watch('paginationConf.currentPage', vm.getDoorplateList);
}]);