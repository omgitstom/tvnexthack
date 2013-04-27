
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Firebase = require('firebase')
  , espn = require('./espn');

var app = express();

var mainRef = new Firebase('https://drivia.firebaseIO-demo.com/');

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

// start polling the ESPN live captions
espn();

function drink(ref, event, length) {
  ref.child(event).child('drink').set(true);
  setTimeout(function() {
    ref.child(event).child('drink').set(false);
  }, length * 1000);
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
