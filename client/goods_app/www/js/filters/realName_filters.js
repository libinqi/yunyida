angular.module('starter.controllers')
    .filter('handleRealName', function () {
        return function (input) {
          if(input)
          {
            if(input.length==2)
            {
              input = input.replace(input.substr(1,1),'*');
            }
            else if(input.length>2){
              input = input.replace(input.substr(1,2),'**');
            }
          }
          return input;
        };
});
