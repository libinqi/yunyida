'use strict';

angular.module('starter.controllers').controller('UserCtrl', function($scope, $state, $http, $timeout, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, Userinfo) {
  $scope.pulltextchange = '下拉刷新';
  $scope.userInfo = Userinfo.data;

  $scope.doRefresh = function() {
    $http.get(ApiUrl + '/ws/system/sysUser/queryById/' + Userinfo.data.userid)
      .success(function(data) {
        if (data.body) {
          if (!data.body.image || data.body.image == 'null') {
            $scope.userInfo.image = 'img/default-ava.png';
          } else {
            $scope.userInfo.image = data.body.image || 'img/default-ava.png';
          }
          //头像缓存问题
          // if (!window.localStorage['avatar_img']) {
          //   var avatarImg = data.body.image ? data.body.image : 'img/default-ava.png';
          //   Userinfo.addLong('avatar_img', data.body.image);
          // } else {
          //   $scope.userInfo.image = window.localStorage['avatar_img'];
          // }
        }
      });
    $scope.$broadcast("scroll.refreshComplete");
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.doRefresh();

  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  }

  $scope.pulltext = function() {
    $timeout(function() {
      $scope.pulltextchange = '快速找车、发货';
    })
  };

  $scope.goTo = function(id) {
    switch (id) {
      case 1:
        $state.go('userinfo');
        break;
      case 2:
        $state.go('enterpriseinfo');
        break;
      case 3:
        $state.go('message');
        break;
      case 4:
        $state.go('passwordinfo');
        break;
      default:
        break;
    }
  }


  var options = {
    title: '上传头像',
    buttonLabels: ['相册', '相机'],
    addCancelButtonWithLabel: '取消',
    androidEnableCancelButton: true,
    winphoneEnableCancelButton: true
  };
  $scope.upLoadImg = function() {
    $cordovaActionSheet.show(options)
      .then(function(btnIndex) {
        switch (btnIndex) {
          case 1:
            $scope.pickImg();
            break;
          case 2:
            $scope.cameraImg();
            break;
          default:
            break;
        }
      });
  };

  $scope.pickImg = function() {
    var options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
    };
    var server = ApiUrl + '/ws/system/fastdfs/upload';
    var trustHosts = true
    var option = {};

    $cordovaImagePicker.getPictures(options)
      .then(function(results) {
        $cordovaFileTransfer.upload(server, results[0], option, true)
          .then(function(result) {
            $scope.showMsg('头像更新成功');
            $scope.userInfo.image = JSON.parse(result.response).body;
            $http.post(ApiUrl + '/ws/system/sysUser/saveOrUpdate', {
                userid: $scope.userInfo.userid,
                image: $scope.userInfo.image
              })
              .success(function(data) {
                if (!data.body) {
                  alert('上传失败，请重试');
                } else {
                  $scope.doRefresh();
                }
              });
          }, function(err) {
            alert('上传失败，请重试');
          }, function(progress) {
            $ionicLoading.show({
              template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
            });
            if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
              $ionicLoading.hide();
            }
          });
      }, function(error) {
        alert('上传失败，请重试');
      });
  };

  $scope.cameraImg = function() {
    var server = ApiUrl + '/ws/system/fastdfs/upload';
    var trustHosts = true
    var option = {};
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $cordovaFileTransfer.upload(server, "data:image/jpeg;base64," + imageData, option, true)
        .then(function(result) {
          $scope.userInfo.image = JSON.parse(result.response).body;
          $scope.showMsg('头像更新成功');
          $http.post(ApiUrl + '/ws/system/sysUser/saveOrUpdate', {
              userid: $scope.userInfo.userid,
              image: $scope.userInfo.image
            })
            .success(function(data) {
              if (!data.body) {
                alert('上传失败，请重试');
              } else {
                $scope.doRefresh();
              }
            });
        }, function(err) {
          alert('上传失败，请重试');
        }, function(progress) {
          $ionicLoading.show({
            template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
          });
          if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
            $ionicLoading.hide();
          };
        });
    }, function(err) {
      alert('上传失败，请重试');
    });
  };

  $scope.exit = function() {
    for (var p in Userinfo.data) {
      Userinfo.remove(p);
    }
    $state.go('start');
  }

});
