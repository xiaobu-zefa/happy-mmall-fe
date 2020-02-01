require('./index.css');
require('Page/common/header/index.js');
const _mm = require('Util/mm.js');
const nav = require('Page/common/nav/index.js');
const _cart = require('Service/cart-service.js');
const _user = require('Service/user-service.js');

const templateIndex = require('./index.string');

const page = {
    data: {
        cartInfo: null,
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {

        _user.checkLogin(
            () => {
                this.loadCart();
            },
            () => {
                _mm.doLogin();
            }
        )

    },
    bindEvent() {
        let _this = this;
        // 商品的选择/取消选择
        $(document).on('click', '.cart-select', function () {
            let productId = $(this).parents('.cart-table').data('product-id');
            // 选中
            if ($(this).is(':checked')) {
                _cart.selectProduct(productId,
                    (res) => {
                        _this.renderCart(res);
                    },
                    () => {
                        _this.showCartError();
                    });
            }
            // 取消选中
            else {
                _cart.unSelectProduct(productId,
                    (res) => {
                        _this.renderCart(res);
                    },
                    () => {
                        _this.showCartError();
                    });
            }
        });
        // 商品全选/取消全选
        $(document).on('click', '.cart-select-all', function () {

            // 选中
            if ($(this).is(':checked')) {
                _cart.selectAllProduct(
                    (res) => {
                        _this.renderCart(res);
                    },
                    () => {
                        _this.showCartError();
                    });
            }
            // 取消选中
            else {
                _cart.unSelectAllProduct(
                    (res) => {
                        _this.renderCart(res);
                    },
                    () => {
                        _this.showCartError();
                    });
            }
        });
        // 商品数量增加/减少
        $(document).on('click', '.count-btn', function () {
            // 当前点击的按钮对应的输入框
            let $input = $(this).siblings('.count-input');

            // 对应的商品ID

            let productId = $(this).parents('.cart-table').data('product-id');


            // 可以购买的最大数量
            let max = $('.count-input').data('max');

            // 当前选择的数量
            let currentCount = parseInt($input.val());

            // 增加数量-按钮
            if ($(this).hasClass('plus')) {
                if (currentCount + 1 > max) {
                    _mm.errorTips('不能超过最大购买数量~');
                    return;
                }
                currentCount++;
            }
            // 减少数量-按钮
            else {
                if (currentCount - 1 <= 0) {
                    return;
                }
                currentCount--;
            }
            _cart.updateProduct(
                {
                    productId: productId,
                    count: currentCount,
                },
                (res) => {
                    _this.renderCart(res);
                },
                () => {
                    _this.showCartError();
                });
        });
        // 删除单个商品按钮
        $(document).on('click', '.cart-delete', function () {
            if (!confirm('确认要删除该商品吗？')) {
                return;
            }
            let productId = $(this).parents('.cart-table').data('product-id');
            _cart.deleteProduct(
                {
                    productIds: productId,
                },
                (res) => {
                    _this.renderCart(res);
                },
                () => {
                    _this.showCartError();
                });
        });
        // 删除选中商品
        $(document).on('click', '.delete-selected', function () {
            if (!confirm('确认要删除选中商品吗？')) {
                return;
            }
            let productIds = [];
            let $selectedItems = $('.cart-select:checked');
            for (let i = 0; i < $selectedItems.length; i++) {
                let currentId = $($selectedItems[i]).parents('.cart-table').data('product-id');
                productIds.push(currentId);
            }
            if (!productIds.length) {
                _mm.errorTips('您还没有选中要删除的商品');
                return;
            }
            _cart.deleteProduct(
                {
                    productIds: productIds.join(','),
                },
                (res) => {
                    _this.renderCart(res);
                },
                () => {
                    _this.showCartError();
                });
        });
        // 去结算
        $(document).on('click', '.btn-submit', function () {
            // 系统中暂时没有 0 元商品，所以这样判断
            if (_this.data.cartInfo.cartTotalPrice <= 0) {
                _mm.errorTips('请选择商品后再提交');
                return;
            }
            window.location.href = './order-confirm.html';
        });
    },
    // 加载购物车
    loadCart() {
        _cart.getCartList(
            (res) => {
                this.renderCart(res);
            },
            () => {
                this.showCartError();
            }
        );
    },
    // 渲染购物车
    renderCart(data) {
        this.filter(data);
        this.data.cartInfo = data;
        let html = _mm.renderHtml(templateIndex, data);
        $('.page-wrap').html(html);
        // 通知导航购物车更新数量
        nav.loadCarProductCount();
    },
    // 处理数据
    filter(data) {
        data.notEmpty = !!data.cartProductVoList.length;
    },
    // 显示错误信息
    showCartError() {
        $('.page-wrap').html('<p class="err-tip">哪里不对了，刷新下试试吧~</p>');
    },
};

$(function () {
    nav.init();

    page.init();
});