'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditDriverInfoCtrl', ['$scope', '$http', 'dialog', '$sails', 'Upload', 'CityPickerService', 'dictService', function ($scope, $http, dialog, $sails, Upload, CityPickerService, dictService) {
    var vm = this;

    vm.selectCity = {};
    vm.jsondata = {};
    $scope.sails = $sails;
    $scope.street_data = [];
    $scope.streetList = [];

    $scope.carLengthList = [];
    $scope.carTypeList = dictService.car_type;

    $scope.$watch('vm.jsondata.cars[0].carType', function (oldValue, newValue) {
        //if (oldValue && newValue)vm.jsondata.cars[0].carLength = '';
        if (!vm.jsondata.cars[0].carType) {
            dictService.car_length = [];
            return;
        }
        else {
            $scope.carLengthList = [];
        }

        $scope.carLengthList = dictService.getDictItem('car_type', vm.jsondata.cars[0].carType).car_length;
        dictService.car_length = $scope.carLengthList;
    });

    $scope.$on('onCitySelected', function (event, item) {
        if (item.id) {
            $scope.getStreetList(item.id);
            vm.jsondata.user.cityCode = item.id;
        }
        if (item.cn && item.cn.length > 0) {
            vm.jsondata.user.city = item.cn.join('');
        }
    });

    $scope.getStreetList = function (cityCode) {
        if (!cityCode) {
            $scope.street_data = [];
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


    //查询司机明细
    $scope.getDriverInfo = function () {
        $sails.get('/driver/' + $scope.uid)
            .success(function (data, status, headers, jwr) {
                vm.jsondata = data;
                vm.selectCity = data.user.cityCode;
                $scope.getStreetList(data.user.cityCode);
            })
            .error(function (data, status, headers, jwr) {
            });
    }

    //新增OR修改
    $scope.update = function () {
        if ($scope.myForm.$valid) {
            vm.jsondata.user.status = vm.jsondata.user.status == '1' ? true : false;
            var data = angular.extend({}, vm.jsondata.user, vm.jsondata.cars[0], vm.jsondata);
            $sails.post('/driver/update', data)
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
                    vm.jsondata.user.logo = data;
                }
            });
        }
    }

    $scope.uploadCarImage = function (file, errFiles) {
        if (file) {
            Upload.upload({
                url: $scope.sails.url + '/car/upload',
                data: {avatar: file, filename: file.name}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.avatar.name);
            }).success(function (data, status, headers, config) {
                if (status == 200) {
                    vm.jsondata.cars[0].carImage = $scope.sails.url + '/car/avatar/' + data;
                }
            });
        }
    }

    $scope.uploadDriverLicense = function (file, errFiles) {
        if (file) {
            Upload.upload({
                url: $scope.sails.url + '/car/upload',
                data: {avatar: file}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.avatar.name);
            }).success(function (data, status, headers, config) {
                if (status == 200) {
                    vm.jsondata.driverLicenseImage = $scope.sails.url + '/car/avatar/' + data;
                }
            });
        }
    }

    $scope.uploadDrivingLicense = function (file, errFiles) {
        if (file) {
            Upload.upload({
                url: $scope.sails.url + '/car/upload',
                data: {avatar: file}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.avatar.name);
            }).success(function (data, status, headers, config) {
                if (status == 200) {
                    vm.jsondata.drivingLicenseImage = $scope.sails.url + '/car/avatar/' + data;
                }
            });
        }
    }

    if ($scope.uid) {
        $scope.getDriverInfo();
    }
}]);