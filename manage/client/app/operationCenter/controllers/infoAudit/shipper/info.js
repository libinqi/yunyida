'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditShipperInfoCtrl', ['$scope', '$http', 'dialog', '$sails', 'Upload', 'CityPickerService', function ($scope, $http, dialog, $sails, Upload, CityPickerService) {
    var vm = this;

    vm.selectCity = {};
    vm.jsondata = {};
    $scope.sails = $sails;
    $scope.street_data = [];
    $scope.streetList = [];

    $scope.$on('onCitySelected', function (event, item) {
        if (item.id) {
            $scope.getStreetList(item.id);
            vm.jsondata.cityCode = item.id;
        }
        if (item.cn && item.cn.length > 0) {
            vm.jsondata.city = item.cn.join('');
        }
    });

    $scope.getStreetList = function (cityCode) {
        if (!cityCode) {
            dictService.street_data = [];
            return;
        }
        else {
            $scope.streetList = [];
        }

        $scope.streetList = CityPickerService.getStreetData(cityCode);
        $scope.street_data = [];

        for (var i = 0; i < $scope.streetList.length; i++) {
            $scope.street_data.push({id: $scope.streetList[i].id, name: $scope.streetList[i].areaName});
        }
    }


    //查询货主明细
    $scope.getShipperInfo = function () {
        $sails.get('/user/' + $scope.sid)
            .success(function (data, status, headers, jwr) {
                vm.jsondata = data;
                vm.selectCity = data.cityCode;
                $scope.getStreetList(data.cityCode);
            })
            .error(function (data, status, headers, jwr) {
            });
    }

    //新增OR修改
    $scope.update = function () {
        if ($scope.myForm.$valid) {
            $sails.put('/user/' + vm.jsondata.userId, vm.jsondata)
                .success(function (data) {
                    $scope.closeThisDialog(data);
                    dialog.notify('编辑成功！', 'success');
                })
                .error(function (data) {
                    $scope.closeThisDialog(null);
                    dialog.notify('编辑失败！', 'error');
                });
        }
        $scope.myForm.submitted = true;
    }

    $scope.cancel = function () {
        $scope.closeThisDialog(null);
    }

    $scope.upload = function (file, errFiles) {
        if (file) {
            Upload.upload({
                url: $scope.sails.url + '/user/uploadAvatar',
                data: {avatar: file}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.avatar.name);
            }).success(function (data, status, headers, config) {
                if (status == 200) {
                    vm.jsondata.logo = data;
                }
            });
        }
    }

    if ($scope.sid) {
        $scope.getShipperInfo();
    }
}]);
