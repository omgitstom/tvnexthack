'use strict';

var
  http = require('http'),
  baseball = require('./baseball');

module.exports = function(){
  var
    reported = 0,
    checkForMatches = function(text){
      console.log('checking for matches in "' + text + '"');
      text = text.toLowerCase();
      Object.keys(baseball).forEach(function(level){
        baseball[level].forEach(function(keyword){
          if (~text.indexOf(keyword)){
            console.log('matched at level', level, keyword, text);
            return;
          }
        });
      });
    };

  setInterval(function(){
    http.get('http://livefeed.api.tv/hack2013/v1/getlivefeeditems/args/livefeed/1632384/starttime/live/format.json', function(response){
      var data = '';

      response.on('data', function(chunk){
        data += chunk;
      });

      response.on('end', function(){
        var json = JSON.parse(data);
        json.LiveFeedItems.forEach(function(item){
          if (item.Timestamp <= reported) {
            // ignore already reported items
            return;
          }
          reported = Math.max(item.Timestamp, reported);
          checkForMatches(item.Data.Text);
        });
      });
    });
  }, 1000);
};
