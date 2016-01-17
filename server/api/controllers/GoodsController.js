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
                res.ok(goods);
            });
        })
    }
};

