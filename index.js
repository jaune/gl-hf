var path_ = require('path');

var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var engines = require('consolidate');

var redis = require('./redis.js');

var app = express();


app.set('views', path_.join(__dirname, 'app/views'));
app.set('view engine', 'mustache');


// app.set('env', 'production');
app.set('env', 'development');


var mustache = require('mustache');
app.engine('mustache', engines.mustache);


app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  name: 'g.session',
  secret: '__$secret$__',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000 * 30 // 30 minutes
  },
  store: new RedisStore({
    client: redis,
    ttl: 60 * 60,
    prefix: 'session/'
  })
}));
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('Session Missing'));
  }
  next();
});
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(path_.join(__dirname, 'public')));


var middlewareEntry = require('./lib/middlewares/entry.js');

app.use(middlewareEntry(app));


const setLocaleAction = require('./app/actions/setLocale');
const setLocationAction = require('./app/actions/setLocation');
const ApplicationStore = require('./app/stores/Application');

/**
 *
 *
 */
app.get('/', function (req, res, next) {
  var entry = res.createEntry('app');

  entry.context.getActionContext().executeAction(setLocaleAction, {
    language: 'en',
    region: 'US'
  }, function (error) {
    if (error) { return next(error); }

    entry.context.getActionContext().executeAction(setLocationAction, {
      pattern: req.route.path,
      params: req.params
    }, function (error) {
      if (error) { return next(error); }

      res.sendEntry(entry);
    });
  });
});

/**
 *
 */
app.delete('/session', function (req, res) {
  req.session.destroy(function(error) {
    if (error) {
      res.status(500).json({});
    }
    res.json({});
  })
});

app.use(require('./app/routes/resources.js'));

/**
 *
 */
app.use('/authorize', require('./app/routes/authorize.js'));

/**
 *
 */
app.use('/account', require('./app/routes/account.js'));

if (app.get('env') === 'development') {
  // development error handler
  app.use(function(err, req, res, next) {
    console.error('************************************');
    console.error(err);
    console.error('------------------------------------');
    console.error(err.stack);
    console.error('************************************');
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: {}
    });
  });
}

var models = require('./app/models');

models.sequelize.sync().then(function () {

	var server = app.listen(8080, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Example app listening at http://%s:%s', host, port);
	});
});






