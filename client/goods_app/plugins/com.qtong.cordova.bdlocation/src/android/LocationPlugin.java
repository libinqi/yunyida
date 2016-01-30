package com.qtong.mplatform.cordova;

import java.util.Locale;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.location.LocationClientOption.LocationMode;

public class LocationPlugin extends CordovaPlugin {

	private static final String ACTION_GETLOCATION = "getlocation";

	private CallbackContext callbackContext = null;
	private LocationClient locationClient = null;
	private LocationListener locationListener = new LocationListener();

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		if (locationClient == null) {
			LocationClientOption option = new LocationClientOption();
			option.setLocationMode(LocationMode.Hight_Accuracy);// 设置定位模式
			option.setCoorType("bd09ll");
			option.setScanSpan(5000);
			option.setIsNeedAddress(true);
			locationClient = new LocationClient(cordova.getActivity().getApplicationContext(),
					option);
			locationClient.registerLocationListener(locationListener);
		}
		super.initialize(cordova, webView);
	}

	@Override
	public void onDestroy() {
		if (locationClient != null) {
			locationClient.unRegisterLocationListener(locationListener);
			if (locationClient.isStarted()) {
				locationClient.stop();
			}
			locationClient = null;
		}
		super.onDestroy();
	}

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
		if (ACTION_GETLOCATION.equals(action.toLowerCase(Locale.CHINA))) {
			locationClient.start();
			PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
	        r.setKeepCallback(true);
	        callbackContext.sendPluginResult(r);
			return true;
		}
		return false;
	}

	private class LocationListener implements BDLocationListener {
		@Override
		public void onReceiveLocation(BDLocation loc) {
			if (locationClient.isStarted()) {
				locationClient.stop();
			}
			JSONObject jo = new JSONObject();
			try {
				jo.put("longitude",  loc.getLongitude());
				jo.put("latitude",  loc.getLatitude());
				jo.put("province",  loc.getProvince());
				jo.put("city",  loc.getCity());
        jo.put("cityCode",  loc.getCityCode());
        jo.put("district",  loc.getDistrict());
        jo.put("street",  loc.getStreet());
        jo.put("streetNumber",  loc.getStreetNumber());
				jo.put("address", loc.getAddrStr());
				jo.put("hasRadius ", loc.hasRadius());
				jo.put("radius", loc.getRadius());
				int type = loc.getLocType();
				String typeStr = (type == BDLocation.TypeGpsLocation?"gps":(type==BDLocation.TypeNetWorkLocation?"网络":"其它"));
				jo.put("type",typeStr);
			} catch (JSONException e) {
				jo = null;
				e.printStackTrace();
			}
			if(jo!=null) {
				Log.d("LocationPlugin", "location:"+jo.toString());
				callbackContext.success(jo);
			}
		}
	}
}
