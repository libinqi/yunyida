'use strict';

angular.module('starter.controllers').controller('DriverRegisterCtrl', function ($scope, $http, $timeout, $ionicHistory, $ionicLoading, $ionicPopover, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $state, UserInfo, loginService, CityPickerService, dictService, geolocationService) {
    $scope.userData = {
      phoneNumber: '', //手机
      userName: '', //用户名
      realName: '', //姓名
      userType: '', //用户类型(货主, 物流企业, 司机)
      password: '', //密码
      enterpriseName: '', //企业名称
      city: '',//市
      //street: '',//街道
      //address: '',//详细地址
      cityCode: '',//城市或者地址代码
      cardNumber: '',//证件号码
      drivingLicenseImage: '',//行驶证图片
      driverLicenseImage: '',//驾驶证图片
      carNumber: '',//车牌号码
      carType: '',//车型
      carLength: '',//车长
      carImage: '',//车辆图片
      lng: '',//经度
      lat: ''//纬度
    };
    $scope.carLengthList = [];

    $scope.$watch('userData.cityCode', function (oldValue, newValue) {
      if (oldValue && newValue) $scope.userData.street = '';
      if (!$scope.userData.cityCode) {
        dictService.street_data = [];
        return;
      }
      else {
        $scope.streetList = [];
      }

      $timeout(function () {
        $scope.streetList = CityPickerService.getStreetData($scope.userData.cityCode);
        dictService.street_data = [];

        for (var i = 0; i < $scope.streetList.length; i++) {
          dictService.street_data.push({id: $scope.streetList[i].id, name: $scope.streetList[i].areaName});
        }
      });
    });

    $scope.$watch('userData.carType', function (oldValue, newValue) {
      if (oldValue && newValue) $scope.userData.carLength = '';
      if (!$scope.userData.carType) {
        dictService.car_length = [];
        return;
      }
      else {
        $scope.carLengthList = [];
      }

      $timeout(function () {
        $scope.carLengthList = dictService.getDictItem('car_type', $scope.userData.carType).car_length;
        dictService.car_length = $scope.carLengthList;
      });
    });

    //geolocationService.getCurrentPosition(function (result) {
    //  $scope.userData.city = result.addressComponents.province.replace(/省/g, "")+result.addressComponents.city.replace(/市/g, "")+result.addressComponents.district;
    //  $scope.userData.street = result.addressComponents.street;
    //  $scope.userData.address = result.addressComponents.street + result.addressComponents.streetNumber;
    //  $scope.userData.lng = result.point.lng;
    //  $scope.userData.lat = result.point.lat;
    //});

    //window.LocationPlugin.getLocation(function (data) {
    //  //data.longitude 经度
    //  //data.latitude 纬度
    //  //data.province 省份
    //  //data.city 城市
    //  //data.cityCode 城市编码
    //  //data.district 区/县
    //  //data.street 街道
    //  //data.streetNumber 街道号码
    //  //data.address 文字描述的地址信息
    //  //data.hasRadius 是否有定位精度半径
    //  //data.radius 定位精度半径
    //  //data.type 定位方式
    //  $timeout(function () {
    //    var city = data.province.replace('省', '') + data.city.replace('市', '');
    //    if (data.district) {
    //      city += data.district;
    //    }
    //    //if (data.street) {
    //    //  $scope.userData.street = data.street;
    //    //}
    //    //if (data.streetNumber) {
    //    //  $scope.userData.address = data.streetNumber;
    //    //}
    //    $scope.userData.city = city;
    //    $scope.userData.lng = data.longitude;
    //    $scope.userData.lat = data.latitude;
    //  });
    //}, function (err) {
    //});

    $scope.formData = {
      validCode: '',
      securityCode: '',
      repassword: ''//重复密码
    };
    //$scope.formData.securityCode = '';
    $scope.flag = 1;
    $scope.wait = 60;
    $scope.validBtnText = '获取验证码';
    //$scope.formData.repassword = ''; //重复密码

    if (UserInfo.data) {
      $scope.userData = UserInfo.data;
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

    $scope.timeOut = function () {
      if ($scope.wait == 0) {
        $scope.flag = 1;
        $scope.validBtnText = "获取验证码";
        $scope.wait = 60;
      } else {
        $scope.flag = 0;
        $scope.validBtnText = $scope.wait + "秒后重发";
        $scope.wait--;
        $timeout(function () {
          $scope.timeOut();
        }, 1000);
      }
    }

    $scope.getValidCode = function () {
      var reg = /^1\d{10}$/;
      if (!$scope.userData.phoneNumber) {
        $scope.showMsg('手机号码不能为空');
        return false;
      } else if (!reg.test($scope.userData.phoneNumber)) {
        $scope.showMsg('手机号格式错误');
        return false;
      }
      io.socket.get('/user/checkIsExist', {
        userName: $scope.userData.phoneNumber
      }, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('手机号码已存在，请重新输入...');
        } else {
          io.socket.get('/user/getValidCode', {
            phoneNumber: $scope.userData.phoneNumber
          }, function serverResponded(body, JWR) {
            if (JWR.statusCode == 200) {
              $scope.formData.validCode = body.validCode;
              $scope.formData.securityCode = body.validCode;
              //console.log($scope.formData.validCode);
              $scope.timeOut();
            }
            else {
              $scope.showMsg('发送验证码失败，请重新获取...');
            }
          });
        }
      });
    }

    $scope.checkValidCode = function () {
      io.socket.get('/user/checkValidCode', {
        validCode: $scope.formData.securityCode,
        phoneNumber: $scope.userData.phoneNumber
      }, function serverResponded(body, JWR) {
        if (JWR.statusCode !== 200) {
          $scope.showMsg('验证码不正确，请重新输入...');
        }
      });
    }

    $scope.saveUserInfo = function () {
      var reg = /^1\d{10}$/;
      if (!$scope.userData.phoneNumber) {
        $scope.showMsg('手机号码不能为空');
        return false;
      } else if (!reg.test($scope.userData.phoneNumber)) {
        $scope.showMsg('手机号格式错误');
        return false;
      } else {
        $scope.userData.userName = $scope.userData.phoneNumber;
        io.socket.get('/user/checkIsExist', {
          userName: $scope.userData.phoneNumber
        }, function serverResponded(body, JWR) {
          if (JWR.statusCode !== 200) {
            $scope.showMsg('手机号码已存在，请重新输入...');
          } else {
            if (!$scope.formData.securityCode) {
              $scope.showMsg('验证码不能为空');
              return false;
            } else {
              io.socket.get('/user/checkValidCode', {
                validCode: $scope.formData.securityCode,
                phoneNumber: $scope.userData.phoneNumber
              }, function serverResponded(body, JWR) {
                if (JWR.statusCode !== 200) {
                  $scope.showMsg('验证码不正确，请重新输入...');
                } else {
                  if (!$scope.userData.password) {
                    $scope.showMsg('密码不能为空');
                    return false;
                  }
                  if (!$scope.formData.repassword) {
                    $scope.showMsg('确认密码不能为空');
                    return false;
                  }
                  if ($scope.userData.password !== $scope.formData.repassword) {
                    $scope.showMsg('密码和确认密码不一致');
                    return false;
                  }
                  UserInfo.save($scope.userData);
                  $state.go('register.register4');
                }
              });
            }
          }
        });
      }
    }


    var options = {
      title: '上传头像',
      buttonLabels: ['相册'],
      addCancelButtonWithLabel: '取消',
      androidEnableCancelButton: true,
      winphoneEnableCancelButton: true
    };

    $scope.upLoadDrivingImg = function () {
      $cordovaActionSheet.show(options)
        .then(function (btnIndex) {
          switch (btnIndex) {
            case 1:
              $scope.pickDrivingImg();
              break;
            default:
              break;
          }
        });
    };

    $scope.pickDrivingImg = function () {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };
      var server = io.sails.url + '/car/upload';
      var trustHosts = true;
      var option = {
        fileKey: "avatar"
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $cordovaFileTransfer.upload(server, results[0], option, trustHosts)
            .then(function (result) {
              $scope.showMsg('行驶证上传成功');
              $scope.userData.drivingLicenseImage = io.sails.url + '/car/avatar/' + result.response;
            }, function (err) {
              $scope.showMsg('行驶证上传失败，请重试');
            }, function (progress) {
              $ionicLoading.show({
                template: "正在上传行驶证..." + Math.round((progress.loaded / progress.total) * 100) + '%'
              });
              if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
                $ionicLoading.hide();
              }
            });
        }, function (error) {
          $scope.showMsg('行驶证上传失败，请重试');
        });
    };

    $scope.upLoadDriverImg = function () {
      $cordovaActionSheet.show(options)
        .then(function (btnIndex) {
          switch (btnIndex) {
            case 1:
              $scope.pickDriverImg();
              break;
            default:
              break;
          }
        });
    };

    $scope.pickDriverImg = function () {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };
      var server = io.sails.url + '/car/upload';
      var trustHosts = true;
      var option = {
        fileKey: "avatar"
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $cordovaFileTransfer.upload(server, results[0], option, trustHosts)
            .then(function (result) {
              $scope.showMsg('驾驶证上传成功');
              $scope.userData.driverLicenseImage = io.sails.url + '/car/avatar/' + result.response;
            }, function (err) {
              $scope.showMsg('驾驶证上传失败，请重试');
            }, function (progress) {
              $ionicLoading.show({
                template: "正在上传驾驶证..." + Math.round((progress.loaded / progress.total) * 100) + '%'
              });
              if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
                $ionicLoading.hide();
              }
            });
        }, function (error) {
          $scope.showMsg('驾驶证上传失败，请重试');
        });
    };


    $scope.upLoadCarImg = function () {
      $cordovaActionSheet.show(options)
        .then(function (btnIndex) {
          switch (btnIndex) {
            case 1:
              $scope.pickCarImg();
              break;
            default:
              break;
          }
        });
    };

    $scope.pickCarImg = function () {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };
      var server = io.sails.url + '/car/upload';
      var trustHosts = true;
      var option = {
        fileKey: "avatar"
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          $cordovaFileTransfer.upload(server, results[0], option, trustHosts)
            .then(function (result) {
              $scope.showMsg('车辆照片上传成功');
              $scope.userData.carImage = io.sails.url + '/car/avatar/' + result.response;
            }, function (err) {
              $scope.showMsg('车辆照片上传失败，请重试');
            }, function (progress) {
              $ionicLoading.show({
                template: "正在上传车辆照片..." + Math.round((progress.loaded / progress.total) * 100) + '%'
              });
              if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
                $ionicLoading.hide();
              }
            });
        }, function (error) {
          $scope.showMsg('车辆照片上传失败，请重试');
        });
    };


    $scope.saveDriverInfo = function () {
      if (!$scope.userData.realName) {
        $scope.showMsg('姓名不能为空');
        return false;
      }
      if (!$scope.userData.cardNumber) {
        $scope.showMsg('身份证号码不能为空');
        return false;
      }
      if (!$scope.userData.carNumber) {
        $scope.showMsg('车牌号不能为空');
        return false;
      }
      if (!$scope.userData.city) {
        $scope.showMsg('所在城市不能为空');
        return false;
      }
      if (!$scope.userData.drivingLicenseImage) {
        $scope.showMsg('请上传行驶证图片');
        return false;
      }
      if (!$scope.userData.driverLicenseImage) {
        $scope.showMsg('请上驾驶证图片图片');
        return false;
      }

      $ionicLoading.show({
        template: "正在注册..."
      });
      $scope.userData.userType = '司机';
      io.socket.post('/driver/register', $scope.userData, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          loginService.userLogin($scope.userData.phoneNumber, $scope.userData.password, function (data) {
            for (var p in UserInfo.data) {
              UserInfo.remove(p);
            }
            if (typeof(data) == "object") {
              UserInfo.save(data);
              $state.go('tab.index');
            } else {
              $state.go('login');
            }
          });
        }
      });
    }
  }
);
