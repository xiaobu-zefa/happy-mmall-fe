require('./index.css');
require('Page/common/nav-simple/index.js');
const _mm = require('Util/mm.js');

$(function () {
    let type = _mm.getUrlParam('type') || 'default';
    let $ele = $('.' + type + '-success');
    $ele.show();
});