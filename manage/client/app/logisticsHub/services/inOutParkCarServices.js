/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var mtServiceApp = angular.module('parkMonitorApp');
var inOutParkCarServices = mtServiceApp.factory('inOutParkCarServices', ['$http', function ($http) {
    return {
        getInOutParkInfo: function () {
            var result = $http.get(loc_host + '/ws/mo/mplatParkCarentryStatistics/queryCarentryCollect').then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getAbnormalCarList: function (page,rows) {
            var result = $http.get(loc_host + '/ws/mo/mplatParkCarentryStatistics/queryVehicleInOutBylistPage',{
              params:{
                page:page,
                rows:rows
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
        getCarDetailById: function (id) {
            var result = $http.get(loc_host + '/ws/mo/mplatParkCarentryStatistics/queryVehicleDetailById/'+id).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getInOutParkAbnormalCar: function () {
            var result = $http.get(loc_host + '/ws/mo/mplatParkCarentryStatistics/queryVehicleAbnormalByList').then(
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
