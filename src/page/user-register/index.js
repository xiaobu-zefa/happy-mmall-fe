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
        this.bindEvent();
    },
    bindEvent() {
        // 异步验证用户名是否存在
        $('#user_name').blur(function () {
            let username = $.trim($(this).val());
            if (!username) return;
            _user.checkUsername(username, function () {
                formError.hide();
            }, function (errMgs) {
                formError.show(errMgs);
            });
        });
        // 点击注册按钮或者按下回车键
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
            passwordConfirm: $.trim($('#user_password_confirm').val()),
            phone: $.trim($('#user_phone').val()),
            email: $.trim($('#user_email').val()),
            question: $.trim($('#user_question').val()),
            answer: $.trim($('#user_answer').val()),
        };
        let validateRes = this.formValidate(formData);
        // 表单验证成功提交
        if (validateRes.status) {
            _user.register(
                formData,
                // 注册成功，跳转
                function () {
                    window.location.href = './result.html?type=register';
                },
                // 注册失败，提示
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
        // 验证用户名不能为空
        if (!_mm.validate(formData.username, 'require')) {
            res.msg = '用户名不能为空';
            return res;
        }
        // 验证密码不能为空
        if (!_mm.validate(formData.password, 'require')) {
            res.msg = '密码不能为空';
            return res;
        }
        // 验证密码长度
        if (formData.password.length < 6) {
            res.msg = '密码长度不能小于 6 位';
            return res;
        }
        // 验证两次密码是否一致
        if (formData.password != formData.passwordConfirm) {
            res.msg = '两次密码输入不一致';
            return res;
        }
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
});