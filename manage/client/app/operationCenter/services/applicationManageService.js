/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';
var opServiceApp = angular.module('opCenterApp');
var applicationManageService = opServiceApp.factory('applicationManageService', ['$http', function ($http) {
    return {
        mplatApplication: function (page, rows,applicationname,status,productcode) {
            var result = $http.get(loc_host + '/ws/appmenu/mplatApplication/getList',{
                params: {
                    page: page,
                    rows: rows,
                    applicationname:applicationname,
                    status:status,
                    productcode:productcode
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
        //新增编辑及启用停用
        updataApplication: function(data){
          var result = $http.post(loc_host + '/ws/appmenu/mplatApplication/saveOrUpdate', data).then(
              function (response) {
                  return response;
              },
              function (response) {
                  return response;
              }
          );
          return result;
        },
        deleteApplication: function (applicationid) {
          var result = $http.delete(loc_host + '/ws/appmenu/mplatApplication/delete/' + applicationid).then(
            function (response) {
              return response;
            },
            function (response) {
              return response;
            }
          );
          return result;
        },
        //菜单管理所有应用
        allApplication: function (page, rows,productcode) {
            var result = $http.get(loc_host + '/ws/appmenu/mplatApplication/getList',{
                params: {
                    page: page,
                    rows: rows,
                    productcode:productcode
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
        //菜单管理列表
        applicationMenu: function (page,rows,menuname,applicationid,status,productcode) {
            var result = $http.get(loc_host + '/ws/appmenu/mplatMenu/queryByProductOflistPage',{
                params: {
                    page: page,
                    rows: rows,
                    menuname:menuname,
                    applicationid:applicationid,
                    status:status,
                    productcode:productcode
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
        //新增及修改应用菜单管理
        AddUpdataMenu: function(data){
          var result = $http.post(loc_host + '/ws/appmenu/mplatMenu/saveOrUpdate', data).then(
              function (response) {
                  return response;
              },
              function (response) {
                  return response;
              }
          );
          return result;
        },
        //根据菜单id获取详情
        queryMenuById: function (menuid) {
            var result = $http.get(loc_host + '/ws/appmenu/mplatMenu/queryById/'+menuid
            ).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        //删除菜单
        deleteMneu: function (menuid) {
          var result = $http.delete(loc_host + '/ws/appmenu/mplatMenu/delete/' + menuid).then(
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
