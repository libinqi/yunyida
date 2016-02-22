'use strict';

var accountApp = angular.module('opCenterApp');
accountApp.controller('accountEditCtrl', ['$scope', 'dialog', 'accountManageService', function($scope, dialog, accountManageService) {
  var vm = this;
  //执行编辑操作
  vm.updataAccount = function() {
      accountManageService.updataAccount($scope.accountmassage.userid, $scope.accountmassage.username,
          $scope.accountmassage.enterpriseid, $scope.accountmassage.enterprisename,
          $scope.accountmassage.phone, $scope.accountmassage.realname)
        .then(function(response) {
          if (response.data.code == "200") {
            $scope.closeThisDialog(true);
          } else {
            $scope.closeThisDialog(false);
            dialog.notify(response.data.msg, 'error');
          };
        });

    }
    //取消编辑
  vm.accountCancel = function() {
    $scope.closeThisDialog(null);
  }

  vm.cancel = function() {
    $scope.closeThisDialog(null);
  };
}]);
