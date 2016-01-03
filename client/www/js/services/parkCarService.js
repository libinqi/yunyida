angular.module('starter.services').factory('parkCarService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var carList = [{
    id: 0,
    text: '湖南长沙→河南,有13.5米平板车,求货',
    phone: '135***85***',
    date: '1分钟前'
  }, {
    id: 1,
    text: '湖南长沙→河南,有13.5米平板车,求货',
    phone: '135***85***',
    date: '2分钟前'
  }, {
    id: 2,
    text: '湖南长沙→河南,有13.5米平板车,求货',
    phone: '135***85***',
    date: '2分钟前'
  }, {
    id: 3,
    text: '湖南长沙→河南,有13.5米平板车,求货',
    phone: '135***85***',
    date: '5分钟前'
  }, {
    id: 4,
    text: '湖南长沙→河南,有13.5米平板车,求货',
    phone: '135***85***',
    date: '10分钟前'
  }];

  return {
    all: function() {
      return carList;
    },
    get: function(carId) {
      for (var i = 0; i < carList.length; i++) {
        if (carList[i].id === parseInt(carId)) {
          return carList[i];
        }
      }
      return null;
    }
  };
});
