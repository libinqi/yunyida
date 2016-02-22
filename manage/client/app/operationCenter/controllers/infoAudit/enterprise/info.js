'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditInfoCtrl', ['$scope', '$http', 'dialog', 'infoAuditService','Upload', function ($scope, $http, dialog, infoAuditService,Upload) {
    var vm = this;
    
    $scope.search = {
      startCity: []
    };

    vm.jsondata = {

    }

    vm.auditInfo ={

    }

    //查询企业明细
    vm.getEnterpriseInfo = function(){
      infoAuditService.getEnterpriseInfo($scope.enterpriseInfo.enterpriseid).then(function (response) {
        if(response.data.code == "200"){
          vm.jsondata = response.data.body;
        }
      });
    }

    //应用查询
    vm.getAppInfo = function(){
      infoAuditService.getAppInfo($scope.enterpriseInfo.enterpriseid).then(function (response) {
          if(response.data.code == "200"){
              vm.appList = response.data.body;
          }
      });
    }

    //审核
    vm.auditInfo = function(status){
        if($scope.myForm.$valid){
          vm.auditJson.enterpriseid = $scope.enterpriseInfo.enterpriseid;
          vm.auditJson.status = status;
          vm.auditJson.auditUserId = user.userid;
          infoAuditService.auditInfo(vm.auditJson).then(function (response) {
              if(response.data.code == "200"){
                  $scope.closeThisDialog(response.data);
              }
          });
        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function(){
      $scope.closeThisDialog(null);
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
    }

    // $scope.$watch('files', function () {
    //    $scope.upload($scope.files,function(data){
    //          vm.jsondata.image=data;
    //    });
    // });

    //组织机构代码
    $scope.$watch('filesorg', function () {
      $scope.upload($scope.filesorg,function(data){
        vm.jsondata.orgcodelicurl=data;
      });
    });

    //企业LOGO
    $scope.$watch('fileslog', function () {
      $scope.upload($scope.fileslog,function(data){
        vm.jsondata.logourl=data;
      });
    });
    
    //税务登记
    $scope.$watch('filestax', function () {
      $scope.upload($scope.filestax,function(data){
        vm.jsondata.taxlicurl=data;
      });
    });
    
    //工商营业执照
    $scope.$watch('filesbiz', function () {
      $scope.upload($scope.filesbiz,function(data){
        vm.jsondata.bizlicurl=data;
      });
    });

    vm.isShowImage = false;
    vm.imageSrc = "";
    //显示图片
    vm.showImage = function(isShow,imageSrc){
      if(isShow){
        vm.isShowImage = true;
        vm.imageSrc = imageSrc;
      }
      else{
        vm.isShowImage = false;
        vm.imageSrc = "";
      }
    }

    if($scope.enterpriseInfo.enterpriseid){
      vm.getEnterpriseInfo();
      vm.getAppInfo();
    }
}]);