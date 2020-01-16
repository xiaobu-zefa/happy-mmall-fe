'use strict';

const Hogan = require('hogan.js');

const _mm = {
	// ajax请求
	request({
		method = 'get',
		url = '',
		dataType = 'json',
		data = '',
		success = '',
		error = '',
	}) {
		$.ajax({
			type: method,
			url: url,
			dataType: dataType,
			data: data,
			success: function (res) {
				// 请求成功
				if (0 === res.status) {
					typeof success === 'function' && success(res.data);
				}
				// 没有登陆 需要强制登录
				else if (10 === res.status) {
					this.doLogin();
				}
				// 请求数据错误
				else if (1 === res.status) {
					typeof error === 'function' && error(res.msg);
				}
			}.bind(this),
			error: function (err) {
				typeof error === 'function' && error(err.status);
			}
		});
	},
	// 获取url参数
	getUrlParam(key) {
		let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
		let res = window.location.search.substr(1).match(reg);
		return res ? decodeURIComponent(res[2]) : null;
	},
	// 渲染HTML
	renderHtml(htmlTemplate, data) {
		let template = Hogan.compile(htmlTemplate);
		let res = template.render(data);
		return res;
	},
	// 成功提示
	successTips(msg = '操作成功') {
		alert(msg);
	},
	// 错误提示
	errorTips(msg = '哪里不对了吧~') {
		alert(msg);
	},
	// 字段验证
	validate(value, type) {
		let newValue = $.trim(value);
		// 非空验证
		if ('require' === type) {
			return !!newValue;
		}
		// 手机号验证
		if ('phone' === type) {
			return /^1\d{10}$/.test(newValue);
		}
		// 邮箱格式验证
		if ('email' === type) {
			return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(newValue);
		}
	},
	// 统一登录处理
	doLogin() {
		window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	// 跳回主页
	goHome() {
		window.location.href = './index.html';
	}
};

module.exports = _mm;