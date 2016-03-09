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
        goodsOrderStatus: {type: 'string', required: true, enum: ['已下单','已报价','已接单','已承运','已完成','已取消','已删除'],defaultsTo: '已下单'},//订单状态
        evaluationLevel: {type: 'integer'},//评价等级
        evaluationContent: {type: 'string'},//评价内容
        pricing: {type: 'float'},//运价
        status: {type: 'boolean', defaultsTo: true},//状态
        isPeiSong: {type: 'boolean', defaultsTo: false},//是否发起过城市配送
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

