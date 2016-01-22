angular.module('starter.services').service('geolocationService', function ($rootScope) {
  var geolocationService = {
    locationInfo: {
      province: "湖南省",
      city: "长沙市"
    },
    getCurrentPosition: function (cb) {
      var geolocation = new BMap.Geolocation();
      var myGeo = new BMap.Geocoder();
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // 根据坐标得到地址描述
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function (result) {
            if (result) {
              geolocationService.locationInfo.province = result.addressComponents.province;
              geolocationService.locationInfo.city = result.addressComponents.city;
              geolocationService.locationInfo.district = result.addressComponents.district;
              $rootScope.$broadcast('geolocation.load');
              if (cb)cb(result);
            }
          });
        } else {
          geolocationService.locationInfo.province = "湖南省";
          geolocationService.locationInfo.city = "长沙市";
          $rootScope.$broadcast('geolocation.load');
        }
      }, {
        enableHighAccuracy: true
      });
    }
  };
  return geolocationService;
});
