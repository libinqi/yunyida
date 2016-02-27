/**
 * Created by libinqi on 2015/6/6.
 */
'use strict';

var commonApp = angular.module('commonApp');

commonApp.service('systemAppService', ['$rootScope', '$http', '$filter', '$timeout', function ($rootScope, $http, $filter, $timeout) {
    var systemAppService = {
        baseService: {
            defaultDept: {},
            defaultRole: {},
            superUser: {},
            initDept: function () {
                var result = $http.get(loc_host + '/ws/system/sysDept/getList', {
                    params: {
                        pdeptid: 0
                    }
                }).then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                result.then(function (response) {
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
                            function (response) {
                                return response;
                            },
                            function (response) {
                                return response;
                            }
                        );

                        result.then(function (response) {
                            if (response.data && response.data.code == "200" && response.data.body) {
                                systemAppService.baseService.defaultDept = response.data.body;
                                $rootScope.$broadcast('baseService.dept.init');
                            }
                        });
                    }
                });
            },
            iniRole: function () {
                var result = $http.get(loc_host + '/ws/system/sysRole/getList').then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    });

                result.then(function (response) {
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
                            function (response) {
                                return response;
                            },
                            function (response) {
                                return response;
                            }
                        );
                        result.then(function (response) {
                            if (response.data && response.data.code == "200" && response.data.body) {
                                systemAppService.baseService.defaultRole = response.data.body;
                                $rootScope.$broadcast('baseService.role.init');
                            }
                        });
                    }
                });
            },
            initSuperUser: function () {
                var result = $http.get(loc_host + '/ws/system/sysUser/getList', {
                    params: {
                        username: 'admin'
                    }
                }).then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );

                result.then(function (response) {
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
                            function (response) {
                                return response;
                            },
                            function (response) {
                                return response;
                            }
                        );

                        result.then(function (response) {
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
            getAppList: function () {
                if (systemAppService.appService.apps.length <= 0) {
                    systemAppService.appService.initApp();
                }
                else {
                    systemAppService.appService.loadApp();
                }
                return systemAppService.appService.apps;
            },
            getAppByName: function (appName) {
                for (var a in systemAppService.appService.apps) {
                    if (appName == systemAppService.appService.apps[a].applicationname) {
                        return systemAppService.appService.apps[a];
                    }
                }
            },
            initApp: function () {
                $rootScope.$broadcast('appService.apps.init');
            },
            loadApp: function () {
                $timeout(function () {
                    $rootScope.$broadcast('appService.apps.load');
                });
            },
            registerApp: function (app, callback) {
                systemAppService.appService.apps.push(app);
                systemAppService.appService.loadApp();
                if (callback) {
                    callback(app);
                }
            }
        },
        menuService: {
            menus: [],
            getMenuList: function () {
                if (systemAppService.menuService.menus.length == 0) {
                    systemAppService.menuService.initMenu();
                } else {
                    systemAppService.menuService.loadMenu();
                }
                return systemAppService.menuService.menus;
            },
            getMenusByAppId: function (appId, callback) {
                var appMenus = [];
                var menu;

                for (var i in systemAppService.menuService.menus) {
                    menu = systemAppService.menuService.menus[i];
                    if (menu.applicationid == appId) {
                        appMenus.push(menu);
                    }
                }

                if (callback) {
                    callback(appMenus);
                }
            },
            initMenu: function () {
                $rootScope.$broadcast('appService.menus.init');
            },
            loadMenu: function () {
                $rootScope.$broadcast('appService.menus.load');
            },
            isMenu: function (applicationid, menuname) {
                var result, menu;

                for (var i in systemAppService.menuService.menus) {
                    menu = systemAppService.menuService.menus[i];
                    if (menu.applicationid == applicationid && menu.menuname == menuname) {
                        result = true;
                        return;
                    }
                    else {
                        result = false;
                    }
                }

                return result;
            },
            registerMenu: function (menu, callback) {
                systemAppService.menuService.menus.push(menu);
                $rootScope.$broadcast('appService.menus.load');
                if (callback) {
                    callback(menu);
                }
            }
        },
        userService: {
            userInfo: {},
            userLogin: function (username, password, callback) {
                var result = $http.get(loc_host + '/ws/system/sysLogin/login', {
                    params: {
                        username: username,
                        password: password
                    }
                }).then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                result.then(function (response) {
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
            getUserPermissions: function () {
                var result = $http.get(loc_host + '/ws/system/sysLogin/accessIndex/' + systemAppService.userService.userInfo.userid).then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                result.then(function (response) {
                    if (response.data && response.data.code == "200") {
                        systemAppService.userService.userInfo.permissions = response.data.body;
                        $rootScope.$broadcast('appService.user.updatePermissions');
                    }
                });
            }
        },
        messageService: {
            messageList: {},
            getMessageCount: function (userId) {
                var result = $http.get(loc_host + '/ws/msg/sysMsg/getReceiverCount/' + 'pmonitor').then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                return result;
            },
            getMsgTypeCount: function (receiver, msgtype) {
                var result = $http.get(loc_host + '/ws/msg/sysMsg/getMsgTypeCount?receiver=' + 'pmonitor' + '&msgtype=' + msgtype).then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                return result;
            },
            getMessageList: function (userId) {
                var result = $http.get(loc_host + '/ws/msg/mplatSysMsg/getlist?receiver=pmonitor', {
                    params: {
                        receiver: userId,
                        ishaveread: 0,
                        page: 1,
                        rows: 999
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
            changeMessageStatus: function (userId, msgtype) {
                var result = $http.get(loc_host + '/ws/msg/mplatSysMsg/changeStatus', {
                    params: {
                        receiver: userId,
                        msgtype: msgtype
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
            getMplatEnterpriseCount: function () {
                var result = $http.get(loc_host + '/ws/audit/mplatEnterprise/getList?status=y').then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                return result;
            },
            getCmMessageCount: function () {
                var result = $http.get(loc_host + '/ws/cm/cmMessage/getList?userids=dict201506111328160001&statusname=无回复').then(
                    function (response) {
                        return response;
                    },
                    function (response) {
                        return response;
                    }
                );
                return result;
            }
        },
        dictService: {
            dictInfo: [],
            getDicts: function () {
                var dictList = [{
                    "dictid": "dict201505101602050002",
                    "dictcode": "YH",
                    "dictname": "用户类型",
                    "dictorder": 2,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201505101602050009",
                    "dictcode": "XXLB",
                    "dictname": "消息类别",
                    "dictorder": 9,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201505101602051001",
                    "dictcode": "FBZQ",
                    "dictname": "发布周期",
                    "dictorder": 10,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201505101602051002",
                    "dictcode": "FBZT",
                    "dictname": "发布状态",
                    "dictorder": 11,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201505101602051006",
                    "dictcode": "FSDX",
                    "dictname": "发送对象",
                    "dictorder": 14,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201505281908110001",
                    "dictcode": "TT",
                    "dictname": "天",
                    "dictorder": 1,
                    "pdictid": "dict201505101602051001",
                    "pdictcode": "FBZQ",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布周期"
                }, {
                    "dictid": "dict201505281908110002",
                    "dictcode": "ZZ",
                    "dictname": "周",
                    "dictorder": 2,
                    "pdictid": "dict201505101602051001",
                    "pdictcode": "FBZQ",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布周期"
                }, {
                    "dictid": "dict201505281908110003",
                    "dictcode": "YY",
                    "dictname": "月",
                    "dictorder": 1,
                    "pdictid": "dict201505101602051001",
                    "pdictcode": "FBZQ",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布周期"
                }, {
                    "dictid": "dict201505281908110004",
                    "dictcode": "JJ",
                    "dictname": "季",
                    "dictorder": 2,
                    "pdictid": "dict201505101602051001",
                    "pdictcode": "FBZQ",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布周期"
                }, {
                    "dictid": "dict201505281908110005",
                    "dictcode": "NN",
                    "dictname": "年",
                    "dictorder": 1,
                    "pdictid": "dict201505101602051001",
                    "pdictcode": "FBZQ",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布周期"
                }, {
                    "dictid": "dict201505281908120001",
                    "dictcode": "CG",
                    "dictname": "草稿",
                    "dictorder": 1,
                    "pdictid": "dict201505101602051002",
                    "pdictcode": "FBZT",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布状态"
                }, {
                    "dictid": "dict201505281908120002",
                    "dictcode": "YFS",
                    "dictname": "已发送",
                    "dictorder": 2,
                    "pdictid": "dict201505101602051002",
                    "pdictcode": "FBZT",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布状态"
                }, {
                    "dictid": "dict201505281908120003",
                    "dictcode": "YHF",
                    "dictname": "已回复",
                    "dictorder": 3,
                    "pdictid": "dict201505101602051002",
                    "pdictcode": "FBZT",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布状态"
                }, {
                    "dictid": "dict201505281908120004",
                    "dictcode": "YYD",
                    "dictname": "已阅读",
                    "dictorder": 3,
                    "pdictid": "dict201505101602051002",
                    "pdictcode": "FBZT",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发布状态"
                }, {
                    "dictid": "dict201505281908200001",
                    "dictcode": "3",
                    "dictname": "企业",
                    "dictorder": 1,
                    "pdictid": "dict201505101602050002",
                    "pdictcode": "YH",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "用户类型"
                }, {
                    "dictid": "dict201505281908200002",
                    "dictcode": "2",
                    "dictname": "货主",
                    "dictorder": 2,
                    "pdictid": "dict201505101602050002",
                    "pdictcode": "YH",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "用户类型"
                }, {
                    "dictid": "dict201505281908200003",
                    "dictcode": "1",
                    "dictname": "司机",
                    "dictorder": 3,
                    "pdictid": "dict201505101602050002",
                    "pdictcode": "YH",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "用户类型"
                }, {
                    "dictid": "dict201505281908200004",
                    "dictcode": "0",
                    "dictname": "普通",
                    "dictorder": 4,
                    "pdictid": "dict201505101602050002",
                    "pdictcode": "YH",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "用户类型"
                }, {
                    "dictid": "dict201505281908900001",
                    "dictcode": "PTGG",
                    "dictname": "平台公告",
                    "dictorder": 1,
                    "pdictid": "dict201505101602050009",
                    "pdictcode": "XXLB",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "消息类别"
                }, {
                    "dictid": "dict201505281908900002",
                    "dictcode": "YQGG",
                    "dictname": "园区公告",
                    "dictorder": 2,
                    "pdictid": "dict201505101602050009",
                    "pdictcode": "XXLB",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "消息类别"
                }, {
                    "dictid": "dict201505281908900003",
                    "dictcode": "PTXX",
                    "dictname": "普通消息",
                    "dictorder": 1,
                    "pdictid": "dict201505101602050009",
                    "pdictcode": "XXLB",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "消息类别"
                }, {
                    "dictid": "dict201505281908900004",
                    "dictcode": "TXXX",
                    "dictname": "提醒消息",
                    "dictorder": 2,
                    "pdictid": "dict201505101602050009",
                    "pdictcode": "XXLB",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "消息类别"
                }, {
                    "dictid": "dict201505281908900005",
                    "dictcode": "FKTS",
                    "dictname": "反馈投诉",
                    "dictorder": 2,
                    "pdictid": "dict201505101602050009",
                    "pdictcode": "XXLB",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "消息类别"
                }, {
                    "dictid": "dict201506111328160001",
                    "dictcode": "PTKF",
                    "dictname": "平台客服",
                    "dictorder": 1,
                    "pdictid": "dict201505101602051006",
                    "pdictcode": "FSDX",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发送对象"
                }, {
                    "dictid": "dict201506111328160002",
                    "dictcode": "YQKF",
                    "dictname": "园区客服",
                    "dictorder": 2,
                    "pdictid": "dict201505101602051006",
                    "pdictcode": "FSDX",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": "0731001",
                    "pdictname": "发送对象"
                }, {
                    "dictid": "dict201508181645051001",
                    "dictcode": "XXLX",
                    "dictname": "消息类型",
                    "dictorder": 9,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201508181645051002",
                    "dictcode": "PTXX_LX",
                    "dictname": "普通消息",
                    "dictorder": 1,
                    "pdictid": "dict201508181645051001",
                    "pdictcode": "XXLX",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "消息类型"
                }, {
                    "dictid": "dict201508181645051003",
                    "dictcode": "FKTS_LX",
                    "dictname": "反馈投诉",
                    "dictorder": 2,
                    "pdictid": "dict201508181645051001",
                    "pdictcode": "XXLX",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "消息类型"
                }, {
                    "dictid": "dict201511101602050002",
                    "dictcode": "GSLX",
                    "dictname": "公示类型",
                    "dictorder": 2,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": null,
                    "pdictname": null
                }, {
                    "dictid": "dict201511101908200001",
                    "dictcode": "HMD",
                    "dictname": "黑名单",
                    "dictorder": 1,
                    "pdictid": "dict201511101602050002",
                    "pdictcode": "GSLX",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": null,
                    "pdictname": "公示类型"
                }, {
                    "dictid": "dict201511101908200002",
                    "dictcode": "BMD",
                    "dictname": "白名单",
                    "dictorder": 2,
                    "pdictid": "dict201511101602050002",
                    "pdictcode": "GSLX",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": null,
                    "pdictname": "公示类型"
                }, {
                    "dictid": "dict201511101908200003",
                    "dictcode": "CXTJ",
                    "dictname": "诚信推荐",
                    "dictorder": 3,
                    "pdictid": "dict201511101602050002",
                    "pdictcode": "GSLX",
                    "dictstatus": "1",
                    "dictstatusname": "有效",
                    "datasource": null,
                    "pdictname": "公示类型"
                }, {
                    "dictid": "dict201512021514100001",
                    "dictcode": "HLZT",
                    "dictname": "互联状态",
                    "dictorder": 20,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201512021514100002",
                    "dictcode": "YHL",
                    "dictname": "已互联",
                    "dictorder": 1,
                    "pdictid": "dict201512021514100001",
                    "pdictcode": "HLZT",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "互联状态"
                }, {
                    "dictid": "dict201512021514100003",
                    "dictcode": "WHL",
                    "dictname": "未互联",
                    "dictorder": 2,
                    "pdictid": "dict201512021514100001",
                    "pdictcode": "HLZT",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "互联状态"
                }, {
                    "dictid": "dict201512021514100004",
                    "dictcode": "DJZ",
                    "dictname": "对接中",
                    "dictorder": 3,
                    "pdictid": "dict201512021514100001",
                    "pdictcode": "HLZT",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "互联状态"
                }, {
                    "dictid": "dict201512211456100001",
                    "dictcode": "SZCS",
                    "dictname": "所在城市",
                    "dictorder": 1,
                    "pdictid": "0",
                    "pdictcode": null,
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": null
                }, {
                    "dictid": "dict201512211456100002",
                    "dictcode": "430100",
                    "dictname": "长沙市",
                    "dictorder": 1,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100003",
                    "dictcode": "430200",
                    "dictname": "株洲市",
                    "dictorder": 2,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100004",
                    "dictcode": "430300",
                    "dictname": "湘潭市",
                    "dictorder": 3,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100005",
                    "dictcode": "430400",
                    "dictname": "衡阳市",
                    "dictorder": 4,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100006",
                    "dictcode": "430500",
                    "dictname": "邵阳市",
                    "dictorder": 5,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100007",
                    "dictcode": "430600",
                    "dictname": "岳阳市",
                    "dictorder": 6,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100008",
                    "dictcode": "430700",
                    "dictname": "常德市",
                    "dictorder": 7,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100009",
                    "dictcode": "430900",
                    "dictname": "益阳市",
                    "dictorder": 8,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100010",
                    "dictcode": "431000",
                    "dictname": "郴州市",
                    "dictorder": 9,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100011",
                    "dictcode": "430800",
                    "dictname": "张家界市",
                    "dictorder": 10,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100012",
                    "dictcode": "431300",
                    "dictname": "娄底市",
                    "dictorder": 11,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100013",
                    "dictcode": "431200",
                    "dictname": "怀化市",
                    "dictorder": 12,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100014",
                    "dictcode": "431100",
                    "dictname": "永州市",
                    "dictorder": 13,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }, {
                    "dictid": "dict201512211456100015",
                    "dictcode": "433100",
                    "dictname": "湘西州",
                    "dictorder": 14,
                    "pdictid": "dict201512211456100001",
                    "pdictcode": "SZCS",
                    "dictstatus": "1",
                    "dictstatusname": "启用",
                    "datasource": "0731001",
                    "pdictname": "所在城市"
                }];
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
                    $rootScope.dictList.getDictById = function (dictId) {
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
        }
    };
    return systemAppService;
}]);