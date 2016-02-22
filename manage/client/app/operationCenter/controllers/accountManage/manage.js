'use strict';
//账号管理
var accountManageApp = angular.module('opCenterApp');
accountManageApp.controller('accountManageCtrl', ['$scope', 'accountManageService', 'ngDialog', 'dialog', function($scope, accountManageService, ngDialog, dialog) {
  var vm = this;
  vm.jsondata = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    query: {
      username: '',
      realname: '',
      phone: '',
      enterprisename: ''
    }
  }
	//初始加载账号数据
  vm.accountList = function() {
    accountManageService.mplatEnterpriseAccount(vm.jsondata.totalItems == 0 ? 1 : vm.jsondata.currentPage,
      vm.jsondata.itemsPerPage,
      vm.jsondata.query.username,
      vm.jsondata.query.realname,
      vm.jsondata.query.phone,
      vm.jsondata.query.enterprisename).then(function(response) {
      if (response.data.code == "200") {
        vm.accountLists = response.data.body.data;
        vm.jsondata.totalItems = response.data.body.totalRecords;
      }
    });
  }
//搜索按钮
  vm.clickToSearch = function() {
    vm.accountList();
  }


  //编辑账号
  vm.clickToEdit = function(accountmassage) {
    $scope.accountmassage = accountmassage;
    ngDialog.open({
      template: 'app/operationCenter/views/accountManage/editAccount.html',
      className: "ngdialog-theme-default custom-box",
      scope: $scope, //将scope传给test.html,以便显示地址详细信息
      preCloseCallback: function(data) {
        if (data == true) {
          vm.accountList();
          dialog.notify('修改成功！', 'success');
        } else if(data == false) {
          dialog.notify('修改失败', 'error');
        }
      }
    });
  };
  //重置密码
  vm.clickToResetPassword = function(userid) {
    $scope.account = {
			userid:userid,
			newpassword:''
		}
    ngDialog.open({
      template: 'app/operationCenter/views/accountManage/resetPassword.html',
      className: "ngdialog-theme-default custom-box",
      scope: $scope, //将scope传给test.html,以便显示地址详细信息
      preCloseCallback: function(data) {
        if (data == true) {
          vm.accountList();
          dialog.notify('修改成功！', 'success');
        } else if(data == false) {
          dialog.notify('修改失败', 'error');
        }
      }
    });
  };

  // 配置分页基本参数
  $scope.paginationConf = {
    currentPage: 1,
    itemsPerPage: 10,
    //以下实际应用中可注释
    // totalItems:800
  };
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  $scope.$watch('vm.jsondata.currentPage + vm.jsondata.itemsPerPage', vm.accountList);
  vm.accountList();
}]);
