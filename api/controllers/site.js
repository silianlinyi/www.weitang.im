module.exports = {
	
	/**
	 * Web页面
	 * -------------------------------------------
	 */

	// 首页
	showIndex: function(req, res) {
		res.render('index');
	},

	// 写文章
	showWrite: function(req, res) {
		res.render('write');
	},

	// 设置 - 修改密码
	showSettingsPassword: function(req, res) {
		res.render('settingsPassword');
	}
};