'use strict';

angular.module("commonApp").directive('myPwdMatch', [function(){
  return {
    restrict: "A",
    require: 'ngModel',
    link: function(scope,element,attrs,ctrl){
      var tageCtrl = scope.$eval(attrs.myPwdMatch);
      tageCtrl.$parsers.push(function(viewValue){
        ctrl.$setValidity('pwdmatch', viewValue == ctrl.$viewValue);
        return viewValue;
      });
      ctrl.$parsers.push(function(viewValue){
        if(viewValue == tageCtrl.$viewValue){
          ctrl.$setValidity('pwdmatch', true);
          return viewValue;
        } else{
          ctrl.$setValidity('pwdmatch', false);
          return undefined;
        }
      });
    }
  };
}]);

var kapp=angular.module('commonApp');

kapp.controller('changePasswordCtrl',['$scope','$http','dialog','userSettingService',function ($scope, $http, dialog, userSettingService) {
  var vm = this;

  vm.roomVisble = false;

  vm.jsondata = {
    userid:user.userid,
    oldpassword:"",
    newpassword:""
  };

  //新增OR修改
  vm.save = function(){
    if($scope.myForm.$valid){
      userSettingService.changePwd(vm.jsondata).then(function (response) {
        if(response.data.code == "200"){
          // $scope.closeThisDialog(response.data);
          dialog.notify("密码修改成功!", 'success');
        }
        else{
          dialog.notify(response.data.msg, 'error');
        }
      });
    }
    $scope.myForm.submitted = true;
  }

  vm.reset = function(){
    vm.jsondata.oldpassword = "";
    vm.jsondata.newpassword = "";
    $scope.rpassword = "";
  }
}]);