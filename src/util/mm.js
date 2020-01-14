'use strict';

var _mm = {
	var _this = this;
	request : function(param){
		$.ajax({
			type : param.method || 'get',
			url : param.url || '',
			dataType : param.data || '',
			sucess : function(res){
				// 请求成功
				if(0 === res.status){
					typeof param.success === 'function' && param.success(param.data,data.msg);
				}	
				// 没有登陆 需要强制登录
				else if(10 === res.status){
					_this.doLogin();
				}
				// 请求数据错误
				else if(1 === res.status){
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			error : function(err){
					typeof param.error === 'function' && param.error(res.status);
			}
		});
	},
	// 统一登录处理
	doLogin : function(){
		window.location.href = './login.html?redirect=' + encodeURI(window.location.href);
	}

}