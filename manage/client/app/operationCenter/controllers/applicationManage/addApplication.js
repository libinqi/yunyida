'use strict';

var applicationApp = angular.module('opCenterApp');
applicationApp.controller('applicationAPCtrl', ['$scope', 'dialog', 'applicationManageService','Upload', function($scope, dialog, applicationManageService,Upload) {
  var vm = this;
  vm.jsondata = {

  }

  //执行新增编辑操作
  vm.updataApplication = function() {
    vm.jsondata.productcode = $scope.productcode;
    applicationManageService.updataApplication(vm.jsondata)
      .then(function(response) {
        if (response.data.code == "200") {
          $scope.closeThisDialog(true);
        } else {
          $scope.closeThisDialog(false);
          dialog.notify(response.data.msg, 'error');
        };
      });

  }

  $scope.upload = function (files,callback) {
      if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
              var file = files[i];
              Upload.upload({
                  url: loc_host + '/ws/system/fastdfs/upload',
                  fields: {'username': $scope.username},
                  file: file
              }).progress(function (evt) {
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //  console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
              }).success(function (data, status, headers, config) {
                  if (status==200) {
                      if(callback)
                      {
                          callback(data.body);
                      }
                      // return data.body;
                  };
                 console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
              });
          }
      }
  };

  $scope.$watch('appicon', function () {
     $scope.upload($scope.appicon,function(data){
           vm.jsondata.appicon=data;
     });
  });

  //取消新增编辑
  vm.cancel = function() {
    $scope.closeThisDialog(null);
  };
}]);
