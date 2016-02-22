'use strict';

var clientCenterService = angular.module('opCenterApp').factory('clientCenterService', ['$http', function ($http) {
  return {
    getMessageList: function (data) {
      var result = $http.get(loc_host + '/ws/cm/cmMessage/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getMessageInfo: function (data) {
      var result = $http.get(loc_host + '/ws/cm/cmMessage/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    saveOrUpdateMessage: function (data) {
      var result = $http.post(loc_host + '/ws/cm/cmMessage/saveOrUpdate', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    replyMessage: function (message) {
      var result = $http.post(loc_host + '/ws/cm/cmMessage/reply', message).then(
        function (response) {
            return response;
        },
        function (response) {
            return response;
        }
      );
      return result;
    },
    deleteMessage: function (ids) {
      var result = $http.delete(loc_host + '/ws/cm/cmMessage/delete/' + ids).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    queryEnterpriseInfo: function(enterpriseInfo) {
        var result = $http.get(loc_host + '/ws/audit/mplatEnterprise/getList?status=1&enterprisename=' + enterpriseInfo).then(
            function(response) {
                return response;
            },
            function(response) {
                return response;
            }
        );
        return result;
    }
  }
}]);
