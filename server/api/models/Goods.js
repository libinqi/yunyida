/**
 * Goods.js
 *
 * @description :: 货物信息:零担\整车\城市配送发货实体
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        goodsId: {type: 'integer', primaryKey: true, autoIncrement: true},//货物Id
        goodsType: {type: 'string', required: true, enum: ['零担', '整车', '城市配送']},//货物类型
        goodsName: {type: 'string', required: true},//货物名称
        goodsAttribute: {type: 'string', required: true, enum: ['普通', '加急']},//货物属性
        letter: {type: 'integer'}, //件
        square: {type: 'float'}, //方
        tonnage: {type: 'float'},//吨
        carType:{type: 'string'},//需车类型
        consignor: {type: 'string', required: true},//发货人
        sPhoneNumber: {type: 'string', required: true},//起始地手机号码
        sProvince: {type: 'string'},//起始地省
        sCity: {type: 'string'},//起始地市
        sArea: {type: 'string'},//起始地区,县
        sStreet: {type: 'string'},//起始地街道
        sAddress: {type: 'string'},//起始地详细地址
        consignee: {type: 'string', required: true},//收货人
        ePhoneNumber: {type: 'string', required: true},//目的地手机号码
        eProvince: {type: 'string'},//目的地省
        eCity: {type: 'string'},//目的地市
        eArea: {type: 'string'},//目的地区,县
        eStreet: {type: 'string'},//目的地街道
        eAddress: {type: 'string'},//目的地详细地址
        status: {type: 'boolean', defaultsTo: true},//状态
        goodsOrder:{
            model: 'goodsOrder'//关联订单
        }
    }
};

