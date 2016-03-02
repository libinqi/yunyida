/**
 * GoodsController
 *
 * @description :: Server-side logic for managing goods
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function (req, res) {
        var data_from = req.params.all();
        Goods.create(data_from).exec(function (err, goods) {
            if (err) res.badRequest(err);
            GoodsOrder.create({goods: goods.goodsId, shipper: goods.user}).exec(function (err, goodsOrder) {
                if (err) res.badRequest(err);
                goods.goodsOrder = goodsOrder;
                res.ok(goods);
            });
        })
    },
    list: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var sCity = req.body.sCity;
        var eCity = req.body.eCity;
        var goodsType = req.body.goodsType;

        var option = {
            goodsType: goodsType,
            publishType: {'!': '指定发货'},
            status: true
        };

        if (sCity) {
            option.sCity = {'contains': sCity};
        }
        if (eCity && eCity != "全国") {
            option.eCity = {'contains': eCity};
        }
        Goods.find(option)
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .populate('user')
            .populate('goodsOrders', {goodsOrderStatus: '未接单'}).exec(function (err, data) {
            if (err) res.badRequest(err);
            res.ok(data);
        });
    }
};

