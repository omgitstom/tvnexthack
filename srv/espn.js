'use strict';

var http = require('http');

module.exports = function(){
  setInterval(function(){
    http.get({
      hostname: 'livefeed.api.tv',
      port: 80,
      path: '/hack2013/v1/getlivefeeditems/args/livefeed/1632384/starttime/live/format.json',
      method: 'POST'
    }, function(response){
      var data;

      //response.on('data', function(chunk){
        //data += chunk;
        //console.log(chunk);
      //});
      console.log(response.headers);
    });
  }, 1000);
};