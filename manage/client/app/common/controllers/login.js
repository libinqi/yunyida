/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';

var commonApp = angular.module('commonApp');
commonApp.controller('loginCtrl', ['$scope', '$location', 'systemAppService', function ($scope, $location, systemAppService) {
    var vm = this;
    vm.username = 'liwow';
    vm.password = '123456';
    vm.error = '';

    $scope.login = function () {
        systemAppService.userService.userLogin(vm.username, vm.password, function (data) {
            if (angular.isObject(data)) {
                $location.path('/');
            }
            else {
                vm.error = data;
            }
        });
    }
}]);