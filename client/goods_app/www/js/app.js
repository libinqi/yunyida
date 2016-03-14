// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-citydata', 'ionic-citypicker', 'ionic-dictpicker', 'angularMoment'])
  .run(function ($ionicPlatform, $ionicPopup, $location, $rootScope, $ionicHistory, $cordovaToast, $cordovaAppVersion, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2, $ionicLoading, $http, $timeout, amMoment, dictService) {
    $ionicPlatform.ready(function () {
      // set moment locale
      amMoment.changeLocale('zh-cn');
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      //隐藏启动画面
      setTimeout(function () {
        navigator.splashscreen.hide();
      }, 500);

      // 所在地定位
      //geolocationService.getCurrentPosition();
      $rootScope.dictService = dictService;

      //启动极光推送服务
      window.plugins.jPushPlugin.init();
      //调试模式
      //window.plugins.jPushPlugin.setDebugMode(true);

      window.plugins.jPushPlugin.openNotificationInAndroidCallback = function (data) {
        window.location.href = '#/tab/order?refresh=true';
      }
      if (ionic.Platform.isAndroid()) {
        //检查更新
        checkUpdate();
      }

      function checkUpdate() {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          $http.get('http://www.yunyida56.com/assets/version.json').success(function (data) {
            if (data && version != data.goodsapp.version) {
              showUpdateConfirm(data.goodsapp.url);
            }
          })
        });
      }

      function showUpdateConfirm(url) {
        var confirmPopup = $ionicPopup.confirm({
          title: '有新版本了！是否要升级？',
          buttons: [
            {
              text: '下一次', onTap: function (e) {
              return false;
            }
            },
            {
              text: '确定', type: 'button-assertive', onTap: function (e) {
              return true;
            }
            }
          ]
        });
        var url = url; //可以从服务端获取更新APP的路径
        confirmPopup.then(function (res) {
          if (res) {
            $ionicLoading.show({
              template: "已经下载：0%"
            });
            var targetPath = "file:///storage/sdcard0/Download/goods_app.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            var trustHosts = true
            var options = {};
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
              // 打开下载下来的APP
              $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
              ).then(function () {
                // 成功
              }, function (err) {
                // 错误
              });
              $ionicLoading.hide();
            }, function (err) {
              $ionicLoading.show({template: '下载失败！', noBackdrop: true, duration: 2000});
            }, function (progress) {
              //进度，这里使用文字显示下载百分比
              $timeout(function () {
                var downloadProgress = (progress.loaded / progress.total) * 100;
                $ionicLoading.show({
                  template: "已经下载：" + Math.floor(downloadProgress) + "%"
                });
                if (downloadProgress > 99) {
                  $ionicLoading.hide();
                }
              })
            });
          }
        });
      }

    });

    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/tab/index' || $location.path() == '/login') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortTop('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortTop('再按一次退出系统');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);


    //主页面显示退出提示框
    //$ionicPlatform.registerBackButtonAction(function (e) {
    //  e.preventDefault();
    //  function showConfirm() {
    //    var confirmPopup = $ionicPopup.confirm({
    //      title: '<strong>退出应用?</strong>',
    //      template: '你确定要退出应用吗?',
    //      okText: '退出',
    //      cancelText: '取消'
    //    });
    //
    //    confirmPopup.then(function (res) {
    //      if (res) {
    //        ionic.Platform.exitApp();
    //      } else {
    //        // Don't close
    //      }
    //    });
    //  }
    //
    //  // Is there a page to go back to?
    //  if ($location.path() == '/index') {
    //    showConfirm();
    //  } else if ($rootScope.$viewHistory.backView) {
    //    console.log('currentView:', $rootScope.$viewHistory.currentView);
    //    // Go back in history
    //    $rootScope.$viewHistory.backView.go();
    //  } else {
    //    // This is the last page: Show confirmation popup
    //    showConfirm();
    //  }
    //
    //  return false;
    //}, 1000);
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $httpProvider.defaults.timeout = 5000;
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl'
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.index', {
        url: '/index',
        cache: 'false',
        views: {
          'tab-index': {
            cache: 'false',
            templateUrl: 'templates/goods/add.html',
            controller: 'AddGoodsCtrl'
          }
        }
      })

      .state('welcome', {
        url: '/welcome',
        abstract: true,
        templateUrl: 'templates/welcome/welcome.html',
        controller: 'Welcome'
      })

      .state('welcome.w_page', {
        url: '/w_page',
        views: {
          'welcome': {
            templateUrl: 'templates/welcome/w_page.html',
            controller: 'Welcome'
          }
        }
      })

      .state('tab.user', {
        url: '/user',
        cache: 'false',
        views: {
          'tab-user': {
            cache: 'false',
            templateUrl: 'templates/tab-user.html',
            controller: 'UserCtrl'
          }
        }
      })

      .state('register', {
        url: '/register',
        abstract: true,
        templateUrl: "templates/user/register.html",
        controller: "UserRegisterCtrl"
      })

      .state('register.register1', {
        url: '/register1',
        cache: 'false',
        views: {
          'register': {
            templateUrl: 'templates/user/register1.html',
            controller: 'UserRegisterCtrl'
          }
        }
      })

      .state('register.register2', {
        url: '/register2',
        cache: 'false',
        views: {
          'register': {
            templateUrl: 'templates/user/register2.html',
            controller: 'UserRegisterCtrl'
          }
        }
      })

      .state('backstep', {
        url: "/step",
        templateUrl: "templates/user/getbackpwd.html",
        controller: "ChangePWDCtrl"
      })

      .state('account', {
        url: '/account',
        templateUrl: 'templates/user/account.html',
        controller: 'AccountCtrl',
        cache: 'false'
      })

      .state('userGoodsAddress', {
        url: '/userGoodsAddress',
        templateUrl: 'templates/user/userGoodsAddress.html',
        controller: 'UserGoodsAddressCtrl'
      })
      .state('receiveGoodsAddress', {
        url: '/receiveGoodsAddress',
        templateUrl: 'templates/user/receiveGoodsAddress.html',
        controller: 'ReceiveGoodsAddressCtrl'
      })
      .state('userSetting', {
        url: '/userSetting',
        templateUrl: 'templates/user/userSetting.html',
        controller: 'UserSettingCtrl'
      })
      .state('invitation', {
        url: '/invitation',
        templateUrl: 'templates/user/invitation.html',
        controller: 'InvitationCtrl'
      })
      .state('passwordInfo', {
        url: '/passwordInfo',
        cache: 'false',
        templateUrl: 'templates/user/passwordInfo.html',
        controller: 'PassWordInfoCtrl'
      })
      .state('message', {
        url: '/message',
        templateUrl: 'templates/user/message.html',
        controller: 'MessageCtrl'
      })

      .state('addgoods', {
        url: '/addgoods',
        cache: 'false',
        templateUrl: 'templates/goods/add.html',
        controller: 'AddGoodsCtrl'
      })
      .state('tab.order', {
        url: '/order',
        cache: 'false',
        views: {
          'tab-order': {
            cache: 'false',
            templateUrl: 'templates/order/allOrder.html',
            controller: 'AllOrderCtrl',
            abstract: true
          }
        }
      })
      .state('orderdetail', {
        url: '/orderdetail/:data',
        templateUrl: 'templates/order/allOrderDetail.html',
        controller: 'AllOrderDetailCtrl'
      })


    // if none of the above states are matched, use this as the fallback
    // console.log(!window.localStorage['first']);
    //if (!window.localStorage['first']) {
    //  $urlRouterProvider.otherwise('/welcome/w_page');
    //} else {
    //  $urlRouterProvider.otherwise('/tab/index');
    //}
    //
    $urlRouterProvider.otherwise('/tab/index');
  });
