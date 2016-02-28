/**
* MessageUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: true,
  attributes: {
    messageUserId: {type: 'integer', primaryKey: true, autoIncrement: true},//消息Id
    validate: {type: 'string'},//有效期
    status: {type: 'boolean', defaultsTo: true},//状态
    message: {
      model: 'message'//所属用户
    },
    user: {
      model: 'user'//所属用户
    }
  }
};

