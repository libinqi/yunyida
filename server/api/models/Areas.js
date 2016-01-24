/**
* Areas.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {type: 'string', primaryKey: true},//区域Id
    areaName: {type: 'string'},//区域名称
    parentId: {type: 'string'},//父级Id
    shortName: {type: 'string'},//简称
    lng: {type: 'string'},//经度
    lat: {type: 'string'},//纬度
    level: {type: 'integer'},//层级
    sort: {type: 'integer'}//排序
  }
};

