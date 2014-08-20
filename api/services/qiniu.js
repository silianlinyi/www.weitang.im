var qiniu = require('qiniu');
var config = require('../../config');

qiniu.conf.ACCESS_KEY = config.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.QINIU_SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.QINIU_Bucket_Name);

module.exports = {

	getUptoken : function(req, res, next) {
		var token = uptoken.token();
		res.header("Cache-Control", "max-age=0, private, must-revalidate");
		res.header("Pragma", "no-cache");
		res.header("Expires", 0);
		if (token) {
			res.json({
				uptoken : token
			});
		}
	}
}
