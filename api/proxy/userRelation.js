var UserRelation = require('../models/UserRelation');
var User = require('./user');

module.exports = {

	/**
	 * 关注
	 * 新建一条关注记录，发起关注用户对应的关注个数+1，被关注用户对应的粉丝个数+1。
	 */
	newOne : function(followingId, followerId, callback) {
		var one = new UserRelation({
			followingId : followingId,
			followerId : followerId
		});
		User.updateFollowingNum(followingId, 1, function(err, user) {
			if (err) {
				return callback(err, null);
			}
			User.updateFollowersNum(followerId, 1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				// TODO 关注成功，触发一个关注事件，推送给被关注者
				one.save(callback);
			});
		});
	},

	/**
	 * 取消关注
	 * 删除一条关注记录，发起取消关注用户对应的关注个数-1，被关注用户对应的粉丝个数-1.
	 */
	removeOne : function(followingId, followerId, callback) {
		UserRelation.findOneAndRemove({
			followingId : followingId,
			followerId : followerId
		}, function(err, doc) {
			if (err) {
				return callback(err, null);
			}
			if (!doc) {// 关注记录不存在
				return callback(null, null);
			} else {
				User.updateFollowingNum(followingId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					User.updateFollowersNum(followerId, -1, function(err, user) {
						if (err) {
							return callback(err, null);
						}
						// TODO 取消关注，触发一个取消关注事件，推送给被关注者
						one.save(callback);
					});
				});
			}
		});
	},

	/**
	 * 分页查询我关注的
	 */
	findFollowingsByPage : function(followingId, pageSize, pageStart, callback) {
		UserRelation.find({
			followingId : followingId
		}).limit(pageSize).skip(pageStart).sort('-createTime').populate('followerId', 'nickname').exec(callback);
	},

	/**
	 * 分页查询我的粉丝
	 */
	findFollowersByPage : function(followerId, pageSize, pageStart, callback) {
		UserRelation.find({
			followerId : followerId
		}).limit(pageSize).skip(pageStart).sort('-createTime').populate('followingId', 'nickname').exec(callback);
	}
};
