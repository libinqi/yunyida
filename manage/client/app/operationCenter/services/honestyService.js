'use strict';

var honestyService = angular.module('opCenterApp').factory('honestyService', ['$http', function ($http) {
  return {
    //分页及条件查询企业公示信息
    getEnterpriseHonesty: function (data) {
      var result = $http.get(loc_host + '/ws/honesty/honestyEnterprise/getList', {params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    addEnterpriseHonesty: function (data) {
      var result = $http.post(loc_host + '/ws/honesty/honestyEnterprise/saveOrUpdate', data).then(
        function (response) {
            return response;
        },
        function (response) {
            return response;
        }
      );
      return result;
    },
    getEnterpriseHonestyInfo: function (data) {
      var result = $http.get(loc_host + '/ws/honesty/honestyEnterprise/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deleteEnterpriseHonesty: function (ids) {
      var result = $http.delete(loc_host + '/ws/honesty/honestyEnterprise/delete/' + ids).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },

    //分页及条件查询企业公示信息
    getDriverHonesty: function (data) {
      var result = $http.get(loc_host + '/ws/honesty/honestyDriver/getList', {params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    addDriverHonesty: function (data) {
      var result = $http.post(loc_host + '/ws/honesty/honestyDriver/saveOrUpdate', data).then(
        function (response) {
            return response;
        },
        function (response) {
            return response;
        }
      );
      return result;
    },
    getDriverHonestyInfo: function (data) {
      var result = $http.get(loc_host + '/ws/honesty/honestyDriver/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deleteDriverHonesty: function (ids) {
      var result = $http.delete(loc_host + '/ws/honesty/honestyDriver/delete/' + ids).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
  }
}]);
