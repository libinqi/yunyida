/**
 * Created by libinqi on 2015/6/16.
 */
(function() {
  var user = null;

  var userService = {
    userLogin: function(username, password, callback) {
      $.get('/api/user/login', {
        userName: username,
        password: password
      }, function(data) {
        if (data&&data.userid) {
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
          data.loginDate = year + '-' + month + '-' + day + dateTime;
          user = data;
          if (callback) {
            callback(data, "登录成功");
          }
        } else {
          if (callback) {
            callback(null, "用户或密码输入不正确");
          }
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
