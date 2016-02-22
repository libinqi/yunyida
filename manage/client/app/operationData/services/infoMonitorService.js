'use strict';

var infoMonitorService = angular.module('platMonitorApp').factory('infoMonitorService', ['$http', function ($http) {
  return {
    //信息监测接口
    getInfoMonitorData: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatInfoStatistics/getBizInfoStatistics',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //货源监测相关接口
    getGoodsByProvince: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatGoodsStatistics/getGoodsByProvince',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getGoodsTopByOtherProvince: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatGoodsStatistics/getGoodsTopByOtherProvince',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getGoodsDistributionByPCity: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatGoodsStatistics/getGoodsDistributionByPCity',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getGoodsDistributionByDCity: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatGoodsStatistics/getGoodsDistributionByDCity',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //车源监测接口
    getVehicleResByProvince: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatVehicleStatistics/getVehicleResByProvince',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getVehicleTopByOtherProvince: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatVehicleStatistics/getVehicleTopByOtherProvince',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getVehicleResDistributionByPCity: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatVehicleStatistics/getVehicleResDistributionByPCity',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getVehicleResTopByCity: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatVehicleStatistics/getVehicleResTopByCity',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getVehicleResTopByOtherProvince: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatVehicleStatistics/getVehicleResTopByOtherProvince',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //订单信息接口
    getOrderByTime: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatOrderStatistics/getOrderByTime',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getMoneyByPeriod: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatOrderStatistics/getMoneyByPeriod',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getMoneyByTime: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatOrderStatistics/getMoneyByTime',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //用户数据
    getUsersByUserType: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatUserStatistics/getUsersByUserType',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getUserByUserActive: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatUserStatistics/getUserByUserActive',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getUserTotal: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatUserStatistics/getUserTotal',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getNewUserByTime: function (data) {
      var result = $http.get(loc_host + '/ws/mo/mplatUserStatistics/getNewUserByTime',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //吞吐量数据接口
    getTopThroughputByCity: function (data) {
      var query = angular.copy(data);
      query.top = 4;
      var result = $http.get(loc_host + '/ws/mo/mplatThroughputStatistics/getTopThroughputByCity',{ params: query}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getThroughputByTime: function (data) {
      var query = angular.copy(data);
      query.top = 999;
      var result = $http.get(loc_host + '/ws/mo/mplatThroughputStatistics/getThroughputByTime',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getThroughputByCity: function (data) {
      var query = angular.copy(data);
      query.top = 999;
      var result = $http.get(loc_host + '/ws/mo/mplatThroughputStatistics/getThroughputByCity',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //国家平台信息接口
    getNationDataResource: function (data) {
      var result = $http.get(loc_host + '/ws/mo/nationDataResouce/getNationDataResource',{ params: data}).then(
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
