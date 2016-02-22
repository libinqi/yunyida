/**
 * Created by libinqi on 2015/6/3.
 */
'use strict';

var deptApp = angular.module('opCenterApp');
deptApp.controller('menuSaveOrUpdataCtrl', ['$scope', 'dialog', 'applicationManageService', function($scope, dialog, applicationManageService) {
  //     String menuid;   //菜单ID（修改时为必填）
  // String menuname;   //菜单名称
  // String pmenuid;   //上级菜单ID
  // String menuurl;   //菜单页面链接
  // Integer menuorder;   //菜单排序
  // String menudesc;   //菜单描述
  // String menuicon;   //菜单图标
  // String status;   //菜单状态
  // String statusname;   //状态名称
  // String applicationid;   //所属应用ID
  // String applicationname;   //所属应用名称
  var vm = this;
  $scope.menu = {
    menuid: '', //菜单ID（修改时为必填
    menuname: '', //菜单名称
    pmenuid: '0', //上级菜单ID
    menuurl: '', //菜单页面链接
    menuorder: '', //菜单排序
    menudesc: '', //菜单描述
    menuicon: '', //菜单图标
    status: 1, //菜单状态
    applicationid: '', //所属应用ID
    applicationname: ''
  };

  //初始加载应用数据
  vm.applicationList = function() {
    applicationManageService.applicationMenu(1,
      1000,
      '',
      $scope.menu.applicationid,
      1,
      $scope.productcode).then(function(response) {
      if (response.data.code == "200") {
        vm.menuLists = response.data.body.data;
      }
    });
  }
 vm.AddUpdataMenu = function(){
   applicationManageService.AddUpdataMenu($scope.menu).then(function(response) {
     if (response.data.code == "200") {
       if ($scope.menu.menuid) {
                       dialog.notify('更新菜单成功！', 'success');
                   }
                   else {
                       dialog.notify('添加菜单成功！', 'success');
                   }
      //  dialog.notify('更新菜单成功！', 'success');
       $scope.closeThisDialog(true);
     }else{
       dialog.notify(response.data.msg, 'error');
       $scope.closeThisDialog(false);
     }
   });
 }


  $scope.$watch('menu.applicationid', vm.applicationList);


  if ($scope.menuId) {
      applicationManageService.queryMenuById($scope.menuId).then(function (response) {
          if (response.data && response.data.code == "200") {
              var menu = response.data.body;
              if (menu) {
                  $scope.menu = menu;
                  vm.applicationList();
              }
          }
      });
  }
  //
  // $scope.$watch('menu.applicationid',function(newValue){
  //     if(!_.isEmpty(newValue))
  //     {
  //         $scope.getMenus(newValue);
  //     }
  // });
  //
  // $scope.menuUpdate = function () {
  //     systemSettingService.saveOrUpdateMenu($scope.menu).then(function (response) {
  //         if (response.data && response.data.code == "200") {
  //             if ($scope.menu.menuid) {
  //                 dialog.notify('更新菜单成功！', 'success');
  //             }
  //             else {
  //                 dialog.notify('添加菜单成功！', 'success');
  //             }
  //             $scope.menuForm.submitted = true;
  //             $scope.closeThisDialog(true);
  //         }
  //         else {
  //             dialog.notify(response.data.msg, 'error');
  //             $scope.closeThisDialog(false);
  //         }
  //     });
  // };
  //
 vm.menuCancel = function () {
      $scope.closeThisDialog(null);
  };

}]);
