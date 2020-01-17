require('./index.css');
require('Page/common/header/index.js');
const nav = require('Page/common/nav/index.js');
const navSide = require('Page/common/nav-side/index.js');
const _user = require('Service/user-service.js')
const _mm = require('Util/mm.js');

const page = {
    init() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad() {
        // 初始化左侧菜单
        navSide.init({
            name: 'pass-update',
        });
    },
    bindEvent() {
        // 点击提交按钮
        $(document).on('click', '.btn-submit', () => {

            let userInfo = {
                password: $.trim($('#old_pass').val()),
                passwordNew: $.trim($('#new_pass').val()),
                passwordConfirm: $.trim($('#new_pass_confirm').val()),
            };
            console.log(userInfo);

            let validateRes = this.formValidate(userInfo);
            if (validateRes.status) {
                _user.updatePassword(
                    {
                        passwordOld: userInfo.password,
                        passwordNew: userInfo.passwordNew,
                    },
                    (data, msg) => {
                        _user.logout(
                            () => {
                                _mm.successTips(msg);
                                _mm.goHome();
                            },
                            () => {
                                _mm.errorTips('修改密码成功,请重新登录');
                            }
                        );
                    },
                    (msg) => {
                        _mm.errorTips(msg);
                    });
            }
            else {
                _mm.errorTips(validateRes.msg);
            }
        });
    },
    // 表单字段验证
    formValidate(formData) {
        let res = {
            status: false,
            msg: '',
        };
        if (!_mm.validate(formData.password, 'require')) {
            res.msg = '旧密码不能为空';
            return res;
        }
        if (formData.passwordNew.length < 6) {
            res.msg = '新密码长度必须大于6位';
            return res;
        }
        if (formData.passwordNew !== formData.passwordConfirm) {
            res.msg = '两次输入的新密码不一致!';
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