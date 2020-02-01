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
        this.bindEvent();
        // 初始化左侧菜单
        navSide.init({
            name: 'user-center',
        });
    },
    bindEvent() {
        // 点击提交按钮
        $(document).on('click', '.btn-submit', () => {

            let userInfo = {
                phone: $.trim($('#phone').val()),
                email: $.trim($('#email').val()),
                question: $.trim($('#question').val()),
                answer: $.trim($('#answer').val()),
            };

            let validateRes = this.formValidate(userInfo);
            if (validateRes.status) {
                _user.updateUserInfo(
                    userInfo,
                    (data, msg) => {
                        _mm.successTips(msg);
                        window.location.href = './user-center.html';
                    },
                    (msg) => {
                        _mm.errorTips(msg);
                    }
                );
            }
            else {
                _mm.errorTips(validateRes.msg);
            }
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
    },
    // 表单字段验证
    formValidate(formData) {
        let res = {
            status: false,
            msg: '',
        };
        // 验证手机号格式
        if (!_mm.validate(formData.phone, 'phone')) {
            res.msg = '手机号格式不正确';
            return res;
        }
        // 验证邮箱格式
        if (!_mm.validate(formData.email, 'email')) {
            res.msg = '邮箱格式不正确';
            return res;
        }
        // 验证密码提示问题
        if (!_mm.validate(formData.question, 'require')) {
            res.msg = '密码提示问题不能为空';
            return res;
        }
        // 验证密码提示问题答案
        if (!_mm.validate(formData.answer, 'require')) {
            res.msg = '密码答案不能为空';
            return res;
        }
        res.status = true;
        return res;
    }
};

$(function () {
    page.init();
    nav.init();
});