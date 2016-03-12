angular.module('starter.controllers')
  .filter('handleBusinessLicenseNumber', function () {
    return function (input) {
      if (input && input.length == 15) {
        input = input.replace(input.substr(6, 5), '*****');
      }
      return input;
    };
  });
