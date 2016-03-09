/**
 * GoodsOrderController
 *
 * @description :: Server-side logic for managing goodsorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var JPush = require("jpush-sdk");
var push_goods_client = JPush.buildClient(sails.config.jpush_goods.apiKey, sails.config.jpush_goods.apiSecret, null, false);
var push_driver_client = JPush.buildClient(sails.config.jpush_driver.apiKey, sails.config.jpush_driver.apiSecret, null, false);

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
    list: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var shipper = req.body.shipper;
        var carrier = req.body.carrier;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var status = req.body.status;

        var sql = "SELECT COUNT(*) as count,GROUP_CONCAT(o.goodsOrderId) as goodsOrderIds FROM goodsorder as o LEFT JOIN `user` as s on o.shipper=s.userId LEFT JOIN `user` as c on o.carrier=c.userId where 1=1";

        if (startDate && endDate) {
            sql += " and o.createdAt >= '" + startDate + "' and o.createdAt<= '" + endDate + ' 23:59:59' + "'";
        }
        else if (startDate) {
            sql += " and o.createdAt >= '" + startDate + "'";
        }
        else if (endDate) {
            sql += " and o.createdAt<= '" + endDate + ' 23:59:59' + "'";
        }

        if (status) {
            sql += " and o.goodsOrderStatus='" + status + "'";
        }

        if (shipper) {
            sql += " and (s.phoneNumber like '%" + shipper + "%' or s.enterpriseName like '%" + shipper + "%' or s.realName like '%" + shipper + "%')";
        }

        if (carrier) {
            sql += " and (c.phoneNumber like '%" + carrier + "%' or c.enterpriseName like '%" + carrier + "%' or c.realName like '%" + carrier + "%')";
        }


        GoodsOrder.query(sql, function (err, count) {
            if (err) res.badRequest(err);
            if (count && count.length > 0) {
                GoodsOrder.find(count[0].goodsOrderIds.split(','))
                    .populate('shipper')
                    .populate('carrier')
                    .populate('goods')
                    .sort('createdAt DESC')
                    .paginate({page: page, limit: rows})
                    .exec(function (err, data) {
                        if (err) res.badRequest(err);
                        res.ok({body: data, count: count[0].count});
                    });
            }
            else {
                res.ok({body: [], count: 0});
            }
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
            order.goodsOrderStatus = '已报价';
            order.carrier = userId;
            order.goods.status = false;
            order.save();

            push_goods_client.push().setPlatform('ios', 'android')
                .setAudience(JPush.tag(order.shipper + ''))
                .setNotification('您有一票货被已报价，快去看看', JPush.ios('您有一票货被已报价，快去看看'), JPush.android('您有一票货被已报价，快去看看', null, 1))
                .send(function (err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        //console.log('发送编号: ' + res.sendno);
                        //console.log('消息Id: ' + res.msg_id);
                    }
                });

            res.ok(order);
        });
    },
    postionOrder: function (req, res) {
        var orderId = req.body.orderId;
        var userId = req.body.userId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已报价';
            order.carrier = userId;
            order.goods.status = false;
            order.save();

            push_driver_client.push().setPlatform('ios', 'android')
                .setAudience(JPush.tag(userId + ''))
                .setNotification('货主企业给您指派了一条新的订单', JPush.ios('货主企业给您指派了一条新的订单'), JPush.android('货主企业给您指派了一条新的订单', null, 1))
                //.setMessage('msg content')
                //.setOptions(null, 60)
                .send(function (err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        //console.log('发送编号: ' + res.sendno);
                        //console.log('消息Id: ' + res.msg_id);
                    }
                });

            res.ok(order);
        });
    },
    unAddOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);
            order.goodsOrderStatus = '已下单';
            order.carrier = null;
            order.goods.publishType = (order.goods.goodsType == '零担' ? '快捷发货' : '立即发货');
            order.goods.status = true;
            order.save();

            push_goods_client.push().setPlatform('ios', 'android')
                .setAudience(JPush.tag(order.shipper + ''))
                .setNotification('您有一个订单被取消已报价', JPush.ios('您有一个订单被取消已报价'), JPush.android('您有一个订单被取消已报价', null, 1))
                .send(function (err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        //console.log('发送编号: ' + res.sendno);
                        //console.log('消息Id: ' + res.msg_id);
                    }
                });

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
            order.goodsOrderStatus = '已承运';
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
            //order.carrier = null;
            if (order.carrier) {
                push_driver_client.push().setPlatform('ios', 'android')
                    .setAudience(JPush.tag(order.carrier + ''))
                    .setNotification('您有一个订单被货主取消，请及时查看！!', JPush.ios('您有一个订单被货主取消，请及时查看！'), JPush.android('您有一个订单被货主取消，请及时查看！', null, 1))
                    .send(function (err, res) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            //console.log('发送编号: ' + res.sendno);
                            //console.log('消息Id: ' + res.msg_id);
                        }
                    });
            }

            order.goods.status = false;
            order.save();
            res.ok(order);
        });
    },
    refreshOrder: function (req, res) {
        var orderId = req.body.orderId;
        GoodsOrder.findOne(orderId).populate('goods').exec(function (err, order) {
            if (err) res.badRequest(err);

            if (order.carrier) {
                push_driver_client.push().setPlatform('ios', 'android')
                    .setAudience(JPush.tag(order.carrier + ''))
                    .setNotification('您有一个订单被货主重新发布,请已报价后及时与货主联系!', JPush.ios('您有一个订单被货主重新发布,请已报价后及时与货主联系!'), JPush.android('您有一个订单被货主重新发布,请已报价后及时与货主联系!', null, 1))
                    .send(function (err, res) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            //console.log('发送编号: ' + res.sendno);
                            //console.log('消息Id: ' + res.msg_id);
                        }
                    });
            }

            order.goodsOrderStatus = '已下单';
            order.status = true;
            order.carrier = null;
            order.goods.status = true;
            order.goods.publishType = (order.goods.goodsType == '零担' ? '快捷发货' : '立即发货');
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
        sql += " UNION ALL SELECT COUNT(*) as count,'已报价' as 'status' FROM goodsorder WHERE goodsOrderStatus='已报价' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='已接单' AND  carrier=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已承运' as 'status' FROM goodsorder WHERE goodsOrderStatus='已承运' AND  carrier=" + userId;
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
        sql += " UNION ALL SELECT COUNT(*) as count,'已下单' as 'status' FROM goodsorder WHERE goodsOrderStatus='已下单' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已报价' as 'status' FROM goodsorder WHERE goodsOrderStatus='已报价' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已接单' as 'status' FROM goodsorder WHERE goodsOrderStatus='已接单' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已承运' as 'status' FROM goodsorder WHERE goodsOrderStatus='已承运' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已取消' as 'status' FROM goodsorder WHERE goodsOrderStatus='已取消' AND shipper=" + userId;
        sql += " UNION ALL SELECT COUNT(*) as count,'已完成' as 'status' FROM goodsorder WHERE goodsOrderStatus='已完成' AND shipper=" + userId;

        GoodsOrder.query(sql, function (err, results) {
            if (err) res.badRequest(err);
            res.ok(results);
        });
    }
};

