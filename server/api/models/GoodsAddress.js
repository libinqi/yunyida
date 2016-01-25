/**
 * GoodsAddress.js
 *
 * @description :: 发货地址
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        goodsAddressId: {type: 'integer', primaryKey: true, autoIncrement: true},//发货地址Id
        consignor: {type: 'string', required: true},//发货人
        phoneNumber: {type: 'string', required: true},//手机号码
        city: {type: 'string'},//所在城市
        cityCode: {type: 'string'},//所在城市代码
        street: {type: 'string'},//街道
        address: {type: 'string'},//详细地址
        isDefault: {type: 'boolean', defaultsTo: false},//是否默认发货地址
        user: {
            model: 'user'//所属用户
        }
    }
};

