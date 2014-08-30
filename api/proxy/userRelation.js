var UserRelation = require('../models/UserRelation');
var User = require('./user');

module.exports = {

	/**
	 * @method newOne
	 * 关注用户
	 * 新建一条关注记录，发起关注用户对应的关注个数+1，被关注用户对应的粉丝个数+1。
	 * @param {String} followingId 关注者Id
	 * @param {String} followerId 被关注者Id
	 */
	newOne: function(followingId, followerId, callback) {
		var one = new UserRelation({
			followingId: followingId,
			followerId: followerId
		});
		one.save(function(err, userRelation) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：发起关注者，关注个数+1
			User.updateFollowingNum(followingId, 1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：被关注者，粉丝个数+1
				User.updateFollowersNum(followerId, 1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					// TODO 触发器3：关注成功，触发一个关注事件，推送给被关注者
					return callback(null, userRelation);
				});
			});
		});
	},

	/**
	 * @method findOne
	 * 根据followingId和followerId查找关注记录
	 */
	findOne: function(followingId, followerId, callback) {
		UserRelation.findOne({
			followingId: followingId,
			followerId: followerId
		}, callback);
	},

	/**
	 * @method removeOne
	 * 取消关注
	 * 删除一条关注记录，发起取消关注用户对应的关注个数-1，被关注用户对应的粉丝个数-1.
	 */
	removeOne: function(followingId, followerId, callback) {
		UserRelation.findOneAndRemove({
			followingId: followingId,
			followerId: followerId
		}, function(err, doc) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：发起关注者，关注个数-1
			User.updateFollowingNum(followingId, -1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				// 触发器2：被关注者，粉丝个数-1
				User.updateFollowersNum(followerId, -1, function(err, user) {
					if (err) {
						return callback(err, null);
					}
					// TODO 触发器3：取消关注，触发一个取消关注事件，推送给被关注者
					return callback(null, doc);
				});
			});
		});
	},

	/**
	 * @method findFollowingsByPage
	 * 分页查询我关注的
	 */
	findFollowingsByPage: function(followingId, pageSize, pageStart, callback) {
		var query = UserRelation.find({
			followingId: followingId
		}).limit(pageSize).skip(pageStart).sort('-createTime')
		query.populate('followerId', '_id nickname sHeadimgurl followingNum followersNum articlesNum notebooksNum wordsNum');
		query.exec(function(err, docs) {
			if (err) {
				return callback(err, null);
			}
			var len = docs.length;
			var ret = [];
			for (var i = 0; i < len; i++) {
				ret.push(docs[i].followerId);
			}
			return callback(null, ret);
		});
	},

	/**
	 * @method findFollowersByPage
	 * 分页查询我的粉丝
	 */
	findFollowersByPage: function(followerId, pageSize, pageStart, callback) {
		var query = UserRelation.find({
			followerId: followerId
		}).limit(pageSize).skip(pageStart).sort('-createTime')
		query.populate('followingId', '_id nickname sHeadimgurl followingNum followersNum articlesNum notebooksNum wordsNum')
		query.exec(function(err, docs) {
			if (err) {
				return callback(err, null);
			}
			var len = docs.length;
			var ret = [];
			for (var i = 0; i < len; i++) {
				ret.push(docs[i].followingId);
			}
			return callback(null, ret);
		});
	}
};