/**
 * EnterpriseController
 *
 * @description :: Server-side logic for managing enterprises
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    register: function (req, res) {
        var data_from = req.params.all();
        User.create(data_from).exec(function (err, user) {
            if (err) res.badRequest(err);
            else {
                data_from.user = user.userId;
                Enterprise.create(data_from).exec(function (err, enterprise) {
                    if (err) res.badRequest(err);
                    else {
                        user.enterprise = enterprise;
                        res.ok(user);
                    }
                });
            }
        })
    },
    list: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var enterpriseName = req.body.enterpriseName;
        var realName = req.body.realName;
        var phoneNumber = req.body.phoneNumber;
        var status = req.body.status;

        var sql = " FROM `user` as u LEFT JOIN enterprise as e on e.`user`=u.userId WHERE u.userType='物流企业'";

        if (enterpriseName) {
            sql += " and u.enterpriseName like '%" + enterpriseName + "%'";
        }

        if (realName) {
            sql += " and u.realName like '%" + realName + "%'";
        }

        if (phoneNumber) {
            sql += " and u.phoneNumber like '%" + phoneNumber + "%'";
        }

        if (status) {
            sql += " and u.status=" + status;
        }

        User.query('SELECT count(*) as count' + sql, function (err, count) {
            if (err) res.badRequest(err);
            if (count && count.length > 0) {
                var limit = ' limit ' + (page - 1) * rows + ',' + page * rows;
                User.query('SELECT u.*,e.*' + sql + limit, function (err, results) {
                    if (err) res.badRequest(err);
                    res.ok({body: results, count: count[0].count});
                });
            }
            else {
                res.ok({body: [], count: 0});
            }
        });
    },
    /**
     * 通过Id获取企业信息
     *
     * (GET /enterprise/:id)
     */
    getEnterprise: function (req, res) {
        var userId = req.param('id');
        Enterprise.findOne({
                where: {user: userId}
            })
            .populate('user')
            .exec(function (err, users) {
                if (err) res.badRequest(err);
                res.ok(users);
            });
    },
    update: function (req, res) {
        var data_from = req.params.all();
        User.update({userId: data_from.userId}, data_from).exec(function (err, user) {
            if (err) res.badRequest(err);
            else {
                Enterprise.update({enterpriseId: data_from.enterpriseId}, data_from).exec(function (err, enterprise) {
                    if (err) res.badRequest(err);
                    else {
                        user[0].enterprise = enterprise[0];
                        res.ok(user[0]);
                    }
                });
            }
        })
    },
    audit: function (req, res) {
        var data_from = req.params.all();
        if(data_from.status)
        {
            SMSService.SendAudit(data_from.phoneNumber,data_from.name);
            res.ok();
        }
    }
};

