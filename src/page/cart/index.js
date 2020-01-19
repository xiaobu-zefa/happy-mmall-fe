require('./index.css');
require('Page/common/header/index.js');
const _mm = require('Util/mm.js');
const nav = require('Page/common/nav/index.js');
const _cart = require('Service/cart-service.js');

// const templateIndex = require('./index.string');

const page = {
    data: {
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        this.loadCart();
    },
    bindEvent() {

    },
    loadCart() {

    },
};

$(function () {
    nav.init();

    page.init();
});