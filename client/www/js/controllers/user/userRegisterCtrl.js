'use strict';

angular.module('starter.controllers').controller('UserRegisterCtrl', function ($scope, $http, $timeout, $ionicHistory, $ionicLoading, $ionicPopover, $state, UserInfo, loginService, geolocationService) {
    //$scope.userData = {
    //  phoneNumber: '', //手机
    //  username: '', //用户名
    //  securitycode: '', //验证码
    //  password: '', //密码
    //  repassword: '', //重复密码
    //  usertype: 2, //用户类型(3:企业用户 2:货主用户 1:司机用户 0:普通用户)
    //  enterprisename: '', //企业名称
    //  contactname: '', //联系人
    //  location: '', //企业地址
    //  telephoneNumbernumber: '', //企业电话
    //  enterprisekind: 2 // 企业类型（3：物流企业 2：货主企业）
    //};

    $scope.userData = {
      phoneNumber: '', //手机
      userName: '', //用户名
      realName: '', //姓名
      userType: '', //用户类型(货主, 物流企业, 司机)
      password: '', //密码
      enterpriseName: '', //企业名称
      province: '',//省
      city: '',//市
      area: '',//区,县
      street: '',//街道
      address: '',//详细地址
      cityCode: '',//城市或者地址代码
      cardNumber: '',//证件号码
      lng: '',//经度
      lat: ''//纬度
    };

    geolocationService.getCurrentPosition(function (result) {
      $scope.userData.province = result.addressComponents.province;
      $scope.userData.province = $scope.userData.province.replace(/省/g, "");
      $scope.userData.city = result.addressComponents.city;
      $scope.userData.city = $scope.userData.city.replace(/市/g, "");
      $scope.userData.area = result.addressComponents.district;
      $scope.userData.street = result.addressComponents.street;
      $scope.userData.address = result.addressComponents.street + result.addressComponents.streetNumber;
      $scope.location = $scope.userData.province + $scope.userData.city + $scope.userData.area;

      $scope.userData.lng = result.point.lng;
      $scope.userData.lat = result.point.lat;
    });

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
              console.log($scope.formData.validCode);
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
                  $state.go('register.register2');
                }
              });
            }
          }
        });
      }
    }

    $scope.saveEnterpriseInfo = function () {
      if (!$scope.userData.realName) {
        $scope.showMsg('姓名不能为空');
        return false;
      }
      if (!$scope.userData.cardNumber) {
        $scope.showMsg('身份证号码不能为空');
        return false;
      }
      if (!$scope.location) {
        $scope.showMsg('所在城市不能为空');
        return false;
      }
      $ionicLoading.show({
        template: "正在注册..."
      });
      $scope.userData.userType='货主';
      io.socket.post('/user/register', $scope.userData, function serverResponded(body, JWR) {
        $ionicLoading.hide();
        if (JWR.statusCode !== 200) {
          $scope.showMsg('请求失败,网络不给力！');
        }
        else {
          loginService.userLogin($scope.userData.phoneNumber, $scope.userData.password, function (data) {
            for (var p in UserInfo.data) {
              Userinfo.remove(p);
            }
            if (typeof(data) == "object") {
              Userinfo.save(data);
              $state.go('tab.index');
            } else {
              $state.go('start');
            }
          });
        }
      });
    }
  }
);
