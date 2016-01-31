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

        if(orderStatus)
        {
            if(orderStatus=='已删除')
            {
                option.status=false;
            }
            else {
                option.goodsOrderStatus=orderStatus;
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
    cancelOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已取消';
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
            order.save();
            res.ok(order);
        });
    },
    deleteOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).exec(function (err, order) {
            if (err) res.badRequest(err);
            order.status = false;
            order.save();
            res.ok(order);
        });
    },
    evaluateOrder: function (req, res) {
        var orderId = req.body.orderId;
        var evaluationLevel = req.body.evaluationLevel;
        var evaluationContent = req.body.evaluationContent;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已完成';
            order.evaluationLevel = evaluationLevel;
            order.evaluationContent = evaluationContent;
            order.save();
            res.ok(order);
        });
    }
};

