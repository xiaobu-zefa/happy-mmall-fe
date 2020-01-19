const _mm = require('Util/mm.js');


const product = {
    // 获取商品列表
    getProductList(listParam, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/product/list.do',
            method: 'POST',
            data: listParam,
            success: resolve,
            error: reject
        });
    },
    // 获取商品详细信息
    getProductDetail(productId, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/product/detail.do?',
            method: 'GET',
            data: { productId },
            success: resolve,
            error: reject
        });
    }
};

module.exports = product;