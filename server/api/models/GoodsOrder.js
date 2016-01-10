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
        goodsOrderStatus: {type: 'string', required: true, defaultsTo: '未接单'},//订单状态(未接单,接单,确认接单,取消接单,确认承运,已完成)
        evaluationLevel: {type: 'integer'},//评价等级
        evaluationContent: {type: 'string'},//评价等级
        pricing: {type: 'float'},//运价
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

