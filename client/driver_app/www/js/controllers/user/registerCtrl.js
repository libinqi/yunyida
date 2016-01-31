'use strict';

angular.module('starter.controllers').controller('RegisterCtrl', function ($scope,$ionicHistory) {
  $scope.registerUrl="#/register/register1";
  $scope.enterpriseImage='img/enterprise2.png';
  $scope.driverImage='img/driver.png';

  $scope.selectEnterprise=function(){
    $scope.registerUrl="#/register/register1";
    $scope.enterpriseImage='img/enterprise2.png';
    $scope.driverImage='img/driver.png';
  }

  $scope.selectDriver=function(){
    $scope.registerUrl="#/register/register3";
    $scope.enterpriseImage='img/enterprise.png';
    $scope.driverImage='img/driver2.png';
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };
});
