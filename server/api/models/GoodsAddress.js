/**
 * GoodsAddress.js
 *
 * @description :: 收发货地址
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        goodsAddressId: {type: 'integer', primaryKey: true, autoIncrement: true},//收发货地址Id
        consignor: {type: 'string', required: true},//发/收货人
        phoneNumber: {type: 'string', required: true},//手机号码
        city: {type: 'string'},//所在城市
        cityCode: {type: 'string'},//所在城市代码
        street: {type: 'string'},//街道
        address: {type: 'string'},//详细地址
        lng: {type: 'string'},//经度
        lat: {type: 'string'},//纬度
        isDefault: {type: 'boolean', defaultsTo: false},//是否默认发货地址
        type: {type: 'string', required: true, enum: ['发货', '收货'],defaultsTo: '发货'},//收发货地址类型
        user: {
            model: 'user'//所属用户
        }
    }
};

