const _mm = require('Util/mm.js');
const _address = require('Service/address-service.js');
const templateAddressModal = require('./address-modal.string');
const _cities = require('Util/cities/index.js');

const addressModal = {

    option: {

    },

    show(option) {
        this.option = option;
        // 渲染
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    hide() {
        $('.modal-wrap').empty();
    },
    bindEvent() {
        let _this = this;
        // 关闭模态框
        $('.modal').on('click', '.close', function () {
            _this.hide();
        });
        // 省份的选择
        $('.modal').on('change', "#receiver-province", function () {
            _this.loadCities($(this).val());
        });
        // 保存收货地址
        $('.modal').on('click', ".address-btn", function (e) {
            let receiverInfo = _this.getReceieverInfo();

            // 字段验证失败
            if (!receiverInfo.status) {
                _mm.errorTips(receiverInfo.errMsg);
                return;
            }

            // 更新旧地址
            if (_this.option.isUpdate) {
                receiverInfo.data.id = _this.option.data.id;
                _address.updateAddress(
                    receiverInfo.data,
                    () => {
                        _this.hide();
                        _mm.successTips('地址更新成功');
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess();
                    },
                    (errMsg) => {
                        _mm.errorTips(errMsg);
                    }
                );
            }
            // 使用新地址
            else {
                _address.addAddress(
                    receiverInfo.data,
                    () => {
                        _this.hide();
                        _mm.successTips('地址添加成功~');
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess();
                    },
                    (errMsg) => {
                        _mm.errorTips(errMsg);
                    }
                );
            }
        });
    },

    // 加载模态框
    loadModal() {
        let html = _mm.renderHtml(templateAddressModal, this.option.data);

        $('.modal-wrap').html(html);

        // 加载省份
        this.loadProvince();
    },

    // 加载省份
    loadProvince() {
        let html = '<option value="">请选择</option>';
        let provinces = _cities.getProvinces() || [];
        for (let i = 0; i < provinces.length; i++) {
            html += '<option value="' + provinces[i] + '">' + provinces[i] + '</option>'
        }
        $('.modal-wrap').find('#receiver-province').html(html);
    },
    // 加载城市
    loadCities(provinceName) {
        let html = '<option value="">请选择</option>';
        let cities = _cities.getCities(provinceName) || [];
        for (let i = 0; i < cities.length; i++) {
            html += '<option value="' + cities[i] + '">' + cities[i] + '</option>'
        }
        $('.modal-wrap').find('#receiver-city').html(html);
    },
    // 获取收件人信息并做验证
    getReceieverInfo() {
        let receiverInfo = {};

        let res = {
            status: false,
            errMsg: '',
            receiverInfo: null,
        };

        receiverInfo.receiverName = $.trim($('#receiver-name').val());
        receiverInfo.receiverProvince = $.trim($('#receiver-province').val());
        receiverInfo.receiverCity = $.trim($('#receiver-city').val());
        receiverInfo.receiverAddress = $.trim($('#receiver-address').val());
        receiverInfo.receiverPhone = $.trim($('#receiver-phone').val());
        receiverInfo.receiverZip = $.trim($('#receiver-zip').val());

        if (!receiverInfo.receiverName) {
            res.errMsg = '请输入收件人姓名';
            return res;
        }
        if (!receiverInfo.receiverProvince) {
            res.errMsg = '请输入收件人省份';
            return res;
        }
        if (!receiverInfo.receiverCity) {
            res.errMsg = '请输入收件人城市';
            return res;
        }
        if (!receiverInfo.receiverAddress) {
            res.errMsg = '请输入收件人详细地址';
            return res;
        }
        if (!_mm.validate(receiverInfo.receiverPhone, 'phone')) {
            res.errMsg = '请输入收件人的合法电话';
            return res;
        }

        res.status = true;
        res.data = receiverInfo;
        return res;
    }
};

module.exports = addressModal;