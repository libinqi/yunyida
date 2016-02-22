/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var deptApp = angular.module('opCenterApp');
deptApp.controller('departmentAddCtrl', ['$scope','dialog', 'systemSettingService', function ($scope,dialog, systemSettingService) {
  var vm = this;

  var getRootNodesScope = function () {
    return angular.element(document.getElementById("tree-root")).scope();
  };

  $scope.deptUpdate = function () {
    var dept = $scope.dept;
//    if (!dept.deptid) {
      var nodeData = $scope.selectedItem;
      if (dept.pdeptid !== nodeData.deptid) {
        var rootNodesScope = getRootNodesScope();
        if (rootNodesScope && rootNodesScope.$nodesScope.childNodes().length > 0) {
          nodeData = rootNodesScope.$nodesScope.childNodes()[0].$modelValue;
          if (dept.pdeptid !== nodeData.deptid && nodeData.items.length > 0) {
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

            if (nodesMap[dept.pdeptid]) {
              nodeData = nodesMap[dept.pdeptid];
            }
          }
        }
      }
      if (nodeData) {
//        dept.deptid = nodeData.deptid + (nodeData.items.length + 1);
        if (!dept.deptid) {
          systemSettingService.saveOrUpdateDept(dept).then(function (response) {
            if (response.data && response.data.code == "200") {
              for (var n in dept) {
                dept[n] = response.data.body[n];
              }
              $scope.deptList.items.push(dept);
              nodeData.items.push({
                deptid: dept.deptid,
                pdeptid: nodeData.deptid,
                deptname: dept.deptname,
                deptphone:dept.deptphone,
                deptcontact:dept.deptcontact,
                deptdesc:dept.deptdesc,
                items: []
              });
              dialog.notify('添加部门成功！', 'success');
            }
            else{
              dialog.notify(response.data.msg, 'error');
            }
          });
        }
        else{
          systemSettingService.saveOrUpdateDept(dept).then(function (response) {
            if (response.data && response.data.code == "200") {
              for (var n in dept) {
                dept[n] = response.data.body[n];
              }
              for (var n in $scope.deptList.items) {
                if($scope.deptList.items[n].deptid===dept.deptid)
                {
                  for (var i in dept) {
                    $scope.deptList.items[n][i] = dept[i];
                  }
                }
              }
              for (var n in nodeData.items) {
                if(nodeData.items[n].deptid===dept.deptid)
                {
                  for (var i in dept) {
                     nodeData.items[n][i] = dept[i];
                  }
                }
              }
              dialog.notify('更新部门信息成功！', 'success');
            }
            else{
              dialog.notify(response.data.msg, 'error');
            }
          });
        }
      }
//    }
    $scope.deptForm.submitted = true;
    $scope.closeThisDialog(null);
  };

  $scope.deptCancel = function () {
    $scope.closeThisDialog(null);
  };

}]);
