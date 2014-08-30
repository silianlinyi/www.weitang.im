var Collection = require('../models/Collection');
var User = require('./user');

module.exports = {

	/**
	 * @method newCollection
	 * 新建专题
	 */
	newCollection : function(name, description, sourceUrl, mThumbnailUrl, sThumbnailUrl, tags, belongToUserId, callback) {
		var collection = new Collection({
			name : name,
			description : description,
			sourceUrl : sourceUrl,
			mThumbnailUrl : mThumbnailUrl,
			sThumbnailUrl : sThumbnailUrl,
			tags : tags,
			belongToUserId : belongToUserId
		});
		collection.save(function(err, collection) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1：用户已创建专题数+1
			User.updateCollNum(belongToUserId, 1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				return callback(null, collection);
			});
		});
	},

	/**
	 * @method findAllByUserId
	 * 查询某个用户创建的所有专题
	 * @param {String} belongToUserId 用户Id
	 */
	findAllByUserId : function(belongToUserId, callback) {
		Collection.find({
			belongToUserId : belongToUserId
		}).sort('-createTime').exec(callback);
	},

	/**
	 * 修改专题订阅次数
	 */
	updateSubscriptionsNum : function(_id, num, callback) {
		Collection.findByIdAndUpdate(_id, {
			$inc : {
				subscriptionsNum : num
			}
		}, callback);
	},
	
	/**
	 * @method findByKey
	 * 根据关键字搜索专题
	 */
	findByKey : function(pageSize, pageStart, key, callback) {
		var query = Collection.find({
			name : new RegExp(key, 'ig')
		}).limit(pageSize).skip(pageStart).sort('-createTime');

		Collection.count({
			name : new RegExp(key, 'ig')
		}, function(err, count) {
			if (err) {
				return callback(err, null);
			}
			query.exec(function(err, collections) {
				if (err) {
					return callback(err, null);
				}
				callback(null, collections, count);
			});
		});
	},

	// ====================================

	/**
	 * 删除专题
	 */
	deleteCollectionById : function(_id, callback) {
		Collection.findByIdAndRemove(_id, callback);
	},

	/**
	 * 根据Id查询某个专题
	 */
	findCollectionById : function(_id, callback) {
		Collection.findById(_id).populate('belongToUserId').exec(callback);
	},

	/**
	 * 根据专题名字查询专题
	 */
	findCollectionsByName : function(name, callback) {
		Collection.find({
			name : new RegExp(name, 'gi')
		}, callback);
	},

	/**
	 * 更新专题信息
	 */
	updateCollectionById : function(_id, name, description, sourceUrl, mThumbnailUrl, sThumbnailUrl, tags) {
		Collection.findByIdAndUpdate(_id, {
			$set : {
				name : name,
				description : description,
				sourceUrl : sourceUrl,
				mThumbnailUrl : mThumbnailUrl,
				sThumbnailUrl : sThumbnailUrl,
				tags : tags
			}
		}, callback);
	},

	/**
	 * 查询某个用户创建的所有专题
	 */
	findAllByUserIdAnd : function(belongToUserId, callback) {
		Collection.find({
			belongToUserId : belongToUserId,
			articlesNum : {
				$gte : 1
			}
		}).sort('-createTime').exec(callback);
	},

	/**
	 * @method findByCollectionIds
	 * 根据一组专题Id查找专题列表
	 * ids = ['53d1128190a0d71c08f3a4f9', '53d10ca5e98634e02b07c43d']
	 */
	findByCollectionIds : function(ids, callback) {
		Collection.find({
			_id : {
				$in : ids
			}
		}, callback);
	},

	/**
	 * @method findByIdAndUpdateSubsNum
	 * 修改专题订阅数 num = 1（+1），num = -1（-1）
	 */
	findByIdAndUpdateSubsNum : function(collectionId, num, callback) {
		Collection.findByIdAndUpdate(collectionId, {
			$inc : {
				subscriptionsNum : num
			}
		}, callback);
	},

	

	/**
	 * @method findByPage
	 * 分页查询
	 */
	findByPage : function(pageSize, pageStart, callback) {
		var query = Collection.find().limit(pageSize).skip(pageStart).sort('-createTime');
		query.exec(callback);
	}
};
