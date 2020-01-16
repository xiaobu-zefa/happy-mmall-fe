require('./index.css');
const _user = require('Service/user-service.js');

const page = {
    init() {
        this.bindEvent();
        this.loadUserInfo();
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
};

module.exports = page;