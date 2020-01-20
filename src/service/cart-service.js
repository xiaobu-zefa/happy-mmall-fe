const _mm = require('Util/mm.js');


const cart = {
    // 获取购物车商品数量
    getCartProductCount(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/get_cart_product_count.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 加入购物车
    addCart(productInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/add.do',
            method: 'POST',
            data: productInfo,
            success: resolve,
            error: reject
        });
    },
    // 获取购物车列表
    getCartList(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/list.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 选中单个商品
    selectProduct(productId, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/select.do',
            method: 'POST',
            data: {
                productId
            },
            success: resolve,
            error: reject
        });
    },
    // 取消选中单个商品
    unSelectProduct(productId, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/un_select.do',
            method: 'POST',
            data: {
                productId,
            },
            success: resolve,
            error: reject
        });
    },
    // 全选
    selectAllProduct(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/select_all.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 取消全选
    unSelectAllProduct(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/un_select_all.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 更新商品数量
    updateProduct(productInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/update.do',
            method: 'POST',
            data: productInfo,
            success: resolve,
            error: reject
        });
    },
    // 删除购物车商品（支持批量）
    deleteProduct(productInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/cart/delete_product.do',
            method: 'POST',
            data: productInfo,
            success: resolve,
            error: reject
        });
    }
};
module.exports = cart;