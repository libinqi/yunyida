'use strict';

var humanServices = angular.module('opCenterApp').factory('humanServices', ['$http', function ($http) {
  return {
    getjobList: function (data) {
      var result = $http.get(loc_host + '/ws/hr/hrRecruitManager/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
     getworkList: function (data) {
      var result = $http.get(loc_host + '/ws/hr/hrAttendance/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
      saveOrupdateJob: function (data) {
      var result = $http.post(loc_host + '/ws/hr/hrRecruitManager/saveOrUpdate',data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deleteJob: function (id) {
      var result = $http.delete(loc_host + 'zeus/ws/hr/hrRecruitManager/delete'+id).then(
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
