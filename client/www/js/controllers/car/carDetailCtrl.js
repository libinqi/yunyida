angular.module('starter.controllers').controller('CarDetailCtrl', function ($scope, $state, $ionicHistory) {
  $scope.backGo = function () {
    $ionicHistory.goBack();
  };
});
