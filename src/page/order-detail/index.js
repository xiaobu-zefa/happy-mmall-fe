require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const navSide = require('Page/common/nav-side/index.js');
const _order = require('Service/order-service.js')
const _user = require('Service/user-service.js');
const _mm = require('Util/mm.js');

const templateHtml = require('./index.string');

const page = {

    data: {
        orderNumber: _mm.getUrlParam('orderNumber'),
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {

        _user.checkLogin(
            () => {
                this.loadDetail();
            },
            () => {
                _mm.doLogin();
            }
        );

        // 初始化左侧菜单
        navSide.init({
            name: 'order-list',
        });

    },
    bindEvent() {
        let _this = this;
        // 取消订单
        $(document).on('click', '.order-cancel', function (e) {
            if (!confirm('确定要取消该订单吗？')) {
                return;
            }
            _order.cancelOrder(
                _this.data.orderNumber,
                () => {
                    _mm.successTips('该订单取消成功');
                    _this.loadDetail();
                },
                (errMsg) => {
                    _mm.errorTips(errMsg);
                }
            );
        });
    },
    // 加载详情数据
    loadDetail() {
        _order.getOrderDetail(
            this.data.orderNumber,
            (res) => {
                this.filter(res);
                let html = _mm.renderHtml(templateHtml, res);
                $('.content').html(html);
            },
            () => {
                $('.content').html('<p class="err-tip">订单详情加载失败，刷新试试？</p>');
            });
    },
    // 数据过滤
    filter(data) {
        data.needPay = data.status == 10;
        data.isCancel = data.status == 10;
    }
};

$(function () {
    nav.init();

    page.init();
});