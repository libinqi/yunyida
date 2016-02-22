/**
 * Created by libinqi on 2015/6/6.
 */
'use strict';

var commonApp = angular.module('commonApp');

commonApp.service('systemAppService', ['$rootScope', '$http', '$filter', '$timeout', function($rootScope, $http, $filter, $timeout) {
  var systemAppService = {
    baseService: {
      defaultDept: {},
      defaultRole: {},
      superUser: {},
      initDept: function() {
        var result = $http.get(loc_host + '/ws/system/sysDept/getList', {
          params: {
            pdeptid: 0
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        result.then(function(response) {
          if (response.data && response.data.code == "200"
            && response.data.body.data && response.data.body.data.length > 0) {
            systemAppService.baseService.defaultDept = response.data.body.data[0];
          } else {

            // 初始化根部门
            var dept = {
              deptid: '',
              deptname: systemAppService.baseService.parkInfo.parkname,
              deptphone: systemAppService.baseService.parkInfo.phone,
              deptcontact: systemAppService.baseService.parkInfo.contactname,
              deptdesc: systemAppService.baseService.parkInfo.address,
              pdeptid: '0',
              status: '1',
              deptorder: '1'
            };

            result = $http.post(loc_host + '/ws/system/sysDept/saveOrUpdate', dept).then(
              function(response) {
                return response;
              },
              function(response) {
                return response;
              }
            );

            result.then(function(response) {
              if (response.data && response.data.code == "200" && response.data.body) {
                systemAppService.baseService.defaultDept = response.data.body;
                $rootScope.$broadcast('baseService.dept.init');
              }
            });
          }
        });
      },
      iniRole: function() {
        var result = $http.get(loc_host + '/ws/system/sysRole/getList').then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          });

        result.then(function(response) {
          if (response.data && response.data.code == "200"
            && response.data.body.data && response.data.body.data.length > 0) {
            systemAppService.baseService.defaultRole = response.data.body.data[0];
          } else {
            // 初始化超级管理角色
            var role = {
              rolename: '系统超级管理员',
              roledesc: '系统超级管理员',
              status: '1'
            };

            result = $http.post(loc_host + '/ws/system/sysRole/saveOrUpdate', role).then(
              function(response) {
                return response;
              },
              function(response) {
                return response;
              }
            );
            result.then(function(response) {
              if (response.data && response.data.code == "200" && response.data.body) {
                systemAppService.baseService.defaultRole = response.data.body;
                $rootScope.$broadcast('baseService.role.init');
              }
            });
          }
        });

      //                $rootScope.$on('baseService.role.init', function () {
      //                    $timeout(function () {
      //                        var menuIds = [];
      //
      //                        for (var n in systemAppService.menuService.menus) {
      //                            menuIds.push(systemAppService.menuService.menus[n].menuid);
      //                        }
      //
      //                        var result = $http.post(loc_host + '/ws/system/sysRole/saveOrUpdateRoleMenus', {
      //                            roleid: systemAppService.baseService.defaultRole.roleid,
      //                            menuids: menuIds.join()
      //                        }).then(
      //                            function (response) {
      //                                return response;
      //                            },
      //                            function (response) {
      //                                return response;
      //                            }
      //                        );
      //
      //                        result.then(function (response) {
      //                            if (response.data && response.data.code == "200" && response.data.body) {
      //                            }
      //                            else {
      //                                console.log(response.data.msg);
      //                            }
      //                        });
      //                    }, 2000);
      //                });
      },
      initSuperUser: function() {
        var result = $http.get(loc_host + '/ws/system/sysUser/getList', {
          params: {
            username: 'admin'
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );

        result.then(function(response) {
          if (response.data && response.data.code == "200"
            && response.data.body.data && response.data.body.data.length == 1) {
            systemAppService.baseService.superUser = response.data.body.data[0];
          } else {
            var user = {
              userid: '', //用户ID（修改时为必填）
              username: 'admin', //工号
              realname: '系统管理员', //姓名
              password: '', //密码（若不填则使用默认密码123456）
              sex: '0', //性别
              duties: '系统管理员', //职务
              phone: '', //联系电话
              email: '', //电子邮箱
              deptid: systemAppService.baseService.defaultDept.deptid, //所属部门ID
              deptname: systemAppService.baseService.defaultDept.deptname, //所属部门ID
              roleid: systemAppService.baseService.defaultRole.roleid, //岗位ID
              usertype: '0', //用户类型
              status: '0', //用户状态
              description: ''
            };

            result = $http.post(loc_host + '/ws/system/sysUser/saveOrUpdate', user).then(
              function(response) {
                return response;
              },
              function(response) {
                return response;
              }
            );

            result.then(function(response) {
              if (response.data && response.data.code == "200" && response.data.body) {
                systemAppService.baseService.superUser = response.data.body;
                $rootScope.$broadcast('baseService.superUser.init');
              }
            });
          }
        });
      }
    },
    appService: {
      apps: [],
      getAppList: function() {
        var result = $http.get(loc_host + '/ws/system/sysApplication/getList', {
          params: {
            page: 1,
            rows: 100,
            status: '1'
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          });

        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            systemAppService.appService.apps = response.data.body.data;
            if (systemAppService.appService.apps.length > 0) {
              if (systemAppService.userService.userInfo && systemAppService.userService.userInfo.username != 'admin') {
                var apps = [], userApp, app;
                for (var n in systemAppService.userService.userInfo.permissions.application) {
                  userApp = systemAppService.userService.userInfo.permissions.application[n];
                  for (var i in systemAppService.appService.apps) {
                    app = systemAppService.appService.apps[i];
                    if (userApp.applicationid == app.applicationid) {
                      apps.push(app);
                    }
                  }
                }
                systemAppService.appService.apps = apps;
              }
              var orderBy = $filter('orderBy');
              systemAppService.appService.apps = orderBy(systemAppService.appService.apps, 'apporder', false);
              systemAppService.appService.loadApp();
            } else {
              systemAppService.appService.initApp();
            }
          }
        });
        return result;
      },
      getAppByName: function(appName) {
        var result = $http.get(loc_host + '/ws/system/sysApplication/getList', {
          params: {
            applicationname: appName
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          });
        return result;
      },
      initApp: function() {
        $rootScope.$broadcast('appService.apps.init');
      },
      loadApp: function() {
        $timeout(function() {
          $rootScope.$broadcast('appService.apps.load');
        });
      },
      registerApp: function(app, callback) {
        var result = $http.get(loc_host + '/ws/system/sysApplication/checkAppNameIsExist', {
          params: {
            applicationname: app.applicationname
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );

        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            result = $http.post(loc_host + '/ws/system/sysApplication/saveOrUpdate', app).then(
              function(response) {
                return response;
              },
              function(response) {
                return response;
              }
            );

            result.then(function(response) {
              if (response.data && response.data.code == "200") {
                systemAppService.appService.apps.push(response.data.body);
                systemAppService.appService.loadApp();
                if (callback) {
                  callback(response.data.body);
                }
              }
            });
          }
        });
      }
    },
    menuService: {
      menus: [],
      getMenuList: function() {
        var result = $http.get(loc_host + '/ws/system/sysMenu/getList', {
          params: {
            page: 1,
            rows: 100,
            status: '1'
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          });

        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            var orderBy = $filter('orderBy');
            systemAppService.menuService.menus = orderBy(response.data.body.data, 'menuorder', false);
            if (systemAppService.menuService.menus.length == 0) {
              systemAppService.menuService.initMenu();
            } else {
              systemAppService.menuService.loadMenu();
            }
          }
        });
        return result;
      },
      getMenusByAppId: function(appId, callback) {
        var result = $http.get(loc_host + '/ws/system/sysMenu/getList', {
          params: {
            page: 1,
            rows: 100,
            applicationid: appId,
            status: '1'
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          });

        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            var appMenus = response.data.body.data;
            if (appMenus && appMenus.length > 0) {
              if (systemAppService.userService.userInfo && systemAppService.userService.userInfo.username != 'admin') {
                var menus = [], userMenu, menu;
                for (var n in systemAppService.userService.userInfo.permissions.menu) {
                  userMenu = systemAppService.userService.userInfo.permissions.menu[n];
                  for (var i in appMenus) {
                    menu = appMenus[i];
                    if (userMenu.menuid == menu.menuid) {
                      menus.push(menu);
                    }
                  }
                }
                for (var i in appMenus) {
                  menu = appMenus[i];
                  if (menu.pmenuid == '0') {
                    menus.push(menu);
                  }
                }
                appMenus = menus;
              }
              var orderBy = $filter('orderBy');
              appMenus = orderBy(appMenus, 'menuorder', false);
              if (callback) {
                callback(appMenus);
              }
            }
          }
        });
      },
      initMenu: function() {
        $rootScope.$broadcast('appService.menus.init');
      },
      loadMenu: function() {
        $rootScope.$broadcast('appService.menus.load');
      },
      isMenu: function(applicationid, menuname) {
        var result = $http.get(loc_host + '/ws/system/sysMenu/checkMenuNameIsExist', {
          params: {
            applicationid: applicationid,
            menuname: menuname
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        result = result.then(function(response) {
          if (response.data && response.data.code == "200") {
            return true;
          } else {
            return false;
          }
        });
        return result;
      },
      registerMenu: function(menu, callback) {
        var result = $http.get(loc_host + '/ws/system/sysMenu/checkMenuNameIsExist', {
          params: {
            applicationid: menu.applicationid,
            menuname: menu.menuname
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );

        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            result = $http.post(loc_host + '/ws/system/sysMenu/saveOrUpdate', menu).then(
              function(response) {
                return response;
              },
              function(response) {
                return response;
              }
            );

            result.then(function(response) {
              if (response.data && response.data.code == "200") {
                systemAppService.menuService.menus.push(response.data.body);
                $rootScope.$broadcast('appService.menus.load');
                if (callback) {
                  callback(response.data.body);
                }
              }
            });
          }
        });
      }
    },
    userService: {
      userInfo: {},
      userLogin: function(username, password, callback) {
        var result = $http.get(loc_host + '/ws/system/sysLogin/login', {
          params: {
            username: username,
            password: password
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            systemAppService.userService.userInfo = response.data.body;
            $rootScope.user = systemAppService.userService.userInfo;
            if (callback) {
              callback(response.data.body);
            }
          } else if (callback) {
            callback(response.data.msg);
          }
        });
      },
      getUserPermissions: function() {
        var result = $http.get(loc_host + '/ws/system/sysLogin/accessIndex/' + systemAppService.userService.userInfo.userid).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            systemAppService.userService.userInfo.permissions = response.data.body;
            $rootScope.$broadcast('appService.user.updatePermissions');
          }
        });
      }
    },
    messageService: {
      messageList: {},
      getMessageCount: function(userId) {
        var result = $http.get(loc_host + '/ws/msg/sysMsg/getReceiverCount/' + 'pmonitor').then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      },
      getMsgTypeCount: function(receiver,msgtype) {
        var result = $http.get(loc_host + '/ws/msg/sysMsg/getMsgTypeCount?receiver=' + 'pmonitor' +'&msgtype=' + msgtype).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      },
      getMessageList: function(userId) {
        var result = $http.get(loc_host + '/ws/msg/mplatSysMsg/getlist?receiver=pmonitor', {
          params: {
            receiver: userId,
            ishaveread: 0,
            page:1,
            rows:999
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      },
      changeMessageStatus: function(userId, msgtype) {
        var result = $http.get(loc_host + '/ws/msg/mplatSysMsg/changeStatus', {
          params: {
            receiver: userId,
            msgtype: msgtype
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      },
      getMplatEnterpriseCount: function() {
        var result = $http.get(loc_host + '/ws/audit/mplatEnterprise/getList?status=y').then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      },
      getCmMessageCount: function() {
        var result = $http.get(loc_host + '/ws/cm/cmMessage/getList?userids=dict201506111328160001&statusname=无回复').then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        return result;
      }
    },
    dictService: {
      dictInfo: [],
      getDicts: function() {
        var result = $http.get(loc_host + '/ws/system/sysDict/getList', {
          params: {
            dictstatus:'1',
            page: 1,
            rows: 100000
          }
        }).then(
          function(response) {
            return response;
          },
          function(response) {
            return response;
          }
        );
        result.then(function(response) {
          if (response.data && response.data.code == "200") {
            var dictList = response.data.body.data;
            if (dictList && dictList.length > 0) {
              var dictType, dict, childDict, dicts;
              for (var n in dictList) {
                dict = dictList[n];
                if (dict.pdictid == 0) {
                  dictType = dict;
                  dicts = [];
                  for (var n in dictList) {
                    childDict = dictList[n];
                    if (childDict.pdictid == dictType.dictid) {
                      dicts.push(childDict);
                    }
                  }
                  var orderBy = $filter('orderBy');
                  dicts = orderBy(dicts, 'dictorder', false);
                  systemAppService.dictService.dictInfo[dictType.dictcode] = dicts;
                }
              }
              $rootScope.dictList = systemAppService.dictService.dictInfo;
              $rootScope.dictList.getDictById = function(dictId) {
                for (var n in $rootScope.dictList) {
                  var dicts = $rootScope.dictList[n];
                  for (var i = 0; i < dicts.length; i++) {
                    var dict = dicts[i];
                    if (dict.dictid == dictId || dict.dictcode == dictId) {
                      return dict;
                    }
                  }
                }
              };
            }
          }
        });
      }
    }
  };
  return systemAppService;
}]);
