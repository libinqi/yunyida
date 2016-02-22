'use strict';

var oilPriceService = angular.module('priceMonitorApp').factory('PriceService', ['$http', function ($http) {
  return {

    //长沙油价接口
    getOilPrice: function (areaCode) {
      var result = $http.get(lmp_host + '/ws/sinfo/fpiGaspriceIndex/getIndexByArea/'+areaCode).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    //运价指数
    getTransportPrice:function (data) {
      var result = $http.get(lmp_host + '/ws/sinfo/fpiTotalFreightIndex/getMonthList',{ params: data}).then(
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
