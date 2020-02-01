require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const navSide = require('Page/common/nav-side/index.js');

$(function () {

    nav.init();

    navSide.init({
        name: 'about',
    });
})