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
            else{
                data_from.user = user.userId;
                Enterprise.create(data_from).exec(function (err, enterprise) {
                    if (err) res.badRequest(err);
                    else{
                        user.enterprise = enterprise;
                        res.ok(user);
                    }
                });
            }
        })
    }
};

