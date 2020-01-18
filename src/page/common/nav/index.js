require('./index.css');
const _user = require('Service/user-service.js');
const _cart = require('Service/cart-service.js');

const page = {
    init() {
        this.bindEvent();
        this.onLoad();
    },
    onLoad() {
        this.loadUserInfo();
        this.loadCarProductCount();
    },
    bindEvent() {
        // 点击退出登录
        $('.logout').click(function () {
            _user.logout(
                function (res) {
                    window.location.reload();
                },
                function (errMsg) {
                    _mm.errorTips(errMsg);
                });
        });
    },
    // 加载用户信息
    loadUserInfo() {
        _user.checkLogin(
            function (res) {
                $('.user.not-login').hide().siblings('.user.login').show()
                    .find('.username').text(res.username);
            },
            function (errMsg) {
                console.log(errMsg);
            });
    },
    // 加载购物车商品数量
    loadCarProductCount() {
        _cart.getCartProductCount(
            // 获取成功
            (count) => {
                $('.cart-count').text(count);
            },
            // 获取失败
            (errMsg) => {
                _mm.errorTips(errMsg);
            },
        );
    }
};

module.exports = page;