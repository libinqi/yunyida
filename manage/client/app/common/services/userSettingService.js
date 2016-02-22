'use strict';

var userSettingService = angular.module('commonApp').factory('userSettingService', ['$http', function ($http) {
  return {
    changePwd: function (data) {
      var result = $http.post(loc_host + '/ws/system/sysUser/changePwd', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getUserById: function (data) {
      var result = $http.get(loc_host + '/ws/system/sysUser/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    updateUser: function (data) {
      var result = $http.post(loc_host + '/ws/system/sysUser/saveOrUpdate', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    }
  }
}]);
