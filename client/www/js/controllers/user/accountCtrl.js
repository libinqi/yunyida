'use strict';

angular.module('starter.controllers').controller('AccountCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, $stateParams, UserInfo, loginService) {
  $scope.userData = {
    userId: '', //用户id
    cardNumber: '', //证件号码
    realName: '', //姓名
    email: '', //电子邮箱
    enterpriseName: '', //企业名称
    city: '',//市
    street: '',//街道
    address: ''//详细地址
  };

  $scope.changePwdData = {
    userid: '', //用户id
    oldpassword: '', //老密码
    newpassword: '' //新密码
  }

  $scope.backGo = function () {
    $ionicHistory.goBack();
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

  $scope.getUserInfo = function () {
    io.socket.get('/user/' + UserInfo.data.userId, function serverResponded(body, JWR) {
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.userData.userId = body.userId;
        $scope.userData.cardNumber = body.cardNumber;
        $scope.userData.realName = body.realName;
        $scope.userData.email = body.email;
        $scope.userData.enterpriseName = body.enterpriseName;
        $scope.userData.city = body.city;
        $scope.userData.street = body.street;
        $scope.userData.address = body.address;
      }
    });
  }

  $scope.getUserInfo();

  $scope.saveUserInfo = function () {
    if (!$scope.userData.realName) {
      $scope.showMsg('请填写真实姓名');
      return false;
    }
    if (!$scope.userData.cardNumber) {
      $scope.showMsg('请填写身份证号码');
      return false;
    }
    if (!$scope.userData.enterpriseName) {
      $scope.showMsg('请填写企业名称');
      return false;
    }
    if (!$scope.userData.city) {
      $scope.showMsg('请选择所在城市');
      return false;
    }
    if (!$scope.userData.street) {
      $scope.showMsg('请选择所属街道');
      return false;
    }
    $ionicLoading.show({
      template: "正在更新个人资料..."
    });

    io.socket.post('/user/update', $scope.userData, function serverResponded(body, JWR) {
      $ionicLoading.hide();
      if (JWR.statusCode !== 200) {
        $scope.showMsg('请求失败,网络不给力！');
      }
      else {
        $scope.showMsg('更新成功');
      }
    });
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
    var server = ApiUrl + '/ws/system/fastdfs/upload';
    var trustHosts = true
    var option = {};

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        $cordovaFileTransfer.upload(server, results[0], option, true)
          .then(function (result) {
            $scope.showMsg('企业Logo更新成功');
            $scope.enterpriseData.logourl = JSON.parse(result.response).body;
            $http.post(ApiUrl + '/ws/system/sysEnterprise/update', {
                enterpriseid: $scope.enterpriseData.enterpriseid,
                logourl: $scope.enterpriseData.logourl
              })
              .success(function (data) {
                if (!data.body) {
                  alert('上传失败，请重试');
                } else {
                  $scope.getEnterpriseInfo();
                }
              });
          }, function (err) {
            alert('上传失败，请重试');
          }, function (progress) {
            $ionicLoading.show({
              template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
            });
            if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
              $ionicLoading.hide();
            }
          });
      }, function (error) {
        alert('上传失败，请重试');
      });
  };

  $scope.cameraImg = function () {
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
    $cordovaCamera.getPicture(options).then(function (imageData) {
      $cordovaFileTransfer.upload(server, "data:image/jpeg;base64," + imageData, option, true)
        .then(function (result) {
          $scope.userInfo.image = JSON.parse(result.response).body;
          $scope.showMsg('企业Logo更新成功');
          $scope.enterpriseData.logourl = JSON.parse(result.response).body;
          $http.post(ApiUrl + '/ws/system/sysEnterprise/update', {
              enterpriseid: $scope.enterpriseData.enterpriseid,
              logourl: $scope.enterpriseData.logourl
            })
            .success(function (data) {
              if (!data.body) {
                alert('上传失败，请重试');
              } else {
                $scope.getEnterpriseInfo();
              }
            });
        }, function (err) {
          alert('上传失败，请重试');
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
      alert('上传失败，请重试');
    });
  };

  $scope.changePwd = function () {
    if (!$scope.changePwdData.oldpassword) {
      $scope.showMsg('原始密码不能为空');
      return false;
    }
    if (!$scope.changePwdData.newpassword) {
      $scope.showMsg('新密码不能为空');
      return false;
    }
    $scope.changePwdData.userid = UserInfo.data.userid;
    $ionicLoading.show({
      template: "正在修改密码..."
    });
    $http.post(ApiUrl + '/ws/system/sysUser/changePwd', $scope.changePwdData)
      .success(function (data) {
        $ionicLoading.hide();
        if (data.code != '200') {
          $scope.showMsg(data.msg);
        } else {
          $scope.showMsg('密码修改成功');
        }
      }).error(function (data, status, headers, config) {
      $scope.showMsg('请求失败,网络不给力！');
    });
  }

});
