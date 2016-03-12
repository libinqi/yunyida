angular.module('starter.controllers')
    .filter('handleCardNumber', function () {
        return function (input) {
          if(input)
          {
            if(input.length==18)
            {
              input = input.replace(input.substr(6,8),'********');
            }
            else {
              input = input.replace(input.substr(6,5),'*****');
            }
          }
          return input;
        };
});
