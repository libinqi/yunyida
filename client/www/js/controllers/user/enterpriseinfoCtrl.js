'use strict';

angular.module('starter.controllers').controller('EnterPriseInfoCtrl', function ($scope, $http, $timeout, $ionicLoading, $ionicHistory, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $state, $stateParams, Userinfo, loginService) {
  $scope.userData = {
    userid: '', //用户id
    phone: '', //手机
    realname: '', //姓名
    email: '' //电子邮箱
  };

  $scope.enterpriseData = {
    enterpriseid: '', //企业Id
    enterprisename: '', //企业名称
    contactname: '', //联系人
    location: '', //企业地址
    telephonenumber: '', //企业电话
    logourl: '' //企业logo
  };

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

  $scope.getEnterpriseInfo = function () {
    $http.get(ApiUrl + '/ws/system/sysEnterprise/queryEnterpriseByUserid/' + Userinfo.data.userid)
      .success(function (data) {
        if (data.body) {
          $scope.enterpriseData.enterpriseid = data.body.enterpriseid;
          $scope.enterpriseData.enterprisename = data.body.enterprisename;
          $scope.enterpriseData.contactname = data.body.contactname;
          $scope.enterpriseData.location = data.body.location;
          $scope.enterpriseData.telephonenumber = data.body.telephonenumber;

          if (!data.body.logourl || data.body.logourl == 'null') {
            $scope.enterpriseData.logourl = 'img/upload_image.png';
          } else {
            $scope.enterpriseData.logourl = data.body.logourl || 'img/upload_image.png';
          }
        }
      });
  }
  $scope.getEnterpriseInfo();

  $scope.saveEnterpriseInfo = function () {
    var input = false;
    if ($scope.enterpriseData.contactname) {
      input = true;
    }
    if ($scope.enterpriseData.telephonenumber) {
      input = true;
    }
    if ($scope.enterpriseData.location) {
      input = true;
    }
    if ($scope.enterpriseData.logourl) {
      input = true;
    }
    if (!input) {
      $scope.showMsg('请输入要更新的内容');
      return false;
    }
    $ionicLoading.show({
      template: "正在更新企业信息..."
    });
    $http.post(ApiUrl + '/ws/system/sysEnterprise/update', $scope.enterpriseData)
      .success(function (data) {
        $ionicLoading.hide();
        if (!data.body) {
          $scope.showMsg(data.msg);
        } else {
          $scope.showMsg('更新成功');
        }
      }).error(function (data, status, headers, config) {
      $scope.showMsg('请求失败,网络不给力！');
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

});
