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
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        if (!this.data.productId) {
            _mm.goHome();
        }
        this.loadDetail();
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
            let max = parseInt($('.intro-wrap').data('max'));
            if (max === 0) {
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
                () => {
                    window.location.href = './result.html?type=add-cart';
                },
                // 加入失败
                (err) => {
                    _mm.errorTips(err);
                }
            );
        });
        // 增加与减少购买数量按钮
        $(document).on('click', '.p-count-btn', function () {
            let max = parseInt($('.intro-wrap').data('max'));
            // 增加按钮
            if ($(this).hasClass('plus')) {
                if (_this.data.bycount + 1 > max) {
                    _mm.errorTips('不能超过最大购买量~');
                    return;
                }
                _this.data.bycount++;
                $(".p-count").val(_this.data.bycount);
            }
            // 减少按钮
            else {
                if (_this.data.bycount - 1 <= 0) {
                    return;
                }
                _this.data.bycount--;
                $(".p-count").val(_this.data.bycount);
            }
        });
    },
    loadDetail() {
        let html = '';
        $('.page-wrap').html('<div class="loading"></div>');
        _product.getProductDetail(this.data.productId,
            (res) => {
                this.filteData(res);
                html = _mm.renderHtml(templateIndex, res);
                $('.page-wrap').html(html);
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