angular.module('starter.controllers').controller('chooseGoodsCtrl', function ($scope, $state, $stateParams, loginService, UserInfo, $ionicListDelegate, $timeout, $ionicPopover, $ionicHistory, $http) {
  var user = UserInfo.data;

  var vm = this;
  vm.querydata = {
    page: 1,
    rows: 8,
    placeOfDeparture: '',
    destination: '',
    issuerUserId: user.userid,
    order: 'issueDateTime',
    sort: 'DESC'
    // issuerEnterpriseId:user.datasource
  };

  $scope.carinfo = {
    id: ''
  };


  $scope.showMsg = function (txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function () {
      $scope.popover.hide();
    }, 1000);
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
  };

  //下拉刷新
  $scope.doRefresh = function () {
    $scope.items = [];
    vm.querydata.page = 1;
    $scope.load_over = false;
    $scope.loadMore();
    // 停止广播ion-refresher
    $scope.$broadcast('scroll.refreshComplete');
    $scope.pulltextchange = '下拉刷新';

  };
  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '快速刷新货源';
    })
  };
  //更多
  $scope.items = [];
  $scope.load_over = true;
  $scope.loadMore = function () {
    $scope.load_over = false;
    $timeout(function () {
      vm.querydata.status = null;
      loginService.getPendingList(vm.querydata).then(function (response) {
        if (response.data.code == "200") {
          if (vm.querydata.page > response.data.body.totalPage) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(response.data.body.data);
          vm.querydata.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $scope.load_over = true;
        } else {
        }
      });
    }, 200);
  };


  //确定托运
  $scope.confirm = function () {
    if (!$scope.carinfo.id) {
      $scope.showMsg('请选择一个货源！');
      return;
    }
    vm.carIntention = {
      goodsId: $scope.carinfo.id, //意向人所选择的货源ID
      vehicleResId: $stateParams.data, //车源ID
      intentionUserId: user.userid, //意向人ID
      intentionEnterpriseId: user.enterpriseid, //意向人所在企业ID
      remark: '', //留言
      intentionStatus: 0 //数据来源
    };
    loginService.pushCarIntention(vm.carIntention).then(function (response) {
      if (response.data && response.data.code == "200") {
        $scope.showMsg('托运成功，等待确认');
        $ionicHistory.goBack();
      } else {

      }
    });


  }


})
