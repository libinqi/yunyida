'use strict';

var app = angular.module('opCenterApp');
app.controller('addDriverHonestyCtrl', ['$scope', '$http', 'dialog', 'honestyService', 'Upload', function ($scope, $http, dialog, honestyService, Upload) {
    var vm = this;

    vm.jsondata = {

    }

    //新增OR修改
    vm.add = function(){
        if($scope.myForm.$valid){
            vm.jsondata.flag = $scope.flag;
            honestyService.addDriverHonesty(vm.jsondata).then(function (response) {
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
    };

    $scope.$watch('imageUrl', function () {
       $scope.upload($scope.imageUrl,function(data){
             vm.jsondata.imageUrl=data;
       });
    });
    
}]);