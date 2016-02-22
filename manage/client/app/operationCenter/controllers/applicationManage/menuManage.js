'use strict';
//应用管理
var applicationManageApp = angular.module('opCenterApp');
applicationManageApp.controller('menuManageCtrl', ['$scope', 'applicationManageService', 'ngDialog', 'dialog', function($scope, applicationManageService, ngDialog, dialog) {
  var vm = this;
  vm.MList = [];

  vm.jsondata = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      query: {
        menuname: '',
        applicationid: '',
        status: '',
        productcode: 'WPT'
      }
    }

    //根据产品编码获取所有应用列表
  vm.getMenuList = function() {
    applicationManageService.allApplication(1,
      1000,
      vm.jsondata.query.productcode).then(function(response) {
      if (response.data.code == "200") {
        vm.MList = response.data.body.data;
      }
    });
  }
  vm.getMenuList();
  //初始加载应用数据
  vm.applicationList = function() {

      applicationManageService.applicationMenu(vm.jsondata.totalItems == 0 ? 1 : vm.jsondata.currentPage,
        vm.jsondata.itemsPerPage,
        vm.jsondata.query.menuname,
        vm.jsondata.query.applicationid,
        vm.jsondata.query.status,
        vm.jsondata.query.productcode).then(function(response) {
        if (response.data.code == "200") {
          vm.menuLists = response.data.body.data;
          vm.jsondata.totalItems = response.data.body.totalRecords;
        }
      });
    }
    //搜索按钮
  vm.queryClick = function() {
    vm.applicationList();
  }

  vm.selectTab = function(flag) {
    vm.jsondata.query.productcode = flag;
    vm.jsondata.query.applicationid = '';
    vm.applicationList();
  }

//新增菜单
  vm.addMenuClick = function () {
      $scope.menuModalTitle = '新增菜单';
      $scope.MList = vm.MList;
      $scope.menuId ='';
      $scope.productcode = vm.jsondata.query.productcode;
      ngDialog.open({
          template: 'app/operationCenter/views/applicationManage/menuAdd.html',
          className: 'ngdialog-theme-default custom-box',
          scope: $scope,
          preCloseCallback: function (data) {
              if(data)
              {
                  vm.applicationList();
              }
          }
      });
  };

  //编辑菜单
    vm.editMenuClick = function (item) {
        $scope.menuModalTitle = '编辑菜单';
        $scope.MList = vm.MList;
        $scope.menuId = item;
        $scope.productcode = vm.jsondata.query.productcode;
        ngDialog.open({
            template: 'app/operationCenter/views/applicationManage/menuAdd.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if(data)
                {
                    vm.applicationList();
                }
            }
        });
    };
//删除菜单
    vm.deleteMneu = function(menuid){
      dialog.confirmDialog('您确定要删除此菜单吗？').then(function (data) {
        if (data) {
          applicationManageService.deleteMneu(menuid).then(function(response) {
          if (response.data.code == "200") {
            dialog.notify('菜单删除成功！', 'success');
            vm.applicationList();
          }else{
            dialog.notify(response.data.msg, 'error');
          }
        });
      }
    });
    }


  //启用停用
  vm.startAndStop = function(item, status) {
    var statusText;
    if (status == 1) {
      item.status = status;
      statusText = '启用' + item.menuname + '成功！';
    } else if (status == 0) {
      item.status = status;
      statusText = '禁用' + item.menuname + '成功！';
    }
    applicationManageService.AddUpdataMenu(item).then(function(response) {
      if (response.data.code == "200") {
        dialog.notify(statusText, 'success');
        vm.applicationList();
      }
    });
  }

  vm.item_ids = [];
  vm.allSelected = false;
  //全选
  vm.selectAllItems = function () {
      if (vm.allSelected) {
          angular.forEach(vm.menuLists, function (item, key) {
              if (vm.item_ids.indexOf(item.menuid) == -1) {
                  vm.item_ids.push(item.menuid);
                  vm.menuLists[key].selected = true;
              }
          });
      }
      else {
          angular.forEach(vm.menuLists, function (item, key) {
              vm.item_ids.splice(vm.item_ids.indexOf(item.menuid), 1);
              vm.menuLists[key].selected = false;
          });
      }
  };
//选择
  vm.selectItem = function (item) {
      if (item.selected) {
          vm.item_ids.push(item.menuid);
      }
      else {
          vm.item_ids.splice(vm.item_ids.indexOf(item.menuid), 1);
      }
      if (vm.item_ids.length == vm.menuLists.length) {
          vm.allSelected = true;
      }
      if (vm.item_ids.length == 0 || vm.item_ids.length != vm.menuLists.length) {
          vm.allSelected = false;
      }
  };
//批量删除
  vm.batchDelClick = function () {
      if (vm.item_ids.length > 0) {
          dialog.confirmDialog('您确定要批量删除选择的菜单吗？').then(function (data) {
              if (data) {
                  applicationManageService.deleteMneu(vm.item_ids.splice(',')).then(function (response) {
                      if (response.data && response.data.code == "200") {
                          dialog.notify('批量删除菜单成功！', 'success');
                          vm.applicationList();
                          vm.allSelected = false;
                      }
                      else {
//                            dialog.notify('批量删除菜单失败，可能是系统异常，请联系系统管理员！', 'error');
                          dialog.notify(response.data.msg, 'error');
                      }
                  });
              }
          });
      }
      else {
          dialog.notify('您没有选择任何菜单！', 'warn');
      }
  };



  $scope.$watch('vm.jsondata.query.productcode', vm.getMenuList);
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  $scope.$watch('vm.jsondata.currentPage + vm.jsondata.itemsPerPage', vm.applicationList);
  vm.applicationList();
}]);
