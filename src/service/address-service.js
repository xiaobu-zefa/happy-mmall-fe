const _mm = require('Util/mm.js');


const address = {
    // 获取地址列表
    getAddressList(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/shipping/list.do',
            method: 'POST',
            data: {
                pageSize: 50,
            },
            success: resolve,
            error: reject
        });
    },
    // 添加新地址
    addAddress(addressInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/shipping/add.do',
            method: 'POST',
            data: addressInfo,
            success: resolve,
            error: reject
        });
    },
    // 更新旧地址
    updateAddress(addressInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/shipping/update.do',
            method: 'POST',
            data: addressInfo,
            success: resolve,
            error: reject
        });
    },
    // 删除地址
    deleteAddress(shippingInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/shipping/del.do',
            method: 'POST',
            data: shippingInfo,
            success: resolve,
            error: reject
        });
    },
    // 读取选中的地址信息
    getSelectAddressInfo(shippingInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/shipping/select.do',
            method: 'POST',
            data: shippingInfo,
            success: resolve,
            error: reject
        });
    }
};
module.exports = address;