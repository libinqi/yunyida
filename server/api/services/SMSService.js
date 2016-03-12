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
            sms_free_sign_name: '注册验证',
            sms_param: {"code": code, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5535393'
        }, function (result) {
            if (!result.success) {
                console.log('短信发送失败：' + result.err_code + '-' + result.msg);
            }
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
            sms_free_sign_name: '身份验证',
            sms_param: {"code": code, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5535391'
        }, function (result) {
            if (!result.success) {
                console.log('短信发送失败：' + result.err_code + '-' + result.msg);
            }
        });
        if (cb)cb(code);
    },
    // 发送找回密码验证码
    SendAudit: function (phoneNumber, name, cb) {
        app.smsSend({
            sms_free_sign_name: '变更验证',
            sms_param: {"name": name, "product": "云驿达APP"},
            rec_num: phoneNumber,
            sms_template_code: 'SMS_5895451'
        }, function (result) {
            if (!result.success) {
                console.log('短信发送失败：' + result.err_code + '-' + result.msg);
            }
        });
        if (cb)cb('发送成功！');
    }
};