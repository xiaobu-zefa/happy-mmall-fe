const _mm = require('Util/mm.js');


const payment = {
    // 获取支付信息
    getPaymentInfo(orderNo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/pay.do',
            method: 'POST',
            data: {
                orderNo
            },
            success: resolve,
            error: reject
        });
    },
    // 获取支付状态
    getPaymentStatus(orderNo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/order/query_order_pay_status.do',
            method: 'POST',
            data: {
                orderNo
            },
            success: resolve,
            error: reject
        });
    },
};
module.exports = payment;