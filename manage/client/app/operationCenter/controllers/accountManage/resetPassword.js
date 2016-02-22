'use strict';

var accountApp = angular.module('opCenterApp');
accountApp.controller('retPasswordCtrl', ['$scope', 'dialog', 'accountManageService', function($scope, dialog, accountManageService) {
  var vm = this;
  //编辑账号

  //执行编辑操作
  vm.reset = function() {
    if(!$scope.account.password){
      $scope.account.password = '123456';
    }
      accountManageService.resetPwd($scope.account.userid, $scope.account.password)
        .then(function(response) {
          if (response.data.code == "200") {
            $scope.closeThisDialog(true);
          } else {
            dialog.notify(response.data.msg, 'error');
            $scope.closeThisDialog(false);
          };
        });

    }
  //取消编辑
  vm.cancel = function() {
    $scope.closeThisDialog(null);
  };
}]);
