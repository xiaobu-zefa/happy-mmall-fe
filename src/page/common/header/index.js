require('./index.css');
const _mm = require('Util/mm.js');

/** 通用页面头部    */
const header = {
    init() {
        this.bindEvent();
    },
    // 搜索结果的回显
    onLoad() {
        let keyword = _mm.getUrlParam('keyword');
        keyword && $('#search_input').val(keyword);
    },
    // 点击搜索按钮，提交
    // 按下回车键，提交
    bindEvent() {
        $('#search_btn').click(() => {
            this.searchSubmit();
        });
        $('#search_input').keyup((e) => {
            if (e.keyCode === 13) {
                this.searchSubmit();
            }
        });
    },
    // 搜索的提交，如果有搜索关键字提交到产品列表页面，否则回到首页
    searchSubmit() {
        let keyword = $.trim($('#search_input').val());
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        }
        else {
            _mm.goHome();
        }
    }
};
header.init();