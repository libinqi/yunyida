/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'homepage'
    },

    /***************************************************************************
     *                                                                          *
     * 城市数据相关API...                                                *
     *                                                                          *
     ***************************************************************************/
    '/areas/getCityData': 'AreasController.getCityData',
    '/areas/getStreetData': 'AreasController.getStreetData',

    /***************************************************************************
     *                                                                          *
     * 用户登录,注册等相关API...                                                *
     *                                                                          *
     ***************************************************************************/
    '/user/login': 'UserController.login',
    '/user/checkIsExist': 'UserController.checkIsExist',
    '/user/list': 'UserController.list',
    '/user/getCarrier': 'UserController.getCarrier',
    'post /user/register': 'UserController.register',
    'post /user/restPwd': 'UserController.restPwd',
    'post /user/changePwd': 'UserController.changePwd',
    'post /user/update': 'UserController.update',
    'post /user/uploadAvatar': 'UserController.uploadAvatar',
    '/user/avatar/:id': 'UserController.avatar',
    '/user/getRegValidCode': 'UserController.getRegValidCode',
    '/user/getFindValidCode': 'UserController.getFindValidCode',
    '/user/checkValidCode': 'UserController.checkValidCode',

    /***************************************************************************
     *                                                                          *
     * 货源相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    'post /goods/add': 'GoodsController.add',
    '/goods/list': 'GoodsController.list',

    /***************************************************************************
     *                                                                          *
     * 收发货地址相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    '/goodsAddress/userGoodsAddress': 'GoodsAddressController.userGoodsAddress',
    'post /goodsAddress/add': 'GoodsAddressController.add',
    'post /goodsAddress/update': 'GoodsAddressController.update',
    'post /goodsAddress/deleteGoodsAddress': 'GoodsAddressController.deleteGoodsAddress',
    'post /goodsAddress/defaultGoodsAddress': 'GoodsAddressController.defaultGoodsAddress',

    /***************************************************************************
     *                                                                          *
     * 专线相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    '/goodsLine/userGoodsLine': 'GoodsLineController.userGoodsLine',
    'post /goodsLine/add': 'GoodsLineController.add',
    'post /goodsLine/update': 'GoodsLineController.update',
    'post /goodsLine/deleteGoodsLine': 'GoodsLineController.deleteGoodsLine',


    /***************************************************************************
     *                                                                          *
     * 订单相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    '/order/userOrder': 'GoodsOrderController.userOrder',
    '/order/list': 'GoodsOrderController.list',
    '/order/carrierOrder': 'GoodsOrderController.carrierOrder',
    '/order/carrierEvaluation': 'GoodsOrderController.carrierEvaluation',
    '/order/carrierOrderStatis': 'GoodsOrderController.carrierOrderStatis',
    '/order/shipperOrderStatis': 'GoodsOrderController.shipperOrderStatis',
    'post /order/addOrder': 'GoodsOrderController.addOrder',
    'post /order/postionOrder': 'GoodsOrderController.postionOrder',
    'post /order/unAddOrder': 'GoodsOrderController.unAddOrder',
    'post /order/updateOrder': 'GoodsOrderController.updateOrder',
    'post /order/confirmCarrier': 'GoodsOrderController.confirmCarrier',
    'post /order/cancelOrder': 'GoodsOrderController.cancelOrder',
    'post /order/refreshOrder': 'GoodsOrderController.refreshOrder',
    'post /order/deleteOrder': 'GoodsOrderController.deleteOrder',
    'post /order/evaluateOrder': 'GoodsOrderController.evaluateOrder',

    /***************************************************************************
     *                                                                          *
     * 物流企业相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    'post /enterprise/register': 'EnterpriseController.register',
    'post /enterprise/update': 'EnterpriseController.update',
    'post /enterprise/audit': 'EnterpriseController.audit',
    '/enterprise/list': 'EnterpriseController.list',
    '/enterprise/:id': 'EnterpriseController.getEnterprise',

    /***************************************************************************
     *                                                                          *
     * 司机相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    'post /driver/register': 'DriverController.register',
    'post /driver/update': 'DriverController.update',
    'post /driver/audit': 'DriverController.audit',
    '/driver/list': 'DriverController.list',
    '/driver/:id': 'DriverController.getDriver',

    /***************************************************************************
     *                                                                          *
     * 车辆相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    'post /car/upload': 'CarController.upload',
    '/car/avatar/:id': 'CarController.avatar',

    /***************************************************************************
     *                                                                          *
     * 消息相关API...                                                            *
     *                                                                          *
     ***************************************************************************/
    'post /message/send': 'MessageController.send',
    '/message/userMessage': 'MessageController.userMessage',
    '/message/list': 'MessageController.list',
    'delete /message/:id': 'MessageController.delete',
};
