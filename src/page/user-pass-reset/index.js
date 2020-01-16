require('./index.css');
require('Page/common/nav-simple/index.js');
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