require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const navSide = require('Page/common/nav-side/index.js');
const Pagination = require('Util/pagination/index.js');
const _order = require('Service/order-service.js')
const _mm = require('Util/mm.js');

const templateHtml = require('./index.string');

const page = {

    data: {
        listParam: {
            pageNum: 1,
            pageSize: 10,
        }
    },

    init() {
        this.onLoad();
    },
    onLoad() {
        // 初始化左侧菜单
        navSide.init({
            name: 'order-list',
        });

        this.loadOrderList();
    },
    // 加载订单列表
    loadOrderList() {
        let _this = this;
        let html = '';
        _order.getOrderList(
            this.data.listParam,
            (res) => {
                html = _mm.renderHtml(templateHtml, res);
                $('.order-list-con').html(html);
                this.loadPagination({
                    hasPreviousPage: res.hasPreviousPage,
                    prePage: res.prePage,
                    hasNextPage: res.hasNextPage,
                    nextPage: res.nextPage,
                    pageNum: res.pageNum,
                    pages: res.pages,
                });
            },
            () => {
                $('.order-list-con').html('<p class="err-tip">加载订单失败，请刷新~</p>');
            }
        );
    },

    // 加载分页信息
    loadPagination(pageInfo) {
        this.pagination ? '' : this.pagination = new Pagination();
        this.pagination.render($.extend({}, pageInfo, {
            container: $('.pagination'),
            onSelectPage: (pageNum) => {
                this.data.listParam.pageNum = pageNum;
                this.loadOrderList();
            },
        }));
    },
};

$(function () {
    nav.init();

    page.init();
});