'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditAppDistributionCtrl', ['$scope', '$http', 'dialog', 'infoAuditService','Upload', function ($scope, $http, dialog, infoAuditService,Upload) {
    var vm = this;
    
    $scope.search = {
      startCity: []
    };

    vm.jsondata = {

    }

    vm.appDistributionJson ={

    }

    //应用查询
    vm.getAppList = function(){
      vm.querydata = {
          enterpriseid:$scope.enterpriseInfo.enterpriseid,
          enterprisekind:$scope.enterpriseInfo.enterprisekind
      };
      infoAuditService.getAppList(vm.querydata).then(function (response) {
          if(response.data.code == "200"){
              vm.appList = response.data.body;
          }
      });
    }

    //分配应用
    vm.appDistribution = function(status){
      var item_ids = [];

      angular.forEach(vm.appList, function (item, key) {
        if (item.flag) {
          item_ids.push(item.applicationid);
        }
      });

      vm.appDistributionJson.enterpriseid = $scope.enterpriseInfo.enterpriseid;
      vm.appDistributionJson.applicationid = item_ids.join(',');
      infoAuditService.appDistribution(vm.appDistributionJson).then(function (response) {
        if(response.data.code == "200"){
          $scope.closeThisDialog(response.data);
        }
      });
    }

    //取消
    vm.cancel = function(){
      $scope.closeThisDialog(null);
    }

    vm.getAppList();
}]);