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
        goodsType: {type: 'string', required: true, enum: ['零担', '整车', '城市配送'],defaultsTo: '零担'},//货物类型
        goodsName: {type: 'string', required: true},//货物名称
        goodsAttribute: {type: 'string', required: true, enum: ['普通', '加急'],defaultsTo: '普通'},//货物属性
        goodsNumber: {type: 'float', required: true},//货物数量
        goodsUnit: {type: 'string', required: true, enum: ['件', '方', '吨']},//数量单位
        carType:{type: 'string'},//需车类型
        carLength:{type: 'string'},//需车长
        consignor: {type: 'string', required: true},//发货人
        sPhoneNumber: {type: 'string', required: true},//起始地手机号码
        sCity: {type: 'string'},//起始地城市
        sCityCode: {type: 'string'},//起始地城市代码
        sStreet: {type: 'string'},//起始地街道
        sAddress: {type: 'string'},//起始地详细地址
        consignee: {type: 'string', required: true},//收货人
        ePhoneNumber: {type: 'string', required: true},//目的地手机号码
        eCity: {type: 'string'},//目的地城市
        eCityCode: {type: 'string'},//目的地城市代码
        eStreet: {type: 'string'},//目的地街道
        eAddress: {type: 'string'},//目的地详细地址
        publishType: {type: 'string', required: true, enum: ['随机发货', '指定发货'],defaultsTo: '随机发货'},//发布方式
        status: {type: 'boolean', defaultsTo: true},//状态
        remark: {type: 'string'},//备注说明
        user: {
            model: 'user'//所属用户
        },
        goodsOrders:{
            collection: 'goodsOrder',//关联订单列表
            via: 'goods'
        }
    }
};

