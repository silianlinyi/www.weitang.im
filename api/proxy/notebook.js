var Notebook = require('../models/Notebook');
var User = require('../models/User');

module.exports = {

	// -------------------------------------------------- 新建操作

	/**
	 * @method newNotebook
	 * 新建文集
	 * @param {String} name 文集名
	 * @param {ObjectId} belongToUserId 关联用户Id
	 * @param {Function} callback 回调函数
	 */
	newNotebook: function(name, belongToUserId, callback) {
		var notebook = new Notebook({
			name: name,
			belongToUserId: belongToUserId
		});
		notebook.save(function(err, notebook) {
			if (err) {
				return callback(err, null);
			}
			// 触发器1:新建文集成功后，关联用户的notebooksNum+1
			User.updateNotebooksNum(belongToUserId, 1, function(err, user) {
				if (err) {
					return callback(err, null);
				}
				return callback(null, notebook);
			});
		});
	},

	// -------------------------------------------------- 删除操作



	// -------------------------------------------------- 查询操作

	/**
	 * @method findAllByUserId
	 * 根据用户Id查询某用户创建的所有文集
	 */
	findAllByUserId: function(userId, callback) {
		var query = Notebook.find({
			belongToUserId: userId
		}).sort({
			createTime: -1
		});
		query.populate('belongToUserId', 'nickname createTime updateTime city');
		query.exec(callback);
	},

	/**
	 * @method findNotebookById
	 * 根据文集Id查询文集
	 */
	findNotebookById: function(_id, callback) {
		Notebook.findById(_id).populate('belongToUserId', '_id nickname sHeadimgurl').exec(callback);
	},

	// -------------------------------------------------- 更新操作

	/**
	 * @method updateName
	 * 修改文集名字
	 */
	updateName: function(_id, name, callback) {
		Notebook.findByIdAndUpdate(_id, {
			$set: {
				name: name,
				updateTime: Date.now()
			}
		}, callback);
	}

};