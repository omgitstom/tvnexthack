
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
<<<<<<< HEAD
  , path = require('path')
	, Firebase = require('firebase');

var app = express();

var mainRef = new Firebase('https://drivia.firebaseIO-demo.com/');

=======
<<<<<<< HEAD
  , path = require('path')
	, Firebase = require('firebase');

var app = express();

var mainRef = new Firebase('https://drivia.firebaseIO-demo.com/');

=======
  , path = require('path');

var app = express();

>>>>>>> 6fa9214f472ef9bc94d7c07f10c6e4057185137f
>>>>>>> master
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
