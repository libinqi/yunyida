/**
 * GoodsOrderController
 *
 * @description :: Server-side logic for managing goodsorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    userOrder: function (req, res) {
        var userId = req.body.userId;
        var page = req.body.page;
        var rows = req.body.rows;
        var orderStatus = req.body.orderStatus;

        var option = {
            shipper: userId,
            status: true
        };

        if (orderStatus) {
            if (orderStatus == '已删除') {
                option.status = false;
            }
            else {
                option.goodsOrderStatus = orderStatus;
            }
        }

        GoodsOrder.find(option)
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .populate('carrier')
            .populate('goods')
            .exec(function (err, data) {
            if (err) res.badRequest(err);
            res.ok(data);
        });
    },
    carrierOrder: function (req, res) {
        var userId = req.body.userId;
        var page = req.body.page;
        var rows = req.body.rows;
        var orderStatus = req.body.orderStatus;

        var option = {
            carrier: userId,
            status: true
        };

        if (orderStatus) {
            if (orderStatus == '已删除') {
                option.status = false;
            }
            else {
                option.goodsOrderStatus = orderStatus;
            }
        }

        GoodsOrder.find(option)
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .populate('goods').exec(function (err, data) {
            if (err) res.badRequest(err);
            res.ok(data);
        });
    },
    addOrder: function (req, res) {
        var orderId = req.body.orderId;
        var userId = req.body.userId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '接单';
            order.carrier = userId;
            order.goods.status = false;
            order.save();
            res.ok(order);
        });
    },
    unAddOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '未接单';
            order.carrier = null;
            order.goods.status = true;
            order.save();
            res.ok(order);
        });
    },
    updateOrder: function (req, res) {
        var orderId = req.body.orderId;
        var orderStatus = req.body.orderStatus;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = orderStatus;
            order.save();
            res.ok(order);
        });
    },
    confirmCarrier: function (req, res) {
        var orderId = req.body.orderId;
        var pricing = req.body.pricing;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '确认承运';
            order.pricing = pricing;
            order.save();
            res.ok(order);
        });
    },
    cancelOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已取消';
            order.carrier = null;
            order.goods.status = false;
            order.save();
            res.ok(order);
        });
    },
    refreshOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '未接单';
            order.status = true;
            order.carrier = null;
            order.goods.publishType = '随机发货';
            order.save();
            res.ok(order);
        });
    },
    deleteOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已删除';
            order.status = false;
            order.save();
            res.ok(order);
        });
    },
    evaluateOrder: function (req, res) {
        var orderId = req.body.orderId;
        var evaluationLevel = req.body.evaluationLevel;
        var evaluationContent = req.body.evaluationContent;
        GoodsOrder.findOne(orderId)
            .populate('carrier')
            .populate('goods')
            .exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已完成';
            order.evaluationLevel = evaluationLevel;
            order.evaluationContent = evaluationContent;
            order.save();
            res.ok(order);
        });
    },
    carrierOrderStatis: function (req, res) {
        var userId = req.body.userId;
        var sql = "SELECT COUNT(*) as count,'全部' as 'status' FROM goodsorder WHERE goodsOrderStatus!='已删除' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'未接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='未接单' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='接单' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'确认接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='确认接单' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'确认承运' as 'status' FROM goodsorder WHERE goodsOrderStatus='确认承运' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已取消' as 'status' FROM goodsorder WHERE goodsOrderStatus='已取消' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已完成' as 'status' FROM goodsorder WHERE goodsOrderStatus='已完成' AND  carrier=" + userId;

        GoodsOrder.query(sql, function (err, results) {
            if (err) res.badRequest(err);
            res.ok(results);
        });
    },
    shipperOrderStatis: function (req, res) {
        var userId = req.body.userId;
        var sql = "SELECT COUNT(*) as count,'全部' as 'status' FROM goodsorder WHERE goodsOrderStatus!='已删除' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'未接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='未接单' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='接单' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'确认接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='确认接单' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'确认承运' as 'status' FROM goodsorder WHERE goodsOrderStatus='确认承运' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已取消' as 'status' FROM goodsorder WHERE goodsOrderStatus='已取消' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已完成' as 'status' FROM goodsorder WHERE goodsOrderStatus='已完成' AND shipper=" + userId;

        GoodsOrder.query(sql, function (err, results) {
            if (err) res.badRequest(err);
            res.ok(results);
        });
    }
};

