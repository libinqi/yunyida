angular.module('starter.services').factory('Userinfo', function() {
  var userinfo = {};

  return {
    save: function(j) {
      for (var k in j) {
        window.localStorage[k] = userinfo[k] = j[k];
      };
      return userinfo;
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
      window.localStorage[k] = userinfo[k] = v;
    },

    addLong: function(k, v) {
      window.localStorage[k] = v;
    },

    data: window.localStorage
  };
});
