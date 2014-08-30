var xss = require('xss');
var Collection = require('../proxy/collection');
var CollectionSub = require('../proxy/collectionSub');
var User = require('../proxy/user');
var ArticleColl = require('../proxy/articleColl');
var auth = require('../policies/auth');
var config = require('../../config');
var ERRCODE = require('../../errcode');

module.exports = {

	/**
	 * Web页面
	 * -------------------------------------------
	 */

	/**
	 * @method showSub
	 * 专题 - 我的订阅
	 */
	showSub: function(req, res) {
		res.render('mySubCollections');
	},

	/**
	 * @method showMine
	 * 专题 - 我的专题
	 */
	showMine: function(req, res) {
		res.render('myCollections');
	},

	/**
	 * @method showNew
	 * 专题 - 新建专题
	 */
	showNew: function(req, res) {
		res.render('newCollection', {
			QINIU_Domain: config.QINIU_Domain
		});
	},

	/**
	 * @method showCollections
	 * 专题 - 全部专题
	 */
	showCollections: function(req, res) {
		res.render('collections');
	},

	/**
	 * @method showCollectionInfo
	 * 专题详情 - 最新文章
	 */
	showCollectionInfo: function(req, res, next) {
		var _id = req.params._id;
		var path = req.route.path;

		if (_id.length !== 24) {
			return res.render('404');
		} else {
			Collection.findCollectionById(_id, function(err, collection) {
				if (err) {
					return next(err);
				}
				if (!collection) {
					return res.render('404');
				} else {
					var isLogin = auth.isLogin(req, res);

					function cb() {
						var params = {
							r: 0,
							msg: "查找专题详情成功",
							collection: collection
						};

						if (/subscribers/.test(path)) {
							res.render('subscribers', params);
						} else {
							res.render('collectionInfo', params);
						}
					}

					if (isLogin) {
						var userId = auth.getUserId(req, res);
						CollectionSub.findOne(userId, _id, function(err, collectionSub) {
							if (err) {
								return next(err);
							}
							if (collectionSub) {
								collection.hasSub = true;
							}
							cb();
						});
					} else {
						cb();
					}
				}
			});
		}
	},

	/**
	 * Ajax API接口
	 * -------------------------------------------
	 */

	/**
	 * @method newCollection
	 * 新建专题
	 */
	newCollection: function(req, res, next) {
		var body = req.body;
		var name = xss(body.name);
		var description = xss(body.description);
		var sourceUrl = body.sourceUrl;
		var mThumbnailUrl = body.mThumbnailUrl;
		var sThumbnailUrl = body.sThumbnailUrl;
		var tags = body.tags;
		var belongToUserId = auth.getUserId(req, res);

		User.findUserById(belongToUserId, function(err, user) {
			if (err) {
				return next(err);
			}
			// 用户创建的专题数已经到达限制数，不能再创建
			if (user.collLimitNum === user.collNum) {
				return res.json({
					r: 1,
					errcode: 10013,
					msg: ERRCODE[10013]
				});
			} else {
				Collection.newCollection(name, description, sourceUrl, mThumbnailUrl, sThumbnailUrl, tags, belongToUserId, function(err, collection) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: '新建专题成功',
						collection: collection
					});
				});
			}
		});
	},

	/**
	 * @method findAllMyCollections
	 * 我创建的所有专题,并且返回是否订阅信息
	 */
	findAllMyCollections: function(req, res, next) {
		var userId = auth.getUserId(req, res);

		Collection.findAllByUserId(userId, function(err, collections) {
			if (err) {
				return next(err);
			}
			CollectionSub.findAllByUserId(userId, function(err, ids) {
				if (err) {
					return next(err);
				}
				var len = collections.length;
				for (var i = 0; i < len; i++) {
					if (ids.indexOf(String(collections[i]._id)) !== -1) { // 说明订阅了该专题
						collections[i].hasSub = true;
					} else {
						collections[i].hasSub = false;
					}
				}
				return res.json({
					r: 0,
					msg: "查询我创建的所有专题成功",
					collections: collections
				});
			});
		});
	},

	/**
	 * @method subCollection
	 * 订阅专题
	 */
	subCollection: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		var collectionId = req.params._id;

		CollectionSub.findOne(userId, collectionId, function(err, doc) {
			if (err) {
				return next(err);
			}
			if (doc) { // 已订阅
				return res.json({
					r: 1,
					errcode: 10014,
					msg: ERRCODE[10014]
				});
			} else {
				CollectionSub.newCollectionSub(userId, collectionId, function(err, collectionSub) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: '订阅成功'
					});
				});
			}
		});
	},

	/**
	 * @method unSubCollection
	 * 取消订阅专题(根据用户Id和专题Id)
	 */
	unSubCollection: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		var collectionId = req.params._id;

		CollectionSub.findOne(userId, collectionId, function(err, doc) {
			if (err) {
				return next(err);
			}

			if (!doc) {
				return res.json({
					r: 1,
					errcode: 10015,
					msg: ERRCODE[10015]
				});
			} else {
				CollectionSub.removeOneCollectionSub(userId, collectionId, function(err, doc) {
					if (err) {
						return next(err);
					}
					res.json({
						r: 0,
						msg: '取消订阅成功'
					});
				});
			}
		});
	},

	/**
	 * @method findAllMyCollectionSubs
	 * 我订阅的所有专题
	 */
	findAllMyCollectionSubs: function(req, res, next) {
		var userId = auth.getUserId(req, res);

		CollectionSub.findAllSubsByUserId(userId, function(err, subs) {
			if (err) {
				return next(err);
			}
			var len = subs.length;
			var collections = [];
			for (var i = 0; i < len; i++) {
				subs[i].collectionId.hasSub = true;
				collections.push(subs[i].collectionId);
			}
			return res.json({
				r: 0,
				msg: '查询我订阅的所有专题成功',
				collections: collections
			})
		});
	},

	/**
	 * @method findCollectionsByKey
	 * 根据关键字搜索所有专题
	 */
	findCollectionsByKey: function(req, res, next) {
		var isLogin = auth.isLogin(req, res);
		var query = req.query;
		var pageSize = query.pageSize || 12;
		var pageStart = query.pageStart || 0;
		var key = query.key;

		if (isLogin) { // 如果用户已登录
			var userId = auth.getUserId(req, res);

			CollectionSub.findAllByUserId(userId, function(err, ids) {
				if (err) {
					return next(err);
				}

				Collection.findByKey(pageSize, pageStart, key, function(err, collections, count) {
					if (err) {
						return next(err);
					}
					var len = collections.length;
					for (var i = 0; i < len; i++) {
						if (ids.indexOf(String(collections[i]._id)) !== -1) { // 说明订阅了该专题
							collections[i].hasSub = true;
						} else {
							collections[i].hasSub = false;
						}
					}
					res.json({
						r: 0,
						msg: "查询专题成功",
						collections: collections,
						count: count
					});
				});
			});
		} else { // 用户未登录
			Collection.findByKey(pageSize, pageStart, key, function(err, collections, count) {
				if (err) {
					return next(err);
				}
				res.json({
					r: 0,
					msg: "查询专题成功",
					collections: collections,
					count: count
				});
			});
		}
	},

	/**
	 * @method findAllCollectionsByUserId
	 * 根据用户Id查找某用户创建的所有专题
	 */
	findAllCollectionsByUserId: function(req, res, next) {
		var userId = req.params._id;

		Collection.findAllByUserId(userId, function(err, collections) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查找某用户创建的所有专题成功",
				collections: collections
			});
		});
	},

	/**
	 * @method findAllMyCollectionsWith
	 * 我创建的所有专题，并且返回当前文章是否已经收录信息
	 */
	findAllMyCollectionsWith: function(req, res, next) {
		var userId = auth.getUserId(req, res);
		var articleId = req.query.articleId;

		// 我创建的所有专题
		Collection.findAllByUserId(userId, function(err, collections) {
			if (err) {
				return next(err);
			}
			// 查询某篇文章被收录的所有专题
			ArticleColl.findAllCollectionsByArticleId(articleId, function(err, articleColls) {
				if (err) {
					return next(err);
				}
				var articleCollsOfIds = [];
				for (var i = 0; i < articleColls.length; i++) {
					articleCollsOfIds.push(String(articleColls[i].collectionId));
				}

				for (var j = 0; j < collections.length; j++) {
					if (articleCollsOfIds.indexOf(String(collections[j]._id)) !== -1) {
						collections[j].hasAdd = true;
					}
				}

				res.json({
					r: 0,
					msg: '查询成功',
					collections: collections
				});
			});

		});
	},

	/**
	 * @method addArticle
	 * 收录文章
	 */
	addArticle: function(req, res, next) {
		var articleId = req.params._id;
		var collectionId = req.body.collectionId;

		ArticleColl.findOne(articleId, collectionId, function(err, articleColl) {
			if (err) {
				return next(err);
			}
			if (articleColl) {
				return res.json({
					r: 1,
					errcode: 10019,
					msg: ERRCODE[10019]
				});
			} else {
				ArticleColl.newArticleColl(articleId, collectionId, function(err, articleColl) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "收录成功",
						articleColl: articleColl
					});
				});
			}
		});
	},

	/**
	 * @method removeArticle
	 * 取消收录文章
	 */
	removeArticle: function(req, res, next) {
		var articleId = req.params._id;
		var collectionId = req.body.collectionId;

		ArticleColl.findOne(articleId, collectionId, function(err, articleColl) {
			if (err) {
				return next(err);
			}

			if (articleColl) {
				ArticleColl.removeOneArticleColl(articleId, collectionId, function(err, articleColl) {
					if (err) {
						return next(err);
					}
					return res.json({
						r: 0,
						msg: "取消收录成功",
						articleColl: articleColl
					});
				});
			} else {
				return res.json({
					r: 1,
					errcode: 10020,
					msg: ERRCODE[10020]
				});
			}
		});
	},

	/**
	 * @method findUsersByCollectionIdAndPage
	 * 分页查询某个专题下的订阅用户
	 */
	findUsersByCollectionIdAndPage: function(req, res, next) {
		var collectionId = req.params._id;
		var pageSize = Number(req.query.pageSize) || 20;
		var pageStart = Number(req.query.pageStart) || 0;
		var sortBy = '-createTime';

		CollectionSub.findByCollectionIdAndPage(collectionId, pageSize, pageStart, sortBy, function(err, users) {
			if (err) {
				return next(err);
			}
			return res.json({
				r: 0,
				msg: "查询订阅用户成功",
				users: users
			});
		});
	}


};