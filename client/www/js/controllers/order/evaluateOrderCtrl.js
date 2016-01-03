'use strict';
angular.module('starter.controllers').controller('evaluateOrderCtrl', ['$scope', '$http', '$state', '$stateParams', 'Userinfo', '$ionicHistory', '$ionicPopover', '$timeout', function ($scope, $http, $state, $stateParams, Userinfo, $ionicHistory, $ionicPopover, $timeout) {
  var fentip = ["很差", "一般", "好", "很好", "非常好"];

  $scope.is$scopeouseEnter = false;
  $scope.selectvehicle = 0;
  $scope.confirmvehicle = 0;
  $scope.pingjiatext = '';
  $scope.msgVehicle = "请给此项打分";

  $scope.evaluatevehicleClass = function (num) {

    var rtnClass = "";
    if ($scope.is$scopeouseEnter) {
      if ($scope.selectvehicle >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    else {
      if ($scope.confirmvehicle >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    return rtnClass;
  }

  $scope.evaluatevehicleClick = function (num) {
    $scope.confirmvehicle = num;
    $scope.msgVehicle = fentip[num - 1];
  }

  $scope.vehicleMouseEnter = function (num) {
    $scope.selectvehicle = num;
    $scope.is$scopeouseEnter = true;
    $scope.msgVehicle = fentip[num - 1];
  }

  $scope.vehicleMouseLeave = function (num) {
    $scope.selectvehicle = num;
    $scope.is$scopeouseEnter = false;
    if ($scope.confirmvehicle > 0) {
      $scope.msgVehicle = fentip[$scope.confirmvehicle - 1];
    }
    else {
      $scope.msgVehicle = "请给此项打分";
    }

  }

  $scope.isPMouseEnter = false;
  $scope.selectPeople = 0;
  $scope.confirmPeople = 0;
  $scope.msgPeople = "请给此项打分";

  $scope.evaluatePeopleClass = function (num) {
    var rtnClass = "";
    if ($scope.isPMouseEnter) {
      if ($scope.selectPeople >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    else {
      if ($scope.confirmPeople >= num) {
        rtnClass = "stared";
      }
      else {
        rtnClass = "star";
      }
    }
    return rtnClass;
  }

  $scope.evaluatePeopleClick = function (num) {
    $scope.confirmPeople = num;
    $scope.msgPeople = fentip[num - 1];
  }

  $scope.PeopleMouseEnter = function (num) {
    $scope.selectPeople = num;
    $scope.isPMouseEnter = true;
    $scope.msgPeople = fentip[num - 1];
  }

  $scope.PeopleMouseLeave = function (num) {
    $scope.selectPeople = num;
    $scope.isPMouseEnter = false;
    if ($scope.confirmPeople > 0) {
      $scope.msgPeople = fentip[$scope.confirmPeople - 1];
    }
    else {
      $scope.msgPeople = "请给此项打分";
    }
  }

  //评价
  $scope.evaluateVehicle = function () {
    var jsondata = {
      orderId: $stateParams.data,
      vehicleScore: $scope.confirmvehicle,
      vehicleAttitude: $scope.confirmPeople,
      vehicleEvaluate: $scope.pingjiatext
    };

    if (!jsondata.vehicleScore) {
      $scope.showMsg("请给信息准确评分");
      return;
    }
    if (!jsondata.vehicleAttitude) {
      $scope.showMsg("请给运输速度评分");
      return;
    }

    $http.post(ApiUrl + '/ws/morder/bizOrder/evaluation', jsondata)
      .success(function (data) {
        if (data.code == 200) {
          $scope.showMsg('感谢您的评价');
          $state.go('tab.order');
        }
      });
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };

  $scope.showMsg = function (txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function () {
      $scope.popover.hide();
    }, 1000);
  }
}]);
