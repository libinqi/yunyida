'use strict';

var auditManageService = angular.module('opCenterApp').factory('auditManageService', ['$http', function ($http) {
  return {
    getLeaveAppList: function (data) {
      var result = $http.get(loc_host + '/ws/oa/oaLeaveApplication/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getLeaveAppInfo: function (data) {
      var result = $http.get(loc_host + '/ws/oa/oaLeaveApplication/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    saveOrUpdateLeaveApp: function (data) {
      var result = $http.post(loc_host + '/ws/oa/oaLeaveApplication/saveOrUpdate', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    delteLeaveApp: function (data) {
      var result = $http.delete(loc_host + '/ws/oa/oaLeaveApplication/delete/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    auditLeaveApp: function (data) {
      var result = $http.post(loc_host + '/ws/oa/oaLeaveApplication/checkApplication', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getDictListByParentDictCode: function (data) {
      var result = $http.get(loc_host + '/ws/system/sysDict/getDictListByParentDictCode/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getSysDeptList: function (data) {
      var result = $http.get(loc_host + '/ws/system/sysDept/getList',{ params: data}).then(
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
