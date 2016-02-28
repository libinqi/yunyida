/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: true,
  attributes: {
    messageId: {type: 'integer', primaryKey: true, autoIncrement: true},//消息Id
    messageType: {type: 'string', required: true, enum: ['通知消息', '系统消息'],defaultsTo:'系统消息'},//消息类型
    userType: {type: 'string', required: true, enum: ['货主', '物流企业', '司机']},//用户类型
    title: {type: 'string'},//标题
    content: {type: 'string',required: true},//内容
    validate: {type: 'string'},//有效期
    status: {type: 'boolean', defaultsTo: true}//状态
  }
};

