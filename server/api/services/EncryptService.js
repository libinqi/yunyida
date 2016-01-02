/**
 * Created by libinqi on 16/1/2.
 */
var crypto = require('crypto');

module.exports = {
    Encrypt: function (text) {
        var cipher = crypto.createCipher('aes-256-cbc',sails.config.session.secret);
        var crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    Decrypt: function (pwd) {
        var decipher = crypto.createDecipher('aes-256-cbc',sails.config.session.secret);
        var dec = decipher.update(pwd,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    }
};