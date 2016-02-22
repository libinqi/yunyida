/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var staffApp = angular.module('opCenterApp');
staffApp.controller('staffAddCtrl', ['$scope', 'dialog', 'systemSettingService', function ($scope, dialog, systemSettingService) {
  var vm = this;

  var getRootNodesScope = function () {
    return angular.element(document.getElementById("tree-root")).scope();
  };

  $scope.staffUpdate = function () {
    var staff = $scope.staff;
    var nodeData = $scope.selectedItem;
//    if (!nodeData || staff.deptid !== nodeData.deptid) {
      var rootNodesScope = getRootNodesScope();
      if (rootNodesScope && rootNodesScope.$nodesScope.childNodes().length > 0) {
        nodeData = rootNodesScope.$nodesScope.childNodes()[0].$modelValue;
        if (staff.deptid !== nodeData.deptid && nodeData.items.length > 0) {
          var nodesMap = {};

          var eachNode = function (node) {
            for (var i = 0; i < node.items.length; i++) {
              var childNode = node.items[i];
              nodesMap[childNode.deptid] = childNode;
              if (childNode.items.length > 0) {
                eachNode(childNode);
              }
            }
          };
          eachNode(nodeData);

          if (nodesMap[staff.deptid]) {
            nodeData = nodesMap[staff.deptid];
          }
        }
      }
//    }
    if (nodeData) {
      staff.deptid = nodeData.deptid;
      staff.deptname = nodeData.deptname;
      if (!staff.password) {
        staff.password = '123456';
      }
      systemSettingService.saveOrUpdateStaff(staff).then(function (response) {
        if (response.data && response.data.code == "200") {
          $scope.staffForm.submitted = true;
          $scope.closeThisDialog(null);
          if(staff.userid)
          {
            dialog.notify('更新人员信息成功！', 'success');
          }
          else{
            dialog.notify('新增人员成功！', 'success');
          }
        }
        else{
          dialog.notify(response.data.msg, 'error');
        }
      });
    }
  };

  $scope.staffCancel = function () {
    $scope.closeThisDialog(null);
  };

}]);
