'use strict';

angular.module('starter.controllers').controller('UserCtrl', function ($scope, $state, $http, $timeout, $ionicPopover, $ionicLoading, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, UserInfo) {
  $scope.pulltextchange = '下拉刷新';
  $scope.userInfo = UserInfo.data;

  $scope.doRefresh = function () {
    io.socket.get('/user/' + UserInfo.data.userId, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.userInfo.image = 'img/default-ava.png';
      }
      else {
        $scope.userInfo.image = io.sails.url +'/user/avatar/'+body.logo || 'img/default-ava.png';
      }
      //头像缓存问题
      // if (!window.localStorage['avatar_img']) {
      //   var avatarImg = data.body.image ? data.body.image : 'img/default-ava.png';
      //   UserInfo.addLong('avatar_img', data.body.image);
      // } else {
      //   $scope.userInfo.image = window.localStorage['avatar_img'];
      // }
    });

    $scope.$broadcast("scroll.refreshComplete");
    $scope.pulltextchange = '下拉刷新';
  };

  $scope.doRefresh();

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

  $scope.pulltext = function () {
    $timeout(function () {
      $scope.pulltextchange = '快速发货';
    })
  };

  $scope.goTo = function (id) {
    switch (id) {
      case 1:
        $state.go('account');
        break;
      case 2:
        $state.go('enterpriseinfo');
        break;
      case 3:
        $state.go('message');
        break;
      case 4:
        $state.go('passwordInfo');
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
  $scope.upLoadImg = function () {
    $cordovaActionSheet.show(options)
      .then(function (btnIndex) {
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

  $scope.pickImg = function () {
    var options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
    };
    var server = io.sails.url + '/user/uploadAvatar';
    var trustHosts = true;
    var option = {
      fileKey: "avatar"
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        $cordovaFileTransfer.upload(server, results[0], option, trustHosts)
          .then(function (result) {
            $scope.showMsg('头像更新成功');
            $scope.userInfo.logo = result.response;
            io.socket.post('/user/update', {
              userId: $scope.userInfo.userId,
              logo: $scope.userInfo.logo
            }, function serverResponded(body, JWR) {
              $ionicLoading.hide();
              if (JWR.statusCode !== 200) {
                $scope.showMsg('上传失败，请重试');
              }
              else {
                $scope.doRefresh();
              }
            });
          }, function (err) {
            $scope.showMsg('上传失败，请重试');
          }, function (progress) {
            $ionicLoading.show({
              template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
            });
            if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
              $ionicLoading.hide();
            }
          });
      }, function (error) {
        $scope.showMsg('上传失败，请重试');
      });
  };

  $scope.cameraImg = function () {
    var server = io.sails.url + '/user/uploadAvatar';
    var trustHosts = true;
    var option = {
      fileKey: "avatar"
    };
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      mediaType:Camera.MediaType.PICTURE,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function (imageData) {
      $cordovaFileTransfer.upload(server, "data:image/jpeg;base64," + imageData, option, true)
        .then(function (result) {
          $scope.showMsg('头像更新成功');
          $scope.userInfo.logo = result.response;
          io.socket.post('/user/update', {
            userId: $scope.userInfo.userId,
            logo: $scope.userInfo.logo
          }, function serverResponded(body, JWR) {
            $ionicLoading.hide();
            if (JWR.statusCode !== 200) {
              $scope.showMsg('上传失败，请重试');
            }
            else {
              $scope.doRefresh();
            }
          });
        }, function (err) {
          $scope.showMsg('上传失败，请重试');
        }, function (progress) {
          $ionicLoading.show({
            template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
          });
          if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
            $ionicLoading.hide();
          }
          ;
        });
    }, function (err) {
      $scope.showMsg('上传失败，请重试');
    });
  };

});
