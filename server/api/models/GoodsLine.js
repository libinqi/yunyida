/**
* GoodsLine.js
*
* @description :: 专线信息
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: true,
  attributes: {
    goodsLineId: {type: 'integer', primaryKey: true, autoIncrement: true},//发货地址Id
    sCity: {type: 'string'},//起始地城市
    sCityCode: {type: 'string'},//起始地城市代码
    sStreet: {type: 'string'},//起始地街道
    sAddress: {type: 'string'},//起始地详细地址
    eCity: {type: 'string'},//目的地城市
    eCityCode: {type: 'string'},//目的地城市代码
    eStreet: {type: 'string'},//目的地街道
    eAddress: {type: 'string'},//目的地详细地址
    lng: {type: 'string'},//经度
    lat: {type: 'string'},//纬度
    user: {
      model: 'user'//所属用户
    }
  }
};

