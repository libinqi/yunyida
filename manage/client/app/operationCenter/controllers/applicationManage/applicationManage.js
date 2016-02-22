'use strict';
//应用管理
var applicationManageApp = angular.module('opCenterApp');
applicationManageApp.controller('applicationManageCtrl', ['$scope', 'applicationManageService', 'ngDialog', 'dialog', function($scope, applicationManageService, ngDialog, dialog) {
  var vm = this;
  vm.jsondata = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    query: {
      applicationname: '',
      status: '',
      productcode: 'WPT'
    }
  }
	//初始加载应用数据
  vm.applicationList = function() {

    applicationManageService.mplatApplication(vm.jsondata.totalItems == 0 ? 1 : vm.jsondata.currentPage,
      vm.jsondata.itemsPerPage,
      vm.jsondata.query.applicationname,
      vm.jsondata.query.status,
      vm.jsondata.query.productcode).then(function(response) {
      if (response.data.code == "200") {
        vm.applicationLists = response.data.body.data;
        vm.jsondata.totalItems = response.data.body.totalRecords;
      }
    });
  }
  //搜索按钮
  vm.clickToSearch = function() {
    vm.applicationList();
  }

  vm.selectTab = function(flag) {
    vm.jsondata.query.productcode = flag;
    vm.applicationList();
  }

  //新增应用
  vm.addApplication = function(){
    $scope.productcode = vm.jsondata.query.productcode;
    ngDialog.open({
      template: 'app/operationCenter/views/applicationManage/addApplication.html',
      className: "ngdialog-theme-default custom-box",
      scope: $scope, //将scope传给test.html,以便显示地址详细信息
      preCloseCallback: function(data) {
        if (data == true) {
          vm.applicationList();
          dialog.notify('新增应用成功！', 'success');
        } else {

        }
      }
    });
  }

  //编辑应用
  vm.editApplication = function(item){
    $scope.appModalTitle = '编辑应用';
    $scope.app = item;
    ngDialog.open({
      template: 'app/operationCenter/views/applicationManage/editApplication.html',
      className: "ngdialog-theme-default custom-box",
      scope: $scope, //将scope传给test.html,以便显示地址详细信息
      preCloseCallback: function(data) {
        if (data == true) {
          vm.applicationList();
          dialog.notify('编辑应用成功！', 'success');
        } else {

        }
      }
    });
  }

  //启用停用及修改
  vm.updataApplication = function(item,status){
    var statusText;
    if(status == 1){
      item.status = status;
      statusText='启用'+item.applicationname+'成功！';
    }else if (status == 0) {
      item.status = status;
      statusText='禁用'+item.applicationname+'成功！';
    }else {
      statusText='修改'+item.applicationname+'成功！';
    }
    applicationManageService.updataApplication(item).then(function(response) {
    if (response.data.code == "200") {
      dialog.notify(statusText, 'success');
      vm.applicationList();
    }else{
      dialog.notify(response.data.msg, 'error');
    }
  });
  }

  //删除应用
  vm.deleteApplication = function (applicationid){
    dialog.confirmDialog('您确定要删除此应用吗？').then(function (data) {
      if (data) {
        applicationManageService.deleteApplication(applicationid).then(function(response) {
        if (response.data.code == "200") {
          dialog.notify('应用删除成功！', 'success');
          vm.applicationList();
        }else{
          dialog.notify(response.data.msg, 'error');
        }
      });
    }
  });
  }


  // 配置分页基本参数
  $scope.paginationConf = {
    currentPage: 1,
    itemsPerPage: 10,
    //以下实际应用中可注释
    // totalItems:800
  };
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  $scope.$watch('vm.jsondata.currentPage + vm.jsondata.itemsPerPage', vm.applicationList);
  vm.applicationList();
}]);
