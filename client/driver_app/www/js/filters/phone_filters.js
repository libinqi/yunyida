angular.module('starter.controllers')
    .filter('handlePhone', function () {
        return function (input) {
          var isMobile = /^\d{11}$/;
          var isPhone = /^(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
          if(isMobile.test(input))
          {
            input = input.replace(input.substr(2,3),'***');
            input = input.replace(input.substr(6,3),'***');
          }
          else if(isPhone.test(input))
          {
            input = input.replace(input.substr(input.length-7,4),'***');
          }
          return input;
        };
});
