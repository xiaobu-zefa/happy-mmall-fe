require('./index.css');
const _mm = require('Util/mm.js');

const template = require('./index.string');

const navSide = {
    option: {
        name: '',
        navList: [
            {
                name: 'user-center',
                desc: '个人中心',
                href: './user-center.html',
            },
            {
                name: 'order-list',
                desc: '我的订单',
                href: './order-list.html'
            },
            {
                name: 'pass-update',
                desc: '修改密码',
                href: './user-pass-update.html'
            },
            {
                name: 'about',
                desc: '关于MMALL',
                href: './about.html'
            }
        ],
    },
    init(option) {
        // 将传进来的对象与原对象合并，修改原对象（浅拷贝）
        $.extend(this.option, option);
        this.renderNav();
    },
    // 渲染导航菜单
    renderNav() {
        // 计算 active 数据
        for (let i = 0; i < this.option.navList.length; i++) {
            if (this.option.navList[i].name === this.option.name) {
                this.option.navList[i].isActive = true;
            }
        }
        // 渲染 list 数据
        let navHtml = _mm.renderHtml(template, {
            navList: this.option.navList,
        });
        // 将选然后的数据放入容器
        $('.nav-side').html(navHtml);
    }
};
module.exports = navSide;