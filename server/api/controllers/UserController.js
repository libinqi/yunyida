/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function (req, res) {
        var userName = req.body.userName || req.query.userName;
        var password = req.body.password || req.query.password;
        User.find({
                //where: {password: EncryptService.Encrypt(password)},
                or: [{userName: userName}, {phoneNumber: userName}]
            })
            .exec(function (err, users) {
                if (err) res.badRequest(err);
                if (users && users.length > 0) {
                    var user = users[0];
                    if (user.password == EncryptService.Encrypt(password)) {
                        res.ok(user);
                    }
                    else {
                        res.serverError({msg: '您输入的密码不正确!'});
                    }
                }
                else {
                    res.serverError({msg: '您的用户名或手机号码不存在!'});
                }
            });
    },
    checkIsExist: function (req, res) {
        var userName = req.body.userName || req.query.userName;
        User.find({
                or: [{userName: userName}, {phoneNumber: userName}]
            })
            .exec(function (err, users) {
                if (err) res.badRequest(err);
                if (users && users.length > 0) {
                    res.serverError({msg: '用户或手机号码已存在!'});
                }
                else {
                    res.ok({msg: 'ok'});
                }
            });
    },
    register: function (req, res) {
        var data_from = req.params.all();
        User.create(data_from).exec(function (err, user) {
            if (err) res.badRequest(err);
            res.ok(user);
        })
    },
    restPwd: function (req, res) {
        var data_from = req.params.all();
        User.findOne({phoneNumber: data_from.phoneNumber})
            .exec(function (err, user) {
                if (err) res.badRequest(err);
                user.password = EncryptService.Encrypt(data_from.password);
                user.save(function (err, user) {
                    if (err) res.badRequest(err);
                    res.ok(user);
                })
            });
    },
    getValidCode: function (req, res) {
        var phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
        SMSService.Send(phoneNumber, function (code) {
            if (code) {
                req.session.validCode = code;
                res.ok({validCode: code});
            }
        });
    },
    checkValidCode: function (req, res) {
        var phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
        var validCode = req.body.validCode || req.query.validCode;
        if (req.session.validCode == validCode) {
            res.ok({msg: 'ok'});
        }
        else {
            res.serverError({msg: 'no'});
        }
    }
};

