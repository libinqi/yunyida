/**
 * Enterprise.js
 *
 * @description :: 企业信息
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        enterpriseId: {type: 'integer', primaryKey: true, autoIncrement: true},//企业Id
        enterpriseName: {type: 'string', unique: true, required: true},//企业名称
        businessLicenseNumber: {type: 'string', unique: true},//营业执照编号
        businessType: {type: 'string'},//业务类型
        user: {
            model: 'user'//所属用户
        }
    }
};

