require('./index.css');
require('Page/common/header/index.js');
const _mm = require('Util/mm.js');
const nav = require('Page/common/nav/index.js');
const _product = require('Service/product-service.js');
const Pagination = require('Util/pagination/index.js')

const templateIndex = require('./index.string');

const page = {

    data: {
        listParam: {
            keyword: _mm.getUrlParam('keyword') || '',
            categoryId: _mm.getUrlParam('categoryId') || '',
            orderBy: _mm.getUrlParam('orderBy') || 'default',
            pageNum: _mm.getUrlParam('pageNum') || 1,
            pageSize: _mm.getUrlParam('pageSize') || 20,
        },
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        this.loadList();
    },
    bindEvent() {
        let _this = this;

        // 排序的点击事件
        $('.sort-item').click(function () {

            if (_this.data.listParam.keyword && _this.data.listParam.categoryId) {
                delete _this.data.listParam.categoryId;
            }

            // 如果是在原先按钮上点击
            if ($(this).hasClass('active')) {


                if ($(this).data('type') === 'price') {
                    if ($(this).hasClass('asc')) {
                        $(this).removeClass('asc').addClass('desc');
                        _this.data.listParam.orderBy = 'price_desc';
                    }
                    else {
                        $(this).removeClass('desc').addClass('asc');
                        _this.data.listParam.orderBy = 'price_asc';
                    }
                    _this.loadList();
                }

                return;
            }

            $(this).addClass('active').siblings('.sort-item').removeClass('active');

            _this.data.listParam.pageNum = 1;

            // 如果点击的是 默认排序
            if ($(this).data('type') === 'default') {
                _this.data.listParam.orderBy = 'default';
            }
            // 如果点击的是按价格排序
            else if ($(this).data('type') === 'price') {
                _this.data.listParam.orderBy = 'price_asc';
            }

            _this.loadList();

        });
    },
    // 加载 list 数据
    loadList() {

        $('.p-list-con').html('<div class="loading"></div>');


        let listParam = this.data.listParam;
        let listHtml = '';
        _product.getProductList(listParam,
            (res) => {
                listHtml = _mm.renderHtml(templateIndex, {
                    list: res.list,
                });
                $('.p-list-con').html(listHtml);
                this.loadPagination({
                    hasPreviousPage: res.hasPreviousPage,
                    prePage: res.prePage,
                    hasNextPage: res.hasNextPage,
                    nextPage: res.nextPage,
                    pageNum: res.pageNum,
                    pages: res.pages,
                });
            },

            (errMsg) => {
                _mm.errorTips(errMsg);
            });
    },
    // 加载分页信息
    loadPagination(pageInfo) {
        this.pagination ? '' : this.pagination = new Pagination();
        this.pagination.render($.extend({}, pageInfo, {
            container: $('.pagination'),
            onSelectPage: (pageNum) => {
                this.data.listParam.pageNum = pageNum;
                this.loadList();
            },
        }));
    },
};

$(function () {
    nav.init();

    page.init();
});