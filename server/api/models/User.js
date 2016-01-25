/**
 * User.js
 *
 * @description :: 用户基本信息
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        userId: {type: 'integer', primaryKey: true, autoIncrement: true},//用户Id
        userName: {type: 'string', unique: true},//用户名
        realName: {type: 'string', unique: true},//真实姓名
        userType: {type: 'string', required: true, enum: ['货主', '物流企业', '司机']},//用户类型
        password: {type: 'string', required: true},//密码
        phoneNumber: {type: 'string', unique: true, required: true},//手机号码
        email: {type: 'string', unique: true, email: true},//邮箱
        enterpriseName: {type: 'string'},//企业名称
        logo: {type: 'string'},//头像
        city: {type: 'string'},//所在城市
        street: {type: 'string'},//街道
        address: {type: 'string'},//详细地址
        cityCode: {type: 'string'},//城市代码
        cardNumber: {type: 'string'},//证件号码
        lng: {type: 'string'},//经度
        lat: {type: 'string'},//纬度
        status: {type: 'boolean', defaultsTo: true}//状态
    },
    // Lifecycle Callbacks
    beforeCreate: function (values, cb) {
        // Encrypt password
        values.password = EncryptService.Encrypt(values.password);
        cb();
    }
};

