'use strict';

var customersManageService = angular.module('opCenterApp').factory('customersManageService', ['$http', function ($http) {
  return {
    getEnterpriseList: function (data) {
      var result = $http.get(loc_host + '/ws/cl/clEnterpriseManage/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getEnterpriseInfo: function (data) {
      var result = $http.get(loc_host + '/ws/cl/clEnterpriseManage/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    addEnterpriseInfo: function (data) {
      var result = $http.post(loc_host + '/ws/cl/clEnterpriseManage/addEnterpriseInfo', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    editEnterpriseInfo: function (data) {
      var result = $http.post(loc_host + '/ws/cl/clEnterpriseManage/updateEnterpriseInfo', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getDriverList: function (data) {
      var result = $http.get(loc_host + '/ws/cl/clDriverManage/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getDriverInfo: function (data) {
      var result = $http.get(loc_host + '/ws/cl/clDriverManage/queryById/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    addDriverInfo: function (data) {
      var result = $http.post(loc_host + '/ws/cl/clDriverManage/addDriverInfo', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getCarTypeList: function (data) {
      var result = $http.get(loc_host + '/ws/parking/pcartype/getlist',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    根据企业名称/联系人/联系电话查找企业信息
    参数:enterpriseInfo: 查询条件，可以是企业名称或联系人名称或电话号码
    */
    queryEnterpriseInfo: function (data) {
      var result = $http.get(lmp_host + '/ws/system/sysEnterprise/queryEnterpriseInfo',{params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    根据企业ID查找需要被添加为好友的企业信息详情
    参数:企业ID
    */
    getEnterpriseLicense: function (data) {
      var result = $http.get(lmp_host + '/ws/system/sysEnterprise/getEnterpriseLicense/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    添加企业好友客户申请
    参数:
    String senterpriseid;   //源企业ID（必填）
    String denterpriseid;   //目标企业ID（必填）
    String ctype;   //客户类型（父字典编码是KHLX）
    String remark;   //备注(验证信息)
    String datasource;   //数据来源
    */
    addApplication: function (data) {
      var result = $http.post(lmp_host + '/ws/cl/clEnterpriseManage/addApplication', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    根据条件分页查看企业客户好友申请消息
    参数:
    datasource:数据来源
    page：页数
    rows: 每页记录数
    denterpriseid:企业ID（当前登录用户所在企业id）
    */
    queryApplicationList: function (data) {
      var result = $http.get(lmp_host + '/ws/cl/clEnterpriseManage/queryApplicationList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    清空好友申请消息记录
    参数:applicationids: 好友申请主键ID，多个申请以逗号进行分隔
    */
    batchClearApplication: function (data) {
      var result = $http.get(lmp_host + '/ws/cl/clEnterpriseManage/batchClearApplication/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    /*
    处理好友申请记录
    参数:
    String applicationid;   //申请ID（必填）
    String status;   //状态(0:初始,1:通过,2:拒绝)
    */
    auditApplication: function (data) {
      var result = $http.post(lmp_host + '/ws/cl/clEnterpriseManage/auditApplication', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getLmpEnterpriseList: function (data) {
      var result = $http.get(lmp_host + '/ws/cl/clEnterpriseManage/getList',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getEnterpriseInfolmp: function (data) {
      var result = $http.get(lmp_host + '/ws/cl/clEnterpriseManage/queryById',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    deleteEnterprise: function (ids, datasource) {
      var result = $http.delete(lmp_host + '/ws/cl/clEnterpriseManage/delete?enterpriseid=' + ids + '&datasource=' + datasource).then(
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
