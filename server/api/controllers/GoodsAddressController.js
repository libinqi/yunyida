/**
 * GoodsAddressController
 *
 * @description :: Server-side logic for managing goodsaddresses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function (req, res) {
        var data_from = req.params.all();
        GoodsAddress.count({user: data_from.user}).exec(function countCB(error, found) {
            if (!found) {
                data_from.isDefault = true;
            }
            GoodsAddress.create(data_from).exec(function (err, goodsAddress) {
                if (err) res.badRequest(err);
                res.ok(goodsAddress);
            })
        });
    },
    update: function (req, res) {
        var data_from = req.params.all();
        GoodsAddress.update({goodsAddressId: data_from.goodsAddressId},data_from).exec(function (err, goodsAddress) {
            if (err) res.badRequest(err);
            res.ok(goodsAddress);
        })
    },
    userGoodsAddress: function (req, res) {
        var userId = req.body.userId;
        var page = req.body.page;
        var rows = req.body.rows;
        GoodsAddress.find({user: userId})
            .sort('isDefault DESC')
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .exec(function (err, data) {
                if (err) res.badRequest(err);
                res.ok(data);
            });
    },
    deleteGoodsAddress: function (req, res) {
        var goodsAddressId = req.body.goodsAddressId;
        GoodsAddress.destroy({goodsAddressId: goodsAddressId}).exec(function (err, goodsAddress) {
            if (err) res.badRequest(err);
            res.ok(goodsAddress);
        });
    },
    defaultGoodsAddress: function (req, res) {
        var userId = req.body.userId;
        var goodsAddressId = req.body.goodsAddressId;
        GoodsAddress.update({user: userId}, {isDefault: false}).exec(function (err, data) {
            if (err) res.badRequest(err);
            GoodsAddress.update({goodsAddressId: goodsAddressId}, {isDefault: true}).exec(function (err, goodsAddress) {
                if (err) res.badRequest(err);
                res.ok(goodsAddress);
            });
        });
    },
};

