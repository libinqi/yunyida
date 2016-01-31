angular.module('starter.services').factory('loginService', function($http) {
  var user = null;
  return {

    userLogin: function(username, password, cb) {
      //var result = $http.get(ApiUrl + '/ws/system/sysLogin/login', {
      //  params: {
      //    username: username,
      //    password: password
      //  }
      //}).success(function(data, status) {
      //  if (data && data.code == "200") {
      //    if (data.body.usertype !== '2') {
      //      callback(null, '您不是货主用户，不能登录！');
      //    } else {
      //      user = data.body;
      //      user.username = username;
      //      user.password = password;
      //      if (callback) {
      //        callback(data.body, data.msg);
      //      }
      //    }
      //  } else {
      //    if (callback) {
      //      callback(null, data.msg);
      //    }
      //  }
      //}).error(function(data, status, headers, config) {
		//		if(status==0)
		//		{
		//			if (callback) {
		//				callback(null, '请检查网络是否正常！');
		//			}
		//		}
		//		else{
		//			if (callback) {
		//				callback(null, '登录失败,网络不给力！');
		//			}
		//		}
      //});

      io.socket.get('/user/login', {
        userName: username,
        password: password
      }, function serverResponded(body, JWR) {
        if (JWR.statusCode == 200) {
          if (body.userType !== '货主') {
            cb('您不是货主用户，不能登录！');
          }
          else if (!body.status) {
            cb('您的账号异常,不允许登录！');
          }
          else {
            body.userName = username;
            body.password = password;
            cb(body);
            //user = body;
            //UserInfo.save(user);
            //$state.go('tab.index');
          }
        }
        else if (JWR.statusCode == 500) {
          cb(body.msg);
        }
        else {
          cb('请检查网络是否正常！');
        }
      });
    },
    carInfoQuery: function(page, rows, sCity, eCity, vehicleType, svehiclelength,evehiclelength,sweight,eweight) {
      var result = $http.get(ApiUrl + '/ws/sinfo/bizVehicleInfo/search', {
        params: {
          page: page,
          rows: rows,
          sCity: sCity,
          eCity: eCity,
          vehicleType:vehicleType,
          svehiclelength:svehiclelength,
          evehiclelength:evehiclelength,
          sweight:sweight,
          eweight:eweight
        }
      }).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },
    pushGoodsInfo: function(goodsInfo) {
      var result = $http.post(ApiUrl + '/ws/sinfo/bizGoodsInfo/publish', goodsInfo).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },
    getPendingList: function(data) {
      var result = $http.get(ApiUrl + '/ws/sinfo/bizGoodsInfo/getlist', {
        params: data
      }).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },
    getGoodsIntentionList: function(data) {
      var result = $http.get(ApiUrl + '/ws/morder/bizGoodsIntention/getList', {
        params: data
      }).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },
    delGoodsInfo: function(goodsInfoId) {
      var result = $http.delete(ApiUrl + '/ws/sinfo/bizGoodsInfo/delete/' + goodsInfoId).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },
    getOrderInfo: function (data) {
      var result = $http.get(ApiUrl + '/ws/morder/bizOrder/getbizOrder/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
      pushCarIntention: function(carIntention) {
      var result = $http.post(ApiUrl + '/ws/morder/bizVehicleIntention/save', carIntention).then(
        function(response) {
          return response;
        },
        function(response) {
          return response;
        }
      );
      return result;
    },


  };

});
