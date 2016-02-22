/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var opServiceApp = angular.module('opCenterApp');
var accountManageService = opServiceApp.factory('accountManageService', ['$http', function ($http) {
    return {
        mplatEnterpriseAccount: function (page, rows,username, realname, phone,enterprisename) {
            var result = $http.get(loc_host + '/ws/account/mplatEnterpriseAccount/getList',{
                params: {
                    page: page,
                    rows: rows,
                    username: username,
                    realname: realname,
                    phone: phone,
                    enterprisename:enterprisename
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
        updataAccount: function(userid,username,enterpriseid,enterprisename,phone,realname){
          var result = $http.post(loc_host + '/ws/account/mplatEnterpriseAccount/update', {
              userid: userid,
              username: username,
              enterpriseid: enterpriseid,
              enterprisename: enterprisename,
              phone: phone,
              realname: realname
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
        resetPwd: function(userid,password){
          var result = $http.post(loc_host + '/ws/account/mplatEnterpriseAccount/resetPwd', {
              userid: userid,
              password: password
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
