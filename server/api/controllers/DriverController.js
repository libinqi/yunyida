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
};

