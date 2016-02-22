'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditParkInfoCtrl', ['$scope', '$http', 'dialog', 'infoAuditService','Upload', function ($scope, $http, dialog, infoAuditService,Upload) {
  var vm = this;

  // $scope.search = {
  //   startCity: []
  // };

  vm.jsondata = {

  }

  //查询园区明细
  vm.getParkInfo = function(){
    infoAuditService.getParkInfo($scope.pid).then(function (response) {
      if(response.data.code == "200"){
        vm.jsondata = response.data.body;
        // $scope.search.startCity.id = vm.jsondata.locationCityCode;
        // var cityGroup = vm.jsondata.locationCityName.split('/');
        // for (var i = 0; i < cityGroup.length; i++) {
        //   $scope.search.startCity.cn[i] = cityGroup[i];
        // }
      }
    });
  }

  //新增OR修改
  vm.update = function(){
      if($scope.myForm.$valid){
          infoAuditService.addParkInfo(vm.jsondata).then(function (response) {
            $scope.closeThisDialog(response.data);
          });
      }
      $scope.myForm.submitted = true;
  }

  vm.cancel = function(){
    $scope.closeThisDialog(null);
  }

  // $scope.buildSearchCityText = function() {
  //   if ($scope.search.startCity.cn && $scope.search.startCity.cn.length >= 0) {
  //     vm.jsondata.locationCityCode = '';
  //     vm.jsondata.locationCityName = '';
  //     vm.jsondata.locationCityCode = $scope.search.startCity.id;
  //     for (var i = 0; i < $scope.search.startCity.cn.length; i++) {
  //       if(vm.jsondata.locationCityName){
  //         vm.jsondata.locationCityName += "/" + $scope.search.startCity.cn[i]
  //       }
  //       else{
  //         vm.jsondata.locationCityName += $scope.search.startCity.cn[i]
  //       }
  //
  //     }
  //   }
  // }
  //
  // $scope.$watch('search.startCity.id', $scope.buildSearchCityText);

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

    if($scope.pid){
      vm.getParkInfo();
    }
}]);
