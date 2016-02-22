'use strict';

var app = angular.module('opCenterApp');
app.controller('viewEnterpriselmpCtrl', ['$scope', '$http', 'dialog', 'customersManageService', 'Upload', function ($scope, $http, dialog, customersManageService, Upload) {
    var vm = this;

    vm.querydata = {
        enterpriseid:$scope.eid
    }
    //企业查询
    vm.getEnterpriseInfo = function(){
        customersManageService.getEnterpriseInfolmp(vm.querydata).then(function (response) {
            if(response.data.code == "200"){
                vm.jsondata = response.data.body;
            }
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

    $scope.$watch('imageUrl', function () {
       $scope.upload($scope.imageUrl,function(data){
             vm.jsondata.imageUrl=data;
       });
    });

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }

    vm.getEnterpriseInfo();

}]);