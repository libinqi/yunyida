/**
 * Created by libinqi on 2015/6/26.
 */
'use strict';

var commonApp = angular.module('commonApp');
commonApp.controller('userSettingCtrl', ['$scope', '$location', 'systemAppService', function ($scope, $location, systemAppService) {
    var vm = this;
    vm.activeMenu = 1;
}]);