/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');

module.exports = {
    send: function (req, res) {
        var data_from = req.params.all();
        var userType = data_from.userType;

        if (userType) {
            User.find({userType: userType, status: true}).exec(function (err, users) {
                if (err) res.badRequest(err);
                Message.create(data_from).exec(function (err, message) {
                    if (err) res.badRequest(err);
                    for (var u in users) {
                        data_from.user = users[u].userId;
                        data_from.message = message.messageId;
                        MessageUser.create(data_from).exec(function (err, messageUser) {
                            if (err) res.badRequest(err);
                        });
                    }
                    res.ok({result: '发送成功'});
                });
            });
        }
        else {
            User.find({status: true}).exec(function (err, users) {
                if (err) res.badRequest(err);
                Message.create(data_from).exec(function (err, message) {
                    if (err) res.badRequest(err);
                    for (var u in users) {
                        data_from.user = users[u].userId;
                        data_from.message = message.messageId;
                        MessageUser.create(data_from).exec(function (err, messageUser) {
                            if (err) res.badRequest(err);
                        });
                    }
                    res.ok({result: '发送成功'});
                });
            });
        }
    },
    userMessage: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var messageType = req.body.messageType;
        var userId = req.body.userId;

        var option = {
            status: true,
            validate: {'>': moment().format('YYYY-MM-DD')}
        };

        if (messageType) {
            option.messageType = messageType;
        }

        if (userId) {
            option.user = userId;
        }

        MessageUser.find(option)
            .sort('updatedAt DESC')
            .paginate({page: page, limit: rows})
            .exec(function (err, data) {
                if (err) res.badRequest(err);
                res.ok(data);
            });
    },
    list: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var messageType = req.body.messageType;
        var userType = req.body.userType;
        var content = req.body.content;

        var option = {
            status: true
        };

        if (messageType) {
            option.messageType = messageType;
        }

        if (userType) {
            option.userType = userType;
        }

        if (content) {
            option.content = {'contains': content};
        }

        Message.count(option).exec(function countCB(err, count) {
            if (err) res.badRequest(err);
            if (count && count > 0) {
                Message.find(option)
                    .sort('updatedAt DESC')
                    .paginate({page: page, limit: rows})
                    .exec(function (err, data) {
                        if (err) res.badRequest(err);
                        res.ok({body: data, count: count});
                    });
            }
            else {
                res.ok({body: [], count: 0});
            }
        });
    },
    /**
     * 通过Id获取消息
     *
     * (GET /message/:id)
     */
    delete: function (req, res) {
        var messageId = req.param('id');
        Message.destroy({messageId: messageId}).exec(function (err) {
            if (err) res.badRequest(err);
            MessageUser.destroy({message: messageId}).exec(function (err) {
                if (err) res.badRequest(err);
            });
            res.ok({result: '删除成功'});
        });
    }
};

