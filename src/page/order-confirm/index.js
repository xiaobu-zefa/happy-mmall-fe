require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const _mm = require('Util/mm.js');
const _address = require('Service/address-service.js');
const _order = require('Service/order-service.js');
const addressModal = require('./address-modal.js');

const templateAddress = require('./address-list.string');
const templateProduct = require('./product-list.string');

const page = {
    data: {
        selectedAddressId: null,
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent() {
        let _this = this;
        // 选择地址
        $(document).on('click', '.address-item', function () {
            $(this).addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');
        });
        // 使用新地址
        $(document).on('click', '.address-add', function () {
            addressModal.show({
                isUpdate: false,
                onSuccess: function () {
                    _this.loadAddressList();
                },
            });
        });
        // 编辑旧地址
        $(document).on('click', '.address-update', function (e) {
            e.stopPropagation();
            // 读取选择的地址信息
            _address.getSelectAddressInfo(
                {
                    shippingId: $(this).parents('.address-item').data('id'),
                },
                (data) => {
                    // 显示模态框
                    addressModal.show({
                        isUpdate: true,
                        data,
                        onSuccess: function () {
                            _this.loadAddressList();
                        },
                    });
                },
                (errMsg) => {
                    _mm.errorTips(errMsg);
                    return;
                }
            );

        });
        // 删除地址
        $(document).on('click', '.address-delete', function (e) {
            e.stopPropagation();
            let shippingId = $(this).parents('.address-item').data('id');

            _address.deleteAddress({ shippingId },
                () => {
                    _this.loadAddressList();
                },
                (errMsg) => {
                    _mm.errorTips(errMsg);
                });
        });
        // 订单的提交
        $(document).on('click', '.order-submit', function () {
            if (!_this.data.selectedAddressId) {
                _mm.errorTips('请选择收货地址');
                return;
            }
            _order.createOrder(
                _this.data.selectedAddressId,
                (data) => {
                    window.location.href = 'payment.html?orderNumber=' + data.orderNo;
                },
                (errMsg) => {
                    _mm.errorTips(errMsg);
                });
        });
    },
    // 加载地址列表
    loadAddressList() {
        let html = '';
        _address.getAddressList(
            (res) => {
                this.filter(res.list);
                html = _mm.renderHtml(templateAddress, res);
                $('.address-con').html(html);
            },
            () => {
                $('.address-con').html('<p class="err-tip">地址加载失败</p>');
            }
        );
    },
    // 加载商品列表
    loadProductList() {
        let html = '';
        _order.getProductList(
            (res) => {
                html = _mm.renderHtml(templateProduct, res);
                $('.product-con').html(html);
            },
            (errMsg) => {
                $('.product-con').html('<p class="err-tip">商品信息加载失败</p>');
            }
        );
    },
    // 处理数据
    filter(data) {

        if (!data) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.data.selectedAddressId) {
                data[i].active = true;
            }
            else {
                data[i].active = false;
            }
        }
    }
};

$(function () {
    nav.init();

    page.init();
});