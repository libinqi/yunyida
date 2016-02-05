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
    },
    /**
     * 通过Id获取企业信息
     *
     * (GET /enterprise/:id)
     */
    getEnterprise: function (req, res) {
        var userId=req.param('id');
        Enterprise.findOne({
                where: {user: userId}
            })
            .populate('user')
            .exec(function (err, users) {
                if (err) res.badRequest(err);
                res.ok(users);
            });
    }
};

