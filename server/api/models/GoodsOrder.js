/**
 * GoodsOrder.js
 *
 * @description :: 货物订单
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,
    attributes: {
        goodsOrderId: {type: 'integer', primaryKey: true, autoIncrement: true},//货物订单Id
        goodsOrderStatus: {type: 'string', required: true, enum: ['未接单','接单','确认接单','已取消','取消接单','确认承运','未评价','已完成'],defaultsTo: '未接单'},//订单状态
        evaluationLevel: {type: 'integer'},//评价等级
        evaluationContent: {type: 'string'},//评价内容
        pricing: {type: 'float'},//运价
        status: {type: 'boolean', defaultsTo: true},//状态
        goods: {
            model: 'goods'//所属货物
        },
        shipper: {
            model: 'user'//托运人
        },
        carrier: {
            model: 'user'//承运人
        }
    }
};

