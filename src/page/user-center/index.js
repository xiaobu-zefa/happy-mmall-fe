require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const navSide = require('Page/common/nav-side/index.js');
const _user = require('Service/user-service.js')
const _mm = require('Util/mm.js');

const templateHtml = require('./index.string');

const page = {
    init() {
        this.onLoad();
    },
    onLoad() {
        _user.checkLogin(
            () => {
                this.loadUserInfo();
            },
            () => {
                _mm.doLogin();
            }
        );
        // 初始化左侧菜单
        navSide.init({
            name: 'user-center',
        });
    },
    // 加载用户信息
    loadUserInfo() {
        let userHtml = '';
        _user.getUserInfo(
            (res) => {
                userHtml = _mm.renderHtml(templateHtml, res);
                $('.panel-body').html(userHtml);
            },
            (errMsg) => {
                _mm.errorTips(errMsg);
            });
    }
};

$(function () {
    page.init();
    nav.init();
});