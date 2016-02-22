/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var mtServiceApp = angular.module('supplyMonitorApp');
var monitorServices = mtServiceApp.factory('monitorServices', ['$http', function ($http) {
    return {
        getParkDistribution: function () {
            var result = $http.get(loc_host + '/ws/mo/mplatParkStatistics/getParkDistribution').then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getParkDetail: function (currentTime,type,parkid,parkCode) {
            var result = $http.get(loc_host + '/ws/mo/mplatParkStatistics/getParkDetailStatistics',{
                params: {
                    currentTime: currentTime,
                    type: type,
                    parkid:parkid,
                    parkCode:parkCode
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
