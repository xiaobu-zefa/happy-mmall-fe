const _mm = require('Util/mm.js');


const order = {
    // 加载订单商品列表
    getProductList(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/get_order_cart_product.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 创建订单
    createOrder(shppingId, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/create.do',
            method: 'POST',
            data: shppingId,
            success: resolve,
            error: reject
        });
    },
    // 获取订单列表
    getOrderList(listParam, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/list.do',
            method: 'POST',
            data: listParam,
            success: resolve,
            error: reject
        });
    },
    // 获取订单详情
    getOrderDetail(orderNo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/detail.do',
            method: 'POST',
            data: {
                orderNo
            },
            success: resolve,
            error: reject
        });
    },
    // 取消订单
    cancelOrder(orderNo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/cancel.do',
            method: 'POST',
            data: {
                orderNo
            },
            success: resolve,
            error: reject
        });
    }
};
module.exports = order;