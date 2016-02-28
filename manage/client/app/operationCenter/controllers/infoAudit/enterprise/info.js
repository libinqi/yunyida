'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditInfoCtrl', ['$scope', '$http', 'dialog', '$sails', 'Upload', 'CityPickerService', function ($scope, $http, dialog, $sails, Upload, CityPickerService) {
    var vm = this;

    vm.selectCity = {};
    vm.jsondata = {};
    vm.businessTypes = [];
    $scope.sails = $sails;
    $scope.street_data = [];
    $scope.streetList = [];

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


    //查询物流企业明细
    $scope.getEnterpriseInfo = function () {
        $sails.get('/enterprise/' + $scope.uid)
            .success(function (data, status, headers, jwr) {
                vm.jsondata = data;
                vm.selectCity = data.user.cityCode;
                vm.businessTypes = vm.jsondata.businessType.split(',');
                $scope.getStreetList(data.user.cityCode);
            })
            .error(function (data, status, headers, jwr) {
            });
    }

    $scope.businessTypeChange = function (value) {
        var index = vm.businessTypes.indexOf(value);
        if (index < 0) {
            vm.businessTypes.push(value);
        }
        else {
            vm.businessTypes.splice(index, 1);
        }

        if (vm.businessTypes.length > 0) {
            vm.jsondata.businessType = vm.businessTypes.join(',');
        }
        else {
            vm.jsondata.businessType = '';
        }
    }

    //新增OR修改
    $scope.update = function () {
        if ($scope.myForm.$valid) {
            vm.jsondata.user.status = vm.jsondata.user.status == '1' ? true : false;
            var data = angular.extend({}, vm.jsondata.user, vm.jsondata);
            $sails.post('/enterprise/update', data)
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

    if ($scope.uid) {
        $scope.getEnterpriseInfo();
    }
}]);