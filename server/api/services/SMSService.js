/**
 * Created by libinqi on 16/1/3.
 */
module.exports = {
    Send: function (phoneNumber, cb) {
        var code = '';
        for (var i = 0; i < 5; i++) {
            code += parseInt(Math.random() * (9 - 1 + 1) + 1);
        }
        if (cb)cb(code);
    }
};