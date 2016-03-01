"use strict";
var app = angular.module('ionic-citypicker', ['ionic']);
app.directive('ionicCityPicker', ['$ionicPopup', '$timeout', 'CityPickerService', '$ionicScrollDelegate', '$ionicModal', function ($ionicPopup, $timeout, CityPickerService, $ionicScrollDelegate, $ionicModal) {
  return {
    restrict: 'AE',
    // scope: true,
    template: '<input type="text"  placeholder={{vm.placeholder}} ng-model="citydata"  class={{vm.cssClass}} readonly>',
    scope: {
      citydata: '=',
      citycode: '=',
      backdrop: '@',
      backdropClickToClose: '@',
      buttonClicked: '&'
    },
    link: function (scope, element, attrs) {
      var vm = scope.vm = {}, citypickerModel = null;
      //根据城市数据来 设置Handle。
      vm.provinceHandle = "provinceHandle" + attrs.citydata;
      vm.cityHandle = "cityHandle" + attrs.citydata;
      vm.countryHandle = "countryHandle" + attrs.citydata;
      vm.placeholder = attrs.placeholder || "请选择城市";
      vm.okText = attrs.oktext || "确定";
      vm.cancelText = attrs.canceltext || "取消";
      vm.cssClass = attrs.cssClass;
      vm.barCssClass = attrs.barCssClass || "bar-custom";
      vm.backdrop = scope.$eval(scope.backdrop) || false;
      vm.backdropClickToClose = scope.$eval(scope.backdropClickToClose) || false;
      vm.cityData = CityPickerService.cityList;
      vm.selectCity = scope.citydata || "";
      vm.selectCityCode = scope.citycode || "";
      vm.isQuan = attrs.isquan || false;//是否支持全国选择

      if (vm.isQuan) {
        vm.cityData.unshift(
          {
            "id": "0",
            "areaName": "全国",
            "parentId": "0",
            "shortName": "全国",
            "lng": "0",
            "lat": "0",
            "level": 1,
            "sort": 0,
            "sub": []
          }
        );
      }

      // vm.tag=attrs.tag || "-";
      vm.returnok = function () {
        citypickerModel && citypickerModel.hide();
        scope.citydata = vm.selectCity;
        scope.citycode = vm.selectCityCode;
        scope.buttonClicked && scope.buttonClicked();
      }
      vm.ClickToClose = function () {
        vm.backdropClickToClose && citypickerModel && citypickerModel.hide();
      }
      vm.getData = function (name) {
        $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
        $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新
        switch (name) {
          case 'province':
            if (!vm.cityData) return false;
            var province = true, length = vm.cityData.length, Handle = vm.provinceHandle, HandleChild = vm.cityHandle;
            break;
          case 'city':
            if (!vm.province.sub) return false;
            var city = true, length = vm.province.sub.length, Handle = vm.cityHandle, HandleChild = vm.countryHandle;
            break;
          case 'country':
            if (!vm.city.sub) return false;
            var country = true, Handle = vm.countryHandle, length = vm.city.sub.length;
            break;
        }
        var top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top;//当前滚动位置
        var index = Math.round(top / 36);
        if (index < 0) index = 0;//iOS bouncing超出头
        if (index > length - 1) index = length - 1;//iOS bouncing超出尾
        if (top === index * 36) {
          vm.dataing = $timeout(function () {
            province && (vm.province = vm.cityData[index], vm.city = vm.province.sub[0], vm.country = {}, (vm.city && vm.city.sub && (vm.country = vm.city.sub[0])));//处理省市乡联动数据
            city && (vm.city = vm.province.sub[index], vm.country = {}, (vm.city && vm.city.sub && (vm.country = vm.city.sub[0])));//处理市乡联动数据
            country && (vm.country = vm.city.sub[index]);//处理乡数据
            HandleChild && $ionicScrollDelegate.$getByHandle(HandleChild).scrollTop();//初始化子scroll top位

            //数据同步
            if (vm.city) {
              (vm.city && vm.city.sub && vm.city.sub.length > 0) ? (vm.selectCity = vm.province.shortName + vm.city.shortName + vm.country.areaName ) : (vm.selectCity = vm.province.shortName + vm.city.shortName);
              (vm.city && vm.city.sub && vm.city.sub.length > 0) ? (vm.selectCityCode = vm.country.id) : (vm.selectCityCode = vm.city.id);
            }
            else {
              (vm.province && vm.province.sub == 0) ? (vm.selectCity = vm.province.shortName) : (vm.selectCity = "");
              (vm.province && vm.province.sub == 0) ? (vm.selectCityCode = vm.province.id) : (vm.selectCityCode = "");
            }
            if (vm.selectCity.indexOf("不限") > 0) {
              vm.selectCity = vm.selectCity.replace('不限', '');
            }
          }, 150)
        } else {
          vm.scrolling = $timeout(function () {
            $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, index * 36, true);
          }, 150)
        }

      }
      element.on("click", function () {
        //零时处理 点击过之后直接显示不再创建
        //$ionicBackdrop.retain();
        if (!attrs.checked) {
          citypickerModel && citypickerModel.remove();
        } else {
          citypickerModel && citypickerModel.show();
          return
        }
        attrs.checked = true;
        $ionicModal.fromTemplateUrl('templates/public/city-picker-modal.html', {
          scope: scope,
          animation: 'slide-in-up',
          backdropClickToClose: vm.backdropClickToClose
        }).then(function (modal) {
          citypickerModel = modal;
          //初始化 先获取数据后展示
          $timeout(function () {
            vm.getData('province');
            citypickerModel.show();
          }, 100)
        })
      })
      //销毁模型
      scope.$on('$destroy', function () {
        citypickerModel && citypickerModel.remove();
      });
    }
  }
}]);
