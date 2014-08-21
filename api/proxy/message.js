var Message = require('../models/Message');

module.exports = {

	/**
	 * @method newMessage
	 * 新建一条私信
	 */
	newMessage : function(toUser, fromUser, topic, content, callback) {
		var newMessage = new Message({
			toUser : toUser,
			fromUser : fromUser,
			topic : topic,
			content : content
		});
		newMessage.save(callback);
	},

	/**
	 * @method findByIdAndRemove
	 * 删除一条私信
	 */
	findByIdAndRemove : function(_id, callback) {
		Message.findByIdAndRemove(_id, callback);
	},

	/**
	 * @method findById
	 * 根据私信Id查询
	 */
	findById : function(_id, callback) {
		var query = Message.findById(_id);
		query.populate('toUser', '_id nickname sHeadimgurl email');
		query.populate('fromUser', '_id nickname sHeadimgurl email');
		query.exec(callback);
	},

	/**
	 * @method findByPage
	 * 分页查询
	 */
	findByPage : function(toUser, fromUser, pageSize, pageStart, callback) {
		var params = {};
		if (!!toUser) {
			params.toUser = toUser;
		}
		if (!!fromUser) {
			params.fromUser = fromUser;
		}
		var query = Message.find(params).limit(pageSize).skip(pageStart).sort('-createTime');
		query.populate('toUser', '_id nickname sHeadimgurl');
		query.populate('fromUser', '_id nickname sHeadimgurl');
		query.exec(callback);
	},

	/**
	 * @method updateStatus
	 * 修改私信状态
	 */
	updateStatus : function(_id, status, callback) {
		Message.findByIdAndUpdate(_id, {
			$set : {
				status : status
			}
		}, callback);
	}
};
