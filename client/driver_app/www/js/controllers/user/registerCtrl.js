'use strict';

angular.module('starter.controllers').controller('RegisterCtrl', function ($scope,$ionicHistory) {
  $scope.registerUrl="#/register/register1";
  $scope.enterpriseImage='img/enterprise2.jpg';
  $scope.driverImage='img/driver.jpg';

  $scope.selectEnterprise=function(){
    $scope.registerUrl="#/register/register1";
    $scope.enterpriseImage='img/enterprise2.jpg';
    $scope.driverImage='img/driver.jpg';
  }

  $scope.selectDriver=function(){
    $scope.registerUrl="#/register/register3";
    $scope.enterpriseImage='img/enterprise.jpg';
    $scope.driverImage='img/driver2.jpg';
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };
});
