require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const _payment = require('Service/payment-service.js')
const _user = require('Service/user-service.js');
const _mm = require('Util/mm.js');

const htmltemplate = require('./index.string');

const page = {

    data: {
        orderNumber: _mm.getUrlParam('orderNumber'),
    },

    init() {
        this.onLoad();
    },
    onLoad() {
        _user.checkLogin(
            () => {
                _payment.getPaymentInfo(
                    this.data.orderNumber,
                    (res) => {
                        let html = _mm.renderHtml(htmltemplate, res);
                        $('.page-wrap').html(html);
                        // 监听订单状态
                        this.listenOrderStatus();
                    },
                    () => {
                        $('.page-wrap').html('<p class="err-tips">二维码请求失败</p>');
                    }
                );
            },
            () => {
                _mm.doLogin();
            }
        );
    },
    // 监听订单状态
    listenOrderStatus() {
        this.paymentTimer = setInterval(() => {
            _payment.getPaymentStatus(
                this.data.orderNumber,
                (res) => {
                    if (res === true) {
                        window.location.href = './result.html?type=payment&orderNumber=' + this.data.orderNumber;
                    }
                },
                () => {

                }
            );
        }, 5e3);
    }
};

$(function () {
    nav.init();

    page.init();
});