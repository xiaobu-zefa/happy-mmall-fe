require('./index.css');
require('Page/common/header/index.js');
const _mm = require('Util/mm.js');
const nav = require('Page/common/nav/index.js');
const _product = require('Service/product-service.js');
const _cart = require('Service/cart-service.js');

const templateIndex = require('./index.string');

const page = {
    data: {
        productId: _mm.getUrlParam('productId'),
        bycount: 1,
        stock: 0,
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        if (!this.data.productId) {
            _mm.goHome();
        }
        this.loadDetail(() => {
            this.bandBtn();
        });
    },
    bindEvent() {
        _this = this;
        // 鼠标进入缩略图
        $(document).on('mouseenter', '.sub-img', function () {
            console.log(1);
            $('.main-img').attr('src', $(this).attr('src'));
        });
        // 加入购物车按钮
        $(document).on('click', '.cart-add', function () {
            if ($(this).attr('disabled')) {
                _mm.errorTips('商品已经售空~');
                return;
            }
            // 加入购物车
            _cart.addCart(
                {
                    productId: _this.data.productId,
                    count: _this.data.bycount,
                },
                // 加入成功
                (res) => {

                },
                // 加入失败
                (err) => {
                    _mm.doLogin();
                }
            );
        });
        // 增加与减少购买数量按钮
        $(document).on('click', '.p-count-btn', function () {

            if ($(this).attr('disabled')) {
                _mm.errorTips('商品已经售空~');
                return;
            }

            // 增加按钮
            if ($(this).hasClass('plus')) {
                if (_this.data.bycount + 1 <= _this.data.stock) {
                    _this.data.bycount++;
                    $(".p-count").val(_this.data.bycount);
                }
                else {
                    _mm.errorTips('已经超过最大购买量~');
                }
            }
            // 减少按钮
            else {
                if (_this.data.bycount - 1 > 0) {
                    _this.data.bycount--;
                    $(".p-count").val(_this.data.bycount);
                }
                else {
                    _mm.errorTips('最少购买一个~');
                }
            }

        });
    },
    loadDetail(callback) {
        let html = '';
        $('.page-wrap').html('<div class="loading"></div>');
        _product.getProductDetail(this.data.productId,
            (res) => {
                this.filteData(res);
                html = _mm.renderHtml(templateIndex, res);
                $('.page-wrap').html(html);
                callback && callback();
            },
            (errMsg) => {
                $('.page-wrap').html('<p class="err-tip">' + errMsg + '</p>');
            });
    },
    // 过滤数据
    filteData(data) {
        data.subImages = data.subImages.split(',');
        this.data.stock = data.stock;
    },
    // 如果库存为 0 禁用所有按钮
    bandBtn() {
        if (this.data.stock <= 0) {
            $('.cart-add').attr({ 'disabled': 'disabled' });
            $('.p-count-btn').attr({ 'disabled': 'disabled' });
        }
    }
};

$(function () {
    nav.init();

    page.init();
});