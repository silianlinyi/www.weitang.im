var ArticleView = require('../models/ArticleView');
var Article = require('../models/Article');

module.exports = {

	/**
	 * @method newArticleView
	 * 新建一条文章查看记录
	 */
	newArticleView: function(articleId, ip, callback) {
		var view = new ArticleView({
			articleId: articleId,
			ip: ip
		});
		view.save(function(err, doc) {
			if (err) {
				return callback(err, null);
			}
			Article.updateViewsNum(articleId, 1, function(err, article) {
				if (err) {
					return callback(err, null);
				}
				return callback(null, doc);
			});
		});
	},

	findOne: function(articleId, ip, callback) {
		ArticleView.findOne({
			articleId: articleId,
			ip: ip
		}, callback);
	}

};