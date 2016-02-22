/**
 * Created by libinqi on 2015/6/16.
 */
'use strict';
var opServiceApp = angular.module('opCenterApp');
var customersCenterService = opServiceApp.factory('customersCenterService', ['$http', function ($http) {
    return {
        getAuditUserList: function (page, rows, usertype, status, enterprisename) {
            var result = $http.get(loc_host + '/ws/cm/cmEnterAudit/getList', {
                params: {
                    page: page,
                    rows: rows,
                    usertype: usertype,
                    status: status,
                    enterprisename: enterprisename
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
        getAuditUser: function (enterpriseid) {
            var result = $http.get(loc_host + '/ws/cm/cmEnterAudit/queryById/' + enterpriseid).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        auditUser: function (userid, status, updator, description) {
            var result = $http.post(loc_host + '/ws/cm/cmEnterAudit/audit', {
                userid: userid,
                status: status,
                updator: updator,
                description: description
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
        getEnterpriseClientList: function (page, rows, usertype, status, enterprisename) {
            var result = $http.get(loc_host + '/ws/cm/cmClientManage/getList', {
                params: {
                    page: page,
                    rows: rows,
                    usertype: usertype,
                    status: status,
                    enterprisename: enterprisename
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
        getEnterpriseClient: function (clientId) {
            var result = $http.get(loc_host + '/ws/cm/cmClientManage/queryById/' + clientId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        unlockClient: function (clientid, status, remark) {
            var result = $http.post(loc_host + '/ws/cm/cmClientManage/saveOrUpdate', {
                cid: clientid,
                status: status,
                remark: remark
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
        getMessageList: function (page, rows, msgtype, content) {
            var result = $http.get(loc_host + '/ws/cm/cmMessage/getList', {
                params: {
                    page: page,
                    rows: rows,
                    msgtype: msgtype,
                    content: content,
                    order:'updatetime',
                    sort:'DESC'
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
        getMessage: function (messageId) {
            var result = $http.get(loc_host + '/ws/cm/cmMessage/queryById/' + messageId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        replyMessage: function (message) {
            var result = $http.post(loc_host + '/ws/cm/cmMessage/reply', message).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateMessage: function (message) {
            var result = $http.post(loc_host + '/ws/cm/cmMessage/saveOrUpdate', message).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getTicketList: function (page, rows, tel, vehicle_number) {
            var result = $http.get(loc_host + '/ws/parking/pmonthticket/getlist', {
                params: {
                    page: page,
                    rows: rows,
                    tel: tel,
                    vehicle_number: vehicle_number
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
        getTicket: function (ticketId) {
            var result = $http.get(loc_host + '/ws/parking/pmonthticket/getpMonthticket/' + ticketId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateTicket: function (ticket) {
            var result = $http.post(loc_host + '/ws/parking/pmonthticket/saveorupdate', ticket).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        getCustomersServeList: function (page, rows, servicetype, priority, status, createdate) {
            var result = $http.get(loc_host + '/ws/cm/cmCustomerServer/getList', {
                params: {
                    page: page,
                    rows: rows,
                    servicetype: servicetype,
                    priority: priority,
                    status: status,
                    createdate: createdate
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
        getCustomersServe: function (serverId) {
            var result = $http.get(loc_host + '/ws/cm/cmCustomerServer/queryById/' + serverId).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        saveOrUpdateCustomersServe: function (customersServe) {
            var result = $http.post(loc_host + '/ws/cm/cmCustomerServer/saveOrUpdate', customersServe).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        addCustomersVisit: function (customersVisit) {
            var result = $http.post(loc_host + '/ws/cm/cmCustomerServer/saveOrUpdate', customersVisit).then(
                function (response) {
                    return response;
                },
                function (response) {
                    return response;
                }
            );
            return result;
        },
        queryEnterpriseInfo: function(enterpriseInfo) {
            var result = $http.get(loc_host + '/ws/cm/cmEnterAudit/getList?enterprisetype=RZQY&status=1&enterprisename=' + enterpriseInfo).then(
                function(response) {
                    return response;
                },
                function(response) {
                    return response;
                }
            );
            return result;
        }
    };
}]);