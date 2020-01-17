require('Page/common/nav-simple/index.js');
require('./index.css');
const _mm = require('Util/mm.js');
const _user = require('Service/user-service.js');

const formError = {
    show(errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide() {
        $('.error-item').hide().find('.err-msg').text();
    }
};

const page = {
    init() {
        // 先判断是不是已经登录了
        _user.checkLogin((res) => {
            _mm.successTips('当前已有用户' + res.username + '在线~');
            _mm.goHome();
        });
        this.bindEvent();
    },
    bindEvent() {
        // 点击登录按钮或者按下回车键
        $('#submit').click(() => {
            this.submit();
        });
        $('.user-content').keyup((e) => {
            if (e.keyCode === 13) {
                this.submit();
            }
        });
    },
    // 提交表单
    submit() {
        let formData = {
            username: $.trim($('#user_name').val()),
            password: $.trim($('#user_password').val()),
        };
        let validateRes = this.formValidate(formData);
        // 表单验证成功提交
        if (validateRes.status) {
            _user.login(
                formData,
                // 登录成功，跳转
                function (res) {
                    window.location.href = _mm.getUrlParam('redirect') || './index.html';
                },
                // 登录失败，提示
                function (errMsg) {
                    formError.show(errMsg);
                });
        }
        // 表单验证失败提示错误
        else {
            formError.show(validateRes.msg);
        }
    },
    // 表单字段验证
    formValidate(formData) {
        let res = {
            status: false,
            msg: '',
        };
        if (!_mm.validate(formData.username, 'require')) {
            res.msg = '用户名不能为空';
            return res;
        }
        if (!_mm.validate(formData.password, 'require')) {
            res.msg = '密码不能为空';
            return res;
        }
        res.status = true;
        return res;
    }
};

$(function () {
    page.init();
});