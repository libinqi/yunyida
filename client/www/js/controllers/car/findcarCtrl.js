angular.module('starter.services').controller('FindCarCtrl', function ($scope, cacheService, $state, geolocationService) {
  var vm = this;
  vm.findData = {
    placeOfDeparture: '',
    destination: '',
    vehicleLength: '',
    goodsItemGrossWeight: '',
    vehicleType: '',
    availablePeriod: ''
  }
  $scope.locationInfo = geolocationService.locationInfo;
  var province = $scope.locationInfo.province;
  province = province.replace(/省/g, "");
  var city = $scope.locationInfo.city;
  city = city.replace(/市/g, "");
  vm.findData.placeOfDeparture = province + city;

  $scope.findCar = function () {
    cacheService.save(vm.findData);
    $state.go('tab.carlist');
  }
})
