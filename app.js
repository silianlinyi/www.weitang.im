var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var hbs = require('hbs');
var compression = require('compression');
var config = require('./config');
var routes = require('./routes');

var app = express();
hbs.localsAsTemplateData(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
hbs.registerPartials(__dirname + '/views/partials');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	name : 'connect.sid',
	secret : config.SESSION_SECRET,
	resave : true,
	saveUninitialized : true,
	store : new MongoStore({
		'db' : config.MONGODB_DATABASE_NAME,
		'collection' : 'wt_sessions'
	}),
	cookie : {
		path : '/'
	}
}));

// compress responses
app.use(compression());

app.use(function(req, res, next) {
	var user = req.session.user;
	if (!!user) {
		res.locals.hasLogin = true;
		res.locals.user = user;
		// 当前会话的用户信息
	} else {
		res.locals.hasLogin = false;
	}
	next();
});



// 路由
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log('development error handler');
		console.log(err);
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

var debug = require('debug')('www.weitang.im');
app.set('port', process.env.PORT || config.WEB_SERVER_PORT);

var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

require('./mongodb');

