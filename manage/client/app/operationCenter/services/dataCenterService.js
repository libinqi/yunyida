'use strict';

var dataCenterService = angular.module('opCenterApp').factory('dataCenterService', ['$http', function ($http) {
  return {
    countParkMonthIncome: function (data) {
      var result = $http.get(loc_host + '/ws/parking/pstatistic/countParkMonthIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    countParkQuaterIncome: function (data) {
      var result = $http.get(loc_host + '/ws/parking/pstatistic/countParkQuaterIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    countParkYearIncome: function (data) {
      var result = $http.get(loc_host + '/ws/parking/pstatistic/countParkYearIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    roomMonthIncome: function (data) {
      var result = $http.get(loc_host + '/ws/hotel/hStatistic/roomMonthIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    roomQuaterIncome: function (data) {
      var result = $http.get(loc_host + '/ws/hotel/hStatistic/roomQuaterIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    roomYearIncome: function (data) {
      var result = $http.get(loc_host + '/ws/hotel/hStatistic/roomYearIncome/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertyFeesByDay: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/getFeesByDay/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertyPerDayFeesByMonth: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/getPerDayFeesByMonth/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertyQuaterFeesByYear: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/getQuaterFeesByYear/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertyPerMonthFeesByYear: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/getPerMonthFeesByYear/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertyFeesBySEDay: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/getFeesBySEDay',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    parkSumIncomeWithStep: function (data) {
      var result = $http.get(loc_host + '/ws/parking/pstatistic/sumIncomeWithStep',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    hotelSumIncomeWithStep: function (data) {
      var result = $http.get(loc_host + '/ws/hotel/hStatistic/sumIncomeWithStep',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    propertySumIncomeWithStep: function (data) {
      var result = $http.get(loc_host + '/ws/property/mstatistic/sumIncomeWithStep',{ params: data}).then(
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
