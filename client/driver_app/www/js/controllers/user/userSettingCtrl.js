'use strict';

angular.module('starter.controllers').controller('UserSettingCtrl', function ($scope, $state, $http, $ionicHistory, UserInfo) {
  $scope.backGo = function () {
    $ionicHistory.goBack();
  };

  $scope.goTo = function (id) {
    switch (id) {
      case 1:
        $state.go('passwordInfo');
        break;
      case 2:
        $state.go('passwordInfo');
        break;
      case 3:
        $state.go('passwordInfo');
        break;
      default:
        break;
    }
  }

  $scope.exit = function () {
    for (var p in UserInfo.data) {
      UserInfo.remove(p);
    }
    $state.go('login');
  }

});
