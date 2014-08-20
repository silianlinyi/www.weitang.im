"use strict";

define('Util', [], function() {

	/**
	 * @method convertDate
	 * 将毫秒数转换成用户更乐意接受的形式
	 */
	function convertDate(date) {
		var ONE_MINUTE_MILLISECONDS = 1 * 60 * 1000;
		var ONE_HOUR_MILLISECONDS = ONE_MINUTE_MILLISECONDS * 60;
		var ONE_DAY_MILLISECONDS = ONE_HOUR_MILLISECONDS * 24;

		var currentMilliseconds = (new Date()).getTime(), difference = currentMilliseconds - date;

		if (difference < ONE_MINUTE_MILLISECONDS) {
			return Math.floor(difference / 1000) + "秒前";
		}
		for (var i = 1; i < 60; i++) {
			if (difference < ONE_MINUTE_MILLISECONDS * i) {
				return i + "分钟前";
			}
		}
		for (var j = 1; j < 24; j++) {
			if (difference < ONE_HOUR_MILLISECONDS * j) {
				return j + "小时前";
			}
		}
		for (var k = 1; k < 30; k++) {
			if (difference < ONE_DAY_MILLISECONDS * k) {
				return k + "天前";
			}
		}
		return (new Date(date)).toLocaleDateString();
	}

	/**
	 * @method isEmail
	 * 判断是否是邮箱地址
	 */
	function isEmail(str) {
		if (!str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
			return false;
		}
		return true;
	}
	
	/**
     * @method isPhone
     * 判断是否是手机号码
     */
    function isPhone(val) {
        if (!/^(1+\d{10})$/.test(val)) {
            return false;
        } else {
            return true;
        }
    }

	return {
		convertDate : convertDate,
		isEmail : isEmail,
		isPhone : isPhone
	};

});

