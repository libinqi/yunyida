'use strict';

angular.module('yydApp')
  .controller('headerCtrl', function($rootScope, $scope, $location, dialog, systemAppService) {
    $scope.userSettingClick = function() {
      dialog.open({
        template: 'app/common/views/userSetting/userCenter.html',
        className: 'ngdialog-theme-default big-box',
        scope: $scope
      });
    };


    $scope.status = {
      isopen: false
    };

    $scope.message = {
      count: 0,
      items: []
    };

    $scope.newMessage = function() {
      systemAppService.messageService.getMessageCount(user.permissions.parkid).then(function(response) {
        if (response.data && response.data.code == "200") {
          $scope.message.count = response.data.body;
        }
      });
    }
    $scope.newMessage();

    $rootScope.$on('baseService.message.new', function() {
      $scope.newMessage();
    });

    $scope.changeMessageStatus = function(msgtype, url) {
      systemAppService.messageService.changeMessageStatus(user.permissions.parkid, msgtype).then(function(response) {
        if (response.data && response.data.code == "200") {
          $scope.newMessage();
          $location.url(url);
        }
      });
    }

    $scope.toggled = function(open) {
      if (!open) {
        systemAppService.messageService.getMessageList(user.permissions.parkid).then(function(response) {
          $scope.message.items = [];
          if (response.data && response.data.code == "200") {
            $scope.message.count = response.data.body.totalRecords;
            if ($scope.message.count && $scope.message.count > 0) {
              // var type_count_1 = 0;
              // var type_count_2 = 0;
              // var type_count_3 = 0;
              // var type_count_4 = 0;
              // var type_count_5 = 0;
              var type_count_6 = 0;
              var type_count_7 = 0;

              systemAppService.messageService.messageList = response.data.body.data;
              systemAppService.messageService.messageList.forEach(function(message) {
                switch (message.msgtype) {
                  // case "1":
                  //   type_count_1++;
                  //   break;
                  // case "2":
                  //   type_count_2++;
                  //   break;
                  // case "3":
                  //   type_count_3++;
                  //   break;
                  // case "4":
                  //   type_count_4++;
                  //   break;
                  // case "5":
                  //   type_count_5++;
                  //   break;
                  case "6":
                    type_count_6++;
                    break;
                  case "7":
                    type_count_7++;
                    break;
                }
              });

              // if (type_count_1) {
              //   $scope.message.items.push({
              //     msgtype: 1,
              //     msgtitle: '货源消息',
              //     count: type_count_1,
              //     url: '/logisInfo/goodsInfo?action=user'
              //   });
              // }
              // if (type_count_2) {
              //   $scope.message.items.push({
              //     msgtype: 2,
              //     msgtitle: '车源消息',
              //     count: type_count_2,
              //     url: '/logisInfo/carInfo?action=user'
              //   });
              // }
              // if (type_count_3) {
              //   $scope.message.items.push({
              //     msgtype: 3,
              //     msgtitle: '货源意向消息',
              //     count: type_count_3,
              //     url: '/orderForm/goodsManage'
              //   });
              // }
              // if (type_count_4) {
              //   $scope.message.items.push({
              //     msgtype: 4,
              //     msgtitle: '车源意向消息',
              //     count: type_count_4,
              //     url: '/orderForm/carManage'
              //   });
              // }
              // if (type_count_5) {
              //   $scope.message.items.push({
              //     msgtype: 5,
              //     msgtitle: '好友验证消息',
              //     count: type_count_5,
              //     url: '/opCenter/customersManage/messageValidate'
              //   });
              // }
              if (type_count_6) {
                $scope.message.items.push({
                  msgtype: 6,
                  msgtitle: '企业注册消息',
                  count: type_count_6,
                  url: '/opCenter/infoAudit/infoAuditEnterprise'
                });
              }
              if (type_count_7) {
                $scope.message.items.push({
                  msgtype: 7,
                  msgtitle: '发送客服消息',
                  count: type_count_7,
                  url: '/opCenter/clientCenter/platformMessage'
                });
              }
            }
            if ($scope.message.items.length == 0) {
              $scope.message.items.push({
                msgtype: 0,
                msgtitle: '暂无消息记录',
                count: 0,
                url: ''
              });
            }
          }
        });
      }
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  });
