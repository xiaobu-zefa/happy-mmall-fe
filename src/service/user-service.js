const _mm = require('Util/mm.js');

const _user = {
    // 用户登录
    login(userInfo, resolve, reject) {
        _mm.request({
            method: 'post',
            url: 'http://localhost:8088/api/user/login.do',
            data: userInfo,
            success: resolve,
            error: reject,
        });
    },
    // 验证用户名是否已经存在
    checkUsername(username, resolve, reject) {
        _mm.request({
            method: 'post',
            url: 'http://localhost:8088/api/user/check_valid.do',
            data: {
                type: 'username',
                str: username,
            },
            success: resolve,
            error: reject,
        });
    },
    // 用户注册
    register(userInfo, resolve, reject) {
        _mm.request({
            method: 'post',
            url: 'http://localhost:8088/api/user/register.do',
            data: userInfo,
            success: resolve,
            error: reject,
        });
    },
    // 检查登录状态
    checkLogin(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/get_user_info.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 退出登录
    logout(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/logout.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 获取用户密码提示问题
    getQuestion(username, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/forget_get_question.do',
            method: 'POST',
            data: {
                username: username,
            },
            success: resolve,
            error: reject
        });
    },
    // 检查密码提示问题答案
    checkAnswer(userInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/forget_check_answer.do',
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        });
    },
    // 重置密码
    resetPassword(userInfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/forget_reset_password.do',
            method: 'POST',
            data: userInfo,
            success: resolve,
            error: reject
        });
    },
    // 获取用户信息
    getUserInfo(resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/get_information.do',
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    // 获取用户信息
    updateUserInfo(userinfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/update_information.do',
            method: 'POST',
            data: userinfo,
            success: resolve,
            error: reject
        });
    },
    // 更改密码(登录状态下)
    updatePassword(userinfo, resolve, reject) {
        _mm.request({
            url: 'http://localhost:8088/api/user/reset_password.do',
            method: 'POST',
            data: userinfo,
            success: resolve,
            error: reject
        });
    },
};
module.exports = _user;