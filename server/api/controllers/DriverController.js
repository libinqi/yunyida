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
            else{
                data_from.user = user.userId;
                Driver.create(data_from).exec(function (err, driver) {
                    if (err) res.badRequest(err);
                    else{
                        user.driver = driver;
                        data_from.driver=driver.driverId;
                        Car.create(data_from).exec(function (err,car) {
                            if (err) res.badRequest(err);
                            else {
                                driver.cars.push(car);
                                res.ok(user);
                            }
                        });
                    }
                });
            }
        })
    }
};

