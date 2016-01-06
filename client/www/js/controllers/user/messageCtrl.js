'use strict';

angular.module('starter.controllers').controller('MessageCtrl', function ($scope, $state, $stateParams, $timeout, $http, $ionicPopover, UserInfo, $ionicHistory) {

  $scope.items = [];
  $scope.page = 1;
  $scope.page_size = 10;
  $scope.load_over = true;
  $scope.msg_type = ['YQGG', '货源信息', ' 车源信息', '货源意向', '车源意向', '好友验证'];


  $scope.flag = {
    showDelete: false
  };

  $scope.isActive = $stateParams.data ? $stateParams.data : 'a';

  $scope.changeTab = function (evt) {
    var elem = evt.currentTarget;
    $scope.isActive = elem.getAttributeNode('data-active').value;
    $scope.items = [];
    $scope.page = 1;
    if ($scope.isActive == 'a') {
      $scope.loadMore();
    }
    if ($scope.isActive == 'b') {
      $scope.loadMore2();
    }
  };

  $scope.showMsg = function (txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function () {
      $scope.popover.hide();
    }, 1400);
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };
  // 通知消息
  $scope.deleteItem = function (k, id) {
    $scope.arrId = [];
    $scope.arrId.push(id);
    $scope.items.splice(k, 1);
    $http.get(ApiUrl + '/ws/msg/sysMsg/changeStatus', {
      params: {
        id: id
      }
    }).success(function (data) {
      if (data.code != '200') {
        alert(data.msg);
      }
    });
  };
  $scope.loadMore = function () {
    $timeout(function () {
      $http.get(ApiUrl + '/ws/msg/sysMsg/getlist', {
        params: {
          receiver: UserInfo.data.enterpriseid,
          ishaveread: 0,
          page: $scope.page,
          rows: $scope.page_size,
          order: "createdate",
          sort: "DESC"
        }
      }).success(function (data) {
        if (data.body && data.body.data.length > 0) {
          UserInfo.remove('unread_msg_count');
          if ($scope.page > data.body.totalPage) {
            $scope.load_over = false;
            return;
          }
          for (var k in data.body.data) {
            var msg = data.body.data[k];
            msg.title = '新的' + $scope.msg_type[msg.msgtype] + '消息';
          }
          $scope.items = $scope.items.concat(data.body.data);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
          $scope.load_over = false;
          $scope.items = $scope.items.concat([]);
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }).error(function (data, status, headers, config) {
        $scope.showMsg('请求失败,网络不给力！');
      });
    }, 200);
  }

  // 系统公告
  $scope.deleteItem2 = function (k, id) {
    $scope.arrId = [];
    $scope.arrId.push(id);
    $scope.items.splice(k, 1);
    $http.delete(ApiUrl + '/ws/cm/cmMessage/delete/' + UserInfo.userid + '/' + id).success(function (data) {
      if (data.code != '200') {
        alert(data.msg);
      }
    });
  };

  $scope.loadMore2 = function () {
    $timeout(function () {
      $http.get(ApiUrl + '/ws/cm/cmMessage/getList', {
        params: {
          msgtype: $scope.msg_type[0],
          page: $scope.page,
          rows: $scope.page_size,
          datasource: UserInfo.data.enterpriseid
        }
      }).success(function (data) {
        if (data.body && data.body.data.length > 0) {
          UserInfo.remove('unread_msg_count');
          if ($scope.page > data.body.totalPage) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.body.data);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
          $scope.load_over = false;
          $scope.items = $scope.items.concat([]);
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });
    }, 200);
  }

  $scope.msgGo = function () {

  }

});
