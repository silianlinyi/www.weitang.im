var CollectionSub = require('../models/CollectionSub');
var Collection = require('./collection');
var User = require('./User');

module.exports = {

	/**
	 * @method findAllByUserId
	 * 查询某个用户订阅的所有专题（专题Id列表数组）
	 * @param {Function} callback 回调函数
	 */
	findAllByUserId : function(userId, callback) {
		CollectionSub.find({
			userId : userId
		}, function(err, collectionSubs) {
			if (err) {
				return callback(err, null);
			}
			var ret = [];
			var len = collectionSubs.length;
			for (var i = 0; i < len; i++) {
				ret.push(String(collectionSubs[i].collectionId));
			}
			return callback(null, ret);
		});
	},

	/**
	 * @method newCollectionSub
	 * 订阅专题
	 * 新建一条专题订阅记录，订阅用户对应的专题订阅数+1，被订阅专题对应的总订阅数+1
	 * @param {String} userId 关联用户Id
	 * @param {String} collectionId 关联专题Id
	 * @param {Function} callback 回调函数
	 */
	newCollectionSub : function(userId, collectionId, callback) {
		var collectionSub = new CollectionSub({
			userId : userId,
			collectionId : collectionId
		});
		collectionSub.save(function(err, collectionSub) {
			if (err) {
				return callback(err, null);
			}
			User.updateSubNum(userId, 1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				Collection.updateSubscriptionsNum(collectionId, 1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, collectionSub);
				});
			});
		});
	},

	/**
	 * @method findOne
	 * 根据用户Id和专题Id查找记录，如果结果不为空，说明已订阅该专题，如果结果为空，说明没有订阅该专题
	 */
	findOne : function(userId, collectionId, callback) {
		CollectionSub.findOne({
			userId : userId,
			collectionId : collectionId
		}, callback);
	},

	/**
	 * @method removeOneCollectionSub
	 * 取消订阅专题
	 * 删除一条订阅记录，订阅用户对应的专题订阅数-1，被订阅专题对应的总订阅数-1
	 */
	removeOneCollectionSub : function(userId, collectionId, callback) {
		CollectionSub.findOneAndRemove({
			userId : userId,
			collectionId : collectionId
		}, function(err, collectionSub) {
			if (err) {
				return callback(err, null);
			}
			User.updateSubNum(userId, -1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				Collection.updateSubscriptionsNum(collectionId, -1, function(err, collection) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, collectionSub);
				});
			});
		});
	},

	/**
	 * 我订阅的所有专题
	 */
	findAllSubsByUserId : function(userId, callback) {
		CollectionSub.find({
			userId : userId
		}).populate('collectionId').exec(callback);
	}
};
