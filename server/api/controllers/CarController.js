/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var uuid = require('node-uuid'),
    path = require('path');

module.exports = {
    /**
     * 上传车辆相关照片(行驶证、驾驶证、车辆照片)
     *
     * (POST /car/upload)
     */
    upload: function (req, res) {
        req.file('avatar').upload({
            dirname: sails.config.appPath + '/assets/images/car',
            maxBytes: 10000000            // 允许最大上传的文件大小为10MB
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // 如果文件上传不成功,返回一个错误.003
            if (uploadedFiles.length === 0) {
                return res.badRequest('文件上传失败');
            }

            var avatarId = uploadedFiles[0].fd;
            avatarId = avatarId.replace(sails.config.appPath + '\\assets\\images\\car\\', '');
            avatarId = avatarId.replace(sails.config.appPath + '/assets/images/car/', '');
            return res.send(avatarId.toLowerCase());
        });
    },
    /**
     * 通过图片资源Id获取图片
     *
     * (GET /car/avatar/:id)
     */
    avatar: function (req, res) {
        req.validate({
            id: 'string'
        });

        var avatarFd = sails.config.appPath + '/assets/images/car/' + req.param('id');
        var skipperDisk = require('skipper-disk');
        var fileAdapter = skipperDisk(/* optional opts */);

        // Stream the file down
        fileAdapter.read(avatarFd)
            .on('error', function (err) {
                return res.serverError(err);
            })
            .pipe(res);
    }
};

