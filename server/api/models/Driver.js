/**
 * Driver.js
 *
 * @description :: 司机信息
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        driverId: {type: 'integer', primaryKey: true, autoIncrement: true},//司机Id
        drivingLicenseImage: {type: 'string'},//行驶证图片
        driverLicenseImage: {type: 'string'},//驾驶证图片
        user: {
            model: 'user'//所属用户
        },
        cars: {
            collection: 'car',//拥有车辆
            via: 'driver'
        }
    }
};

