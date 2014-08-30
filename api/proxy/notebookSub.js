var NotebookSub = require('../models/NotebookSub');
var Notebook = require('../models/Notebook');
var User = require('../models/User');

module.exports = {

	// -------------------------------------------------- 新建操作

	/**
	 * @method newNotebookSub
	 * 新建一条文集订阅记录
	 */
	newNotebookSub: function(belongToUserId, belongToNotebookId, callback) {
		var notebookSub = new NotebookSub({
			belongToUserId: belongToUserId,
			belongToNotebookId: belongToNotebookId
		});
		notebookSub.save(function(err, notebookSub) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：关联文集被订阅次数subsNum+1
			Notebook.updateSubsNum(belongToNotebookId, 1, function(err, notebook) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：关联用户订阅的文集个数subNotebooksNum+1
				User.updateSubNoteNum(belongToUserId, 1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, notebookSub);
				});
			});
		});
	},

	// -------------------------------------------------- 删除操作

	/**
	 * @method removeOneNotebookSub
	 * 删除一条文集订阅记录
	 */
	removeOneNotebookSub: function(belongToUserId, belongToNotebookId, callback) {
		NotebookSub.findOneAndRemove({
			belongToUserId: belongToUserId,
			belongToNotebookId: belongToNotebookId
		}, function(err, notebookSub) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：关联文集被订阅次数subsNum-1
			Notebook.updateSubsNum(belongToNotebookId, -1, function(err, notebook) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：关联用户订阅的文集个数subNotebooksNum-1
				User.updateSubNoteNum(belongToUserId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, notebookSub);
				});
			});
		});
	},

	// -------------------------------------------------- 查询操作

	/**
	 * @method findOne
	 * 根据用户Id和文集Id查找订阅记录
	 */
	findOne: function(belongToUserId, belongToNotebookId, callback) {
		NotebookSub.findOne({
			belongToUserId: belongToUserId,
			belongToNotebookId: belongToNotebookId
		}, callback);
	},

	/**
	 * @method findAllByUserId
	 * 根据用户Id查询某用户订阅的所有文集
	 */
	findAllByUserId: function(belongToUserId, callback) {
		var query = NotebookSub.find({
			belongToUserId: belongToUserId
		});

		query.populate('belongToNotebookId', '_id name articlesNum subsNum belongToUserId');
		query.exec(function(err, notebookSubs) {
			if (err) {
				return callback(err, null);
			}
			var len = notebookSubs.length;
			var ret = [];
			var counter = 0;
			if (len === 0) {
				return callback(null, ret);
			}
			for (var i = 0; i < len; i++) {
				notebookSubs[i].belongToNotebookId.populate('belongToUserId', '_id nickname', function(err, doc) {
					if (err) {
						return callback(err, null);
					}
					counter++;
					ret.push(doc);
					if (counter === len) {
						return callback(null, ret);
					}
				});
			}
		});
	},

	/**
	 * @method findUsersByNotebookIdAndPage
	 * 分页查询某个文集下的订阅用户
	 */
	findUsersByNotebookIdAndPage: function(belongToNotebookId, pageSize, pageStart, callback) {
		var query = NotebookSub.find({
			belongToNotebookId: belongToNotebookId
		}).limit(pageSize).skip(pageStart);
		query.populate('belongToUserId', '_id nickname sHeadimgurl followingNum followersNum articlesNum notebooksNum wordsNum');

		query.exec(function(err, notebookSubs) {
			if (err) {
				return callback(err, null);
			}
			var ret = [];
			for (var i = 0; i < notebookSubs.length; i++) {
				ret.push(notebookSubs[i].belongToUserId);
			}
			return callback(null, ret);
		});
	}

};