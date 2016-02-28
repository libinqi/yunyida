/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

exports.index = function(req, res) {

}
// user login
exports.login = function(req, res) {
   var userName=req.query.userName;
   var password=req.query.password;
    if(userName=="admin"&&password=="yunyida56")
    {
        res.json({
            duties: "系统管理员",
            password: "e10adc3949ba59abbe56e057f20f883e",
            phone: "15388948861",
            qq: "",
            realname: "系统管理员",
            userid: "e10adc3949ba59abbe56e057f20f883e",
            username: "admin",
            usertype: "4",
            usertypename: "运营系统管理员"
        });
    }
    else{
        res.json({});
    }
};
