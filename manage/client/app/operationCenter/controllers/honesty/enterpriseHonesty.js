'use strict';

var app = angular.module('opCenterApp');

app.controller('enterpriseHonestyCtrl', ['$scope', '$http', 'dialog', 'honestyService', function($scope, $http, dialog, honestyService) {
  var vm = this;
  vm.activeTab = "BMD";

  // 配置分页基本参数
  $scope.paginationConf = {
    currentPage: 1,
    itemsPerPage: 15,
    //以下实际应用中可注释
    totalItems:0
  };

  $scope.search = {
    startCity: [],
    endCity: []
  }

  vm.querydata = {
    page: 1,
    rows: 15,
    flag: 'BMD',
    searchCondition: '',
    order: 'publicDate',
    sort: 'DESC'
  }

  //待定订单查询
  vm.getEnterpriseHonestyList = function() {
    vm.querydata.page = vm.currentPage;
    vm.querydata.flag = vm.activeTab;
    honestyService.getEnterpriseHonesty(vm.querydata).then(function(response) {
      if (response.data.code == "200") {
        vm.dataList = response.data.body.data;
        // 变更分页的总数
        $scope.paginationConf.totalItems = response.data.body.totalRecords;
      }
    });
  }

  //添加企业信息
  vm.addEnterpriseHonesty = function () {
    $scope.flag = vm.activeTab;
    dialog.open({
        template: 'app/operationCenter/views/honesty/addEnterpriseHonesty.html',
        className: 'ngdialog-theme-default big-box',
        scope: $scope,
        preCloseCallback: function (data) {
            if(data != null && data.code=="200"){
              vm.query();
              dialog.notify('添加成功！', 'success');
            }
        }
    });
  }

  //明细查询
  vm.enterpriseHonestyInfo = function(eid) {
    $scope.eid = eid;
    $scope.flag = vm.activeTab;
    dialog.open({
      template: 'app/operationCenter/views/honesty/enterpriseHonestyInfo.html',
      className: 'ngdialog-theme-default big-box',
      scope: $scope, //将scope传给test.html,以便显示地址详细信息
      preCloseCallback: function(data) {
        // if(confirm('Are you sure you want to close without saving your changes?')) {
        //   return true;
        // }
        // return false;
        if (data != null && data.code == "200") {
          // dialog.notify('评价成功！', 'success');
        }
      }
    });
  }

  vm.delteEnterpriseHonesty = function(item){
    dialog.confirmDialog('您确定要删除吗？').then(function (data) {
      if (data) {
          honestyService.deleteEnterpriseHonesty(item.enterpriseId).then(function (response) {
              if(response.data != null && response.data.code=="200"){
                vm.query();
                dialog.notify('删除成功！', 'success');
              }
              else{
                dialog.notify(response.data.msg, 'error');
              }
          });
      }
    });
  }

  vm.query = function() {
    vm.getEnterpriseHonestyList();
  }

  vm.selectTab = function(flag) {
    vm.activeTab = flag;
    vm.getEnterpriseHonestyList();
  }

  vm.resetQuery = function(){
    vm.querydata.searchCondition = "";
    vm.query();
  }

  vm.query();
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  $scope.$watch('paginationConf.currentPage', vm.query);
}]);
