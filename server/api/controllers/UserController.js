/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function (req, res) {
        var userName = req.query.userName;
        var password = req.query.password;
        User.find({
                where: {password: EncryptService.Encrypt(password)},
                or: [{userName: userName}, {phoneNumber: userName}]
            })
            .exec(function (err, users) {
                if (err) res.json(err);
                if (users && users.length > 0) {
                    res.json(users[0]);
                }
                else {
                    res.json({});
                }
            });
    },
    register: function (req, res) {
        var data_from = req.params.all();
        User.create(data_from).exec(function (err, user) {
            if (err) res.json(err);
            res.json(user);
        })
    },
    restPwd: function (req, res) {
        var data_from = req.params.all();
        User.findOne({phoneNumber: data_from.phoneNumber})
            .exec(function (err, user) {
                if (err) res.json(err);
                user.password = EncryptService.Encrypt(data_from.password);
                user.save(function (err, user) {
                    if (err) res.json(err);
                    res.json(user);
                })
            });
    },
    getValidCode: function (req, res) {
        var phoneNumber = req.query.phoneNumber;
        SMSService.Send(phoneNumber, function (code) {
            if (code) {
                req.session.validCode = code;
                res.json({validCode: code});
            }
        });
    },
    checkValidCode: function (req, res) {
        var phoneNumber = req.query.phoneNumber;
        var validCode = req.query.validCode;
        if (req.session.validCode == validCode) {
            res.json({message: 'ok'});
        }
        else {
            res.json({message: 'no'});
        }
    }
};

