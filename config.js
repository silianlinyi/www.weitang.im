/**
 * 项目配置文件
 *
 * MONGODB_IP: 			MongoDB数据库服务器IP地址
 * MONGODB_DATABASE: 	MongoDB数据库名字
 * WEB_SERVER_PORT: 	Web服务器端口号，发布80，测试8080
 *
 */
module.exports = {
	MONGODB_IP : "127.0.0.1",
	MONGODB_PORT : 27017,
	MONGODB_DATABASE_NAME : "weitang",
	WEB_SERVER_PORT : 80,

	mailOpts : {
		host : 'smtp.126.com',
		port : 25,
		auth : {
			user : 'weitangclub@126.com',
			pass : 'kyle890829'
		}
	},

	COOKIE_NAME : 'weitang',

	COOKIE_SECRET : 'www.weitang.im',
	SESSION_SECRET : 'www.weitang.im',

	// 七牛云存储相关配置
	QINIU_ACCESS_KEY : 'menzy45F91AK3Pj3gxqkuwOzraqUH6YRsU9w5QRM',
	QINIU_SECRET_KEY : '0VDjejyiavSYr-vyNHkUnFsb8wdT7JCEcks3JkCq',
	QINIU_Bucket_Name : 'weitang-test',
	QINIU_Uptoken_Url : '/api/qiniu/uptoken',
	QINIU_Domain : 'http://weitang-test.qiniudn.com/',
	
	// 每个用户可创建的专题个数
	COLLECTIONS_LIMIT_NUM : 5

}; 