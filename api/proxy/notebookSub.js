var NotebookSub = require('../models/Notebook');
var Notebook = require('./notebook');

module.exports = {

	/**
	 * 订阅文集
	 * 新建一条订阅记录，订阅者订阅的文集数量+1，对应文集总订阅数+1
	 */
	newNotebookSub : function(belongToUserId, belongToNotebookId, callback) {
		var one = new NotebookSub({
			belongToUserId : belongToUserId,
			belongToNotebookId : belongToNotebookId
		});
		User.updateSubNoteNum(belongToUserId, 1, function(err, user) {
			if (err) {
				return callback(err, null);
			}
			Notebook.updateSubsNum(belongToNotebookId, 1, function(err, notebook) {
				if (err) {
					return callback(err, null);
				}
				// TODO 订阅文集成功后，新建一条订阅成功动态消息
				one.save(callback);
			});
		});
	},

	/**
	 * 取消订阅文集
	 * 删除一条订阅记录，订阅者订阅的文集数-1，对应文集总订阅数-1
	 */
	removeOneNotebookSub : function(belongToUserId, belongToNotebookId, callback) {
		Notebook.findOneAndRemove({
			belongToUserId : belongToUserId,
			belongToNotebookId : belongToNotebookId
		}, function(err, doc) {
			if (err) {
				return callback(err, null);
			}
			if (!doc) {
				return callback(null, null);
			} else {
				User.updateSubNoteNum(belongToUserId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					Notebook.updateSubsNum(belongToNotebookId, -1, function(err, notebook) {
						if (err) {
							return callback(err, null);
						}
						// TODO 取消订阅文集成功后，新建一条取消订阅成功动态消息
						one.save(callback);
					});
				});
			}
		});
	}
	
	
	
	
	
	
};
