/**
 * GoodsLineController
 *
 * @description :: Server-side logic for managing Goodslines
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function (req, res) {
        var data_from = req.params.all();
        GoodsLine.create(data_from).exec(function (err, goodsLine) {
            if (err) res.badRequest(err);
            res.ok(goodsLine);
        })
    },
    update: function (req, res) {
        var data_from = req.params.all();
        GoodsLine.update({goodsLineId: data_from.goodsLineId}, data_from).exec(function (err, goodsLine) {
            if (err) res.badRequest(err);
            res.ok(goodsLine);
        })
    },
    userGoodsLine: function (req, res) {
        var userId = req.body.userId;
        var page = req.body.page;
        var rows = req.body.rows;
        GoodsLine.find({user: userId})
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .exec(function (err, data) {
                if (err) res.badRequest(err);
                res.ok(data);
            });
    },
    deleteGoodsLine: function (req, res) {
        var goodsLineId = req.body.goodsLineId;
        GoodsLine.destroy({goodsLineId: goodsLineId}).exec(function (err, goodsLine) {
            if (err) res.badRequest(err);
            res.ok(goodsLine);
        });
    }
};

