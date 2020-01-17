require('./index.css');
require('Page/common/nav-simple/index.js');
const _user = require('Service/user-service.js');
const _mm = require('Util/mm.js');

const formError = {
    show(errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide() {
        $('.error-item').hide().find('.err-msg').text();
    }
};

const page = {

    data: {
        token: '',
        question: '',
        username: '',
    },

    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        this.loadStepUsername();
    },
    bindEvent() {
        // 输入用户名的按钮点击
        $('#submit_username').click(() => {
            let username = $.trim($('#user_name').val());
            if (!username) {
                formError.show('用户名不能为空');
                return;
            }
            // 先检查一下输入的用户名存不存在
            _user.checkUsername(username,
                // 用户名不存在   
                () => {
                    formError.show('用户名不存在！');
                },
                // 如果存在就获取密码提示问题暂存
                // 并跳转到下一步
                () => {
                    _user.getQuestion(username, (res) => {
                        this.data.question = res;
                        this.data.username = username;
                        this.loadStepQuestion();
                    });
                });
        });
        // 输入问题答案按钮的点击
        $('#submit_question').click(() => {
            let answer = $.trim($('#user_question').val());
            if (!answer) {
                formError.show('答案不能为空');
                return;
            }
            // 检查答案正确性
            _user.checkAnswer(
                {
                    username: this.data.username,
                    question: this.data.question,
                    answer: answer,
                },
                // 答案正确
                (res) => {
                    this.data.token = res;
                    this.loadStepPassword();
                },
                // 答案错误
                () => {
                    formError.show('问题回答错误，请仔细回想~');
                },
            );
        });
        // 输入新密码按钮的点击
        $('#submit_password').click(() => {
            let newPassword = $.trim($('#user_password').val());
            if (!newPassword) {
                formError.show('新密码不能为空');
                return;
            }
            if (newPassword.length < 6) {
                formError.show('新密码长度必须大于 6 位');
                return;
            }
            _user.resetPassword(
                {
                    username: this.data.username,
                    passwordNew: newPassword,
                    forgetToken: this.data.token,
                },
                // 重置成功
                // 成功后，需要先退出当前登录
                () => {
                    _user.logout(() => {
                        window.location.href = './result.html?type=password-reset';
                    }, () => {
                        _mm.errorTips('没有正确退出登录，请手动退出重新登录~');
                        window.location.href = './result.html';
                    });
                },
                // 重置失败
                (err) => {
                    formError.show(err);
                });
        });
    },
    // 加载输入用户名步骤
    loadStepUsername() {
        formError.hide();
        $('.step-username').show().siblings().hide();
    },
    // 加载输入问题答案步骤
    loadStepQuestion() {
        formError.hide();
        $('.step-question').show().siblings().hide();
        $('.question').text(this.data.question);
    },
    // 加载输入新密码答案
    loadStepPassword() {
        formError.hide();
        $('.step-password').show().siblings().hide();
    },
};

$(function () {
    page.init();
});