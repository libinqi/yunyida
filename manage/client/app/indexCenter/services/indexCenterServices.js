/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var indexServiceApp = angular.module('indexCenterApp');
var indexCenterServices = indexServiceApp.factory('indexCenterServices', ['$http', function ($http) {
    return {
        getIndexDistribution: function (type) {
            var result = $http.get(loc_host + '/ws/home/homeDistribution/getDistributionList',{
              params: {
                type:type
              }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getOtherIndexDistribution: function (type) {
            var result = $http.get(loc_host + '/ws/home/homeDistribution/getTopDistributionList',{
                params: {
                    type: type
                }
            }).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        }






    };
}]);
