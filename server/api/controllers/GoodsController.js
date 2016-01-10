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
            GoodsOrder.create({goods: goods.goodsId}).exec(function (err, goodsOrder) {
                if (err) res.badRequest(err);
                res.ok(goods);
            });
        })
    },
    userGoodsOrder: function (req, res) {
        var userId = req.body.userId;
        var page = req.body.page;
        var rows = req.body.rows;
        GoodsOrder.find({shipper: userId})
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .populate('goods').exec(function (err, data) {
            if (err) res.badRequest(err);
            res.ok(data);
        });
    }
};

