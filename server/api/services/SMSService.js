/**
 * Created by libinqi on 16/1/3.
 */
var App = require('alidayu-node');
var app = new App(sails.config.alidayu.appKey, sails.config.alidayu.appSecret);

module.exports = {
    // 发送注册验证码
    SendRegCode: function (phoneNumber, cb) {
        var code = '';
        for (var i = 0; i < 5; i++) {
            code += parseInt(Math.random() * (9 - 1 + 1) + 1);
        }
        app.smsSend({
            sms_free_sign_name: '用户注册验证码',
            sms_param: {"code": code, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5535393'
        });
        if (cb)cb(code);
    },
    // 发送找回密码验证码
    SendFindCode: function (phoneNumber, cb) {
        var code = '';
        for (var i = 0; i < 5; i++) {
            code += parseInt(Math.random() * (9 - 1 + 1) + 1);
        }
        app.smsSend({
            sms_free_sign_name: '修改密码验证码',
            sms_param: {"code": code, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5535391'
        });
        if (cb)cb(code);
    },
    // 发送找回密码验证码
    SendAudit: function (phoneNumber,name, cb) {
        app.smsSend({
            sms_free_sign_name: '审核通过通知',
            sms_param: {"name": name, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5895451'
        });
        if (cb)cb('发送成功！');
    }
};