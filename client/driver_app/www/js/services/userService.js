angular.module('starter.services').factory('UserInfo', function() {
  var userInfo = {};

  return {
    save: function(j) {
      for (var k in j) {
        window.localStorage[k] = userInfo[k] = j[k];
      };
      return userInfo;
    },

    remove: function(f) {
      if(f.constructor==Array){
        for(var i=0;i<f.length;i++){
          window.localStorage.removeItem(f[i]);
        }
      }
        window.localStorage.removeItem(f);
    },

    add: function(k, v) {
      window.localStorage[k] = userInfo[k] = v;
    },

    addLong: function(k, v) {
      window.localStorage[k] = v;
    },

    data: window.localStorage
  };
});
