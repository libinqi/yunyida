'use strict';

var infoMonitorService = angular.module('parkMonitorApp').factory('indexRankService', ['$http', function ($http) {
  return {

    getParkInfoByTime: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatParkStatistics/getParkInfoByTime',{ params: data}).then(
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
