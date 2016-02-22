'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditDriverInfoCtrl', ['$scope', '$http', 'dialog', 'infoAuditService','Upload', function ($scope, $http, dialog, infoAuditService,Upload) {
    var vm = this;
    
    $scope.search = {
      startCity: []
    };

    vm.jsondata = {

    }

    //查询司机明细
    vm.getDriverInfo = function(){
      infoAuditService.getDriverInfo($scope.pid).then(function (response) {
        if(response.data.code == "200"){
          vm.jsondata = response.data.body;
        }
      });
    }

    // //新增OR修改
    // vm.update = function(){
    //     if($scope.myForm.$valid){
    //         infoAuditService.addDriverInfo(vm.jsondata).then(function (response) {
    //             if(response.data.code == "200"){
    //                 $scope.closeThisDialog(response.data);
    //             }
    //         });
    //     }
    //     $scope.myForm.submitted = true;
    // }


    //取消
    vm.cancel = function(){
      $scope.closeThisDialog(null);
    }

    //上传图片至文件服务器
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
    }

    //头像
    $scope.$watch('files', function () {
       $scope.upload($scope.files,function(data){
             vm.jsondata.image=data;
       });
    });
    
    //身份证号
    $scope.$watch('useridsnurl', function () {
      $scope.upload($scope.useridsnurl,function(data){
        vm.jsondata.orgcodelicurl=data;
      });
    });

    //驾驶证号
    $scope.$watch('licenseurl', function () {
      $scope.upload($scope.licenseurl,function(data){
        vm.jsondata.logourl=data;
      });
    });

    //行驶证号
    $scope.$watch('travellicenseurl', function () {
      $scope.upload($scope.travellicenseurl,function(data){
        vm.jsondata.taxlicurl=data;
      });
    });

    //从业资格证
    $scope.$watch('filesbiz', function () {
      $scope.upload($scope.filesbiz,function(data){
        vm.jsondata.bizlicurl=data;
      });
    });

    if($scope.pid){
      vm.getDriverInfo();
    }
}]);