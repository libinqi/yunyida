angular.module('starter.services').factory('cacheService', function() {
	var cacheDate = {};

  return {
    save: function(j) {
      for (var k in j) {
        window.localStorage[k] = cacheDate[k] = j[k];
      };
      return cacheDate;
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
      window.localStorage[k] = cacheDate[k] = v;
    },

    addLong: function(k, v) {
      window.localStorage[k] = v;
    },

    data: window.localStorage
  };
})
