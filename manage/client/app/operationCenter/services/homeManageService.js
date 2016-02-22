'use strict';

var homeManageService = angular.module('opCenterApp').factory('homeManageService', ['$http', function ($http) {
  return {
    //获取最近的货源信息以及意向数量
    getGoodsWithIntentNum: function (data) {
      var result = $http.get(lmp_host + '/ws/sinfo/bizGoodsInfo/getGoodsWithIntentNum/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getVehicleWithIntentNum: function (data) {
      var result = $http.get(lmp_host + '/ws/sinfo/bizVehicleInfo/getVehicleWithIntentNum/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    countUndealInfo: function (data) {
      var result = $http.get(lmp_host + '/ws/sinfo/bizVehicleInfo/countUndealInfo/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    countApplication: function (data) {
      var result = $http.get(lmp_host + '/ws/cl/clEnterpriseManage/countApplication/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    countGoodsUndealInfo: function (data) {
      var result = $http.get(lmp_host + '/ws/sinfo/bizGoodsInfo/countUndealInfo/' + data).then(
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
