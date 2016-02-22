'use strict';

var infoAuditService = angular.module('opCenterApp').factory('infoAuditService', ['$http', function ($http) {
  return {
    getParkList: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatPark/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getParkInfo: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatPark/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    addParkInfo: function (data) {
      var result = $http.post(loc_host + '/ws/audit/mplatPark/saveOrUpdate', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deletePark: function (ids) {
      var result = $http.delete(loc_host + '/ws/audit/mplatPark/delete/' + ids).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getDriverList: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatDriver/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getDriverInfo: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatDriver/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deleteDriver: function (ids) {
      var result = $http.delete(loc_host + '/ws/audit/mplatDriver/delete/' + ids).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getEnterpriseList: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatEnterprise/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getEnterpriseInfo: function (data) {
      var result = $http.get(loc_host + '/ws/audit/mplatEnterprise/queryDetailById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getAppList: function (data) {
      var result = $http.get(loc_host + '/ws/appmenu/mplatApplication/getAvailableApplicationByEnterprise',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getAppInfo: function (data) {
      var result = $http.get(loc_host + '/ws/appmenu/mplatApplication/queryByEnterprise/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    auditInfo: function (data) {
      var result = $http.post(loc_host + '/ws/audit/mplatEnterprise/audit', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    appDistribution: function (data) {
      var result = $http.post(loc_host + '/ws/audit/mplatEnterprise/saveEntepriseAppRealtion', data).then(
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
