/**
 * Car.js
 *
 * @description :: 车辆信息
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        carId: {type: 'integer', primaryKey: true, autoIncrement: true},//车辆Id
        carNumber: {type: 'string', unique: true},//车牌号码
        carType: {type: 'string'},//车型
        carLength: {type: 'string'},//车长
        carImage: {type: 'string'},//车辆图片
        lng: {type: 'string'},//经度
        lat: {type: 'string'},//纬度
        driver: {
            model: 'driver'//所属司机
        }
    }
};

