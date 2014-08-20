var Notebook = require('../models/Notebook');

module.exports = {

	/**
	 * @method newNotebook
	 * 新建文集
	 * @param {String} name 文集名
	 * @param {ObjectId} belongToUserId 关联用户Id
	 * @param {Function} callback 回调函数
	 */
	newNotebook : function(name, belongToUserId, callback) {
		var notebook = new Notebook({
			name : name,
			belongToUserId : belongToUserId
		});
		// TODO 新建文集成功后，新建一条动态消息
		notebook.save(callback);
	},
	
	/**
	 * @method deleteNotebookById
	 * 删除文集
	 */
	deleteNotebookById : function(_id, callback) {
		Notebook.findByIdAndRemove(_id, callback);
	},
	
	
	// =================

	

	/**
	 * 根据文集Id查询文集
	 */
	findNotebookById : function(_id, callback) {
		Notebook.findById(_id, callback);
	},

	/**
	 * 根据文集名字查询文集
	 */
	findNotebooksByName : function(name, callback) {
		Notebook.find({
			name : new RegExp(name, 'gi')
		}, callback);
	},

	/**
	 * 修改文集名字
	 */
	updateName : function(_id, name, callback) {
		Notebook.findByIdAndUpdate(_id, {
			$set : {
				name : name
			}
		}, callback);
	},

	/**
	 * 修改文集总文章数
	 */
	updateArticlesNum : function(_id, num, callback) {
		Notebook.findByIdAndUpdate(_id, {
			$inc : {
				articlesNum : num
			}
		}, callback);
	},

	/**
	 * 修改文集总字数
	 */
	updateWordsNum : function(_id, num, callback) {
		Notebook.findByIdAndUpdate(_id, {
			$inc : {
				wordsNum : num
			}
		}, callback);
	},

	/**
	 * 修改文集总订阅数
	 */
	updateSubsNum : function(_id, num, callback) {
		Notebook.findByIdAndUpdate(_id, {
			$inc : {
				subsNum : num
			}
		}, callback);
	},

	/**
	 * 查询某用户创建的所有文集
	 */
	findAllByUserId : function(userId, callback) {
		Notebook.find({
			belongToUserId : userId
		}).sort({
			createTime : -1
		}).populate('belongToUserId', 'nickname createTime updateTime city').exec(callback);
	},

	/**
	 * 查找某用户创建的所有文集（文章数>=1）
	 */
	findAllByUserIdAnd : function(userId, callback) {
		Notebook.find({
			belongToUserId : userId,
			articlesNum : {
				"$gte" : 1
			}
		}).sort('-createTime').exec(callback);
	}
};
