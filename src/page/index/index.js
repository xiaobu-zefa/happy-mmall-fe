require('./index.css');
require('Page/common/header/index.js');
require('Util/slider/index.js');
const _mm = require('Util/mm.js');
const nav = require('Page/common/nav/index.js');

const templateBanner = require('./banner.string');

$(function () {
    nav.init();

    let bannerHtml = _mm.renderHtml(templateBanner);
    $('.banner-con').html(bannerHtml);
    var $slider = $('.banner').unslider({
        dots: true
    });
    $('.prev').click(() => {
        $slider.data('unslider')['prev']();
    });
    $('.next').click(() => {
        $slider.data('unslider')['next']();
    });

});