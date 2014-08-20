var mongoose = require('mongoose');
var config = require('./config');

// 数据库连接
mongoose.connect('mongodb://' + config.MONGODB_IP + '/' + config.MONGODB_DATABASE_NAME, function(err) {
	if(err) {
		throw err;
	} else {
		console.log('【日志】连接到数据库：' + config.MONGODB_DATABASE_NAME);
	}
});