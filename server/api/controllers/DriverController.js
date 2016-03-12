/**
 * DriverController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    register: function (req, res) {
        var data_from = req.params.all();
        User.create(data_from).exec(function (err, user) {
            if (err) res.badRequest(err);
            else {
                data_from.user = user.userId;
                Driver.create(data_from).exec(function (err, driver) {
                    if (err) res.badRequest(err);
                    else {
                        data_from.driver = driver.driverId;
                        Car.create(data_from).exec(function (err, car) {
                            if (err) res.badRequest(err);
                            else {
                                driver.car = car;
                                user.driver = driver;
                                res.ok(user);
                            }
                        });
                    }
                });
            }
        })
    },
    list: function (req, res) {
        var page = req.body.page;
        var rows = req.body.rows;
        var carNumber = req.body.carNumber;
        var realName = req.body.realName;
        var phoneNumber = req.body.phoneNumber;
        var status = req.body.status;

        var sql = " FROM `user` AS u LEFT JOIN driver AS d ON d.`user` = u.userId LEFT JOIN car AS c ON c.driver = d.driverId WHERE	u.userType = '司机'";

        if (carNumber) {
            sql += " and c.carNumber like '%" + carNumber + "%'";
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
                User.query('SELECT u.*,d.*,c.*' + sql + limit, function (err, results) {
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
     * (GET /driver/:id)
     */
    getDriver: function (req, res) {
        var userId = req.param('id');
        Driver.findOne({
                where: {user: userId}
            })
            .populate('user')
            .populate('cars')
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
                Driver.update({driverId: data_from.driverId}, data_from).exec(function (err, driver) {
                    if (err) res.badRequest(err);
                    else {
                        Car.update({carId: data_from.carId}, data_from).exec(function (err, car) {
                            if (err) res.badRequest(err);
                            else {
                                user[0].driver = driver[0];
                                user[0].driver.car = car[0];
                                res.ok(user[0]);
                            }
                        });
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

