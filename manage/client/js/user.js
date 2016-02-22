/**
 * Created by libinqi on 2015/6/16.
 */
(function() {
  var user = null;

  var userService = {
    userLogin: function(username, password, callback) {
      $.get(loc_host + '/ws/system/sysLogin/login', {
        username: username,
        password: password
      }, function(data) {
        if (data.body) {
          var year = new Date().getFullYear();
          var month = (new Date().getMonth() + 1).toString();
          var day = new Date().getDate().toString();
          var dateTime = ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
          if (month.length == 1) {
            month = '0' + month;
          }
          if (day.length == 1) {
            day = '0' + day;
          }
          data.body.loginDate = year + '-' + month + '-' + day + dateTime;
          user = data.body;
          if (callback) {
            callback(data.body, data.msg);
          }
        } else {
          if (callback) {
            callback(null, data.msg);
          }
        }
      });
    },
    getUserPermissions: function(callback) {
      $.get(loc_host + '/ws/system/sysLogin/accessIndex/' + user.userid, function(data) {
        user.permissions = data.body;
        if (callback) {
          callback(user);
        }
      });
    },
    getUser: function() {
      return JSON.parse(sessionStorage.getItem('ua_session'));
    },
    setUser: function(userData) {
      sessionStorage.setItem('ua_session', JSON.stringify(userData));
    },
    removeUser: function() {
      sessionStorage.removeItem('ua_session');
    }
  };

  window.userService = userService;
  window.user = user;
})();
