
#com.qtong.cordova.bdlocation
	这是一个使用百度定位SDK作为后台的定位插件

## 安装&配置

    cordova plugin add https://github.com/kaixinhupo/cordova_location.git
	在AndroidManifest.xml文件application中加入从百度官网申请的API KEY
	<meta-data android:name="com.baidu.lbsapi.API_KEY" android:value="你的API KEY" />

### 调用方法

	document.addEventListener('deviceready', function(){
		window.LocationPlugin.getLocation(successCallback,errorCallback);
	}, false);
	
	function successCallback(data) {
		//data.longitude 经度
		//data.latitude 纬度
		//data.address 文字描述的地址信息
		//data.hasRadius 是否有定位精度半径
		//data.radius 定位精度半径
		//data.type 定位方式
	}
	
	function errorCallback(msg) {
		console.log("错误消息："+msg);
	}
