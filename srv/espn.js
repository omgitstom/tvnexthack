'use strict';
var
  http = require('http');

module.exports = {
  teams: {
    celtics: 2,
    knicks: 18
  },
  team: function(teamId, callback){
    http.get('http://api.espn.com/v1/sports/basketball/nba/teams/' +
             parseInt(teamId, 10) +
             '?apiKey=8s24r2hcjbbdq3m5f4vgxnq9',
             function(response){
               var data = '';
               response.on('data', function(chunk){
                 data += chunk;
               });
               response.on('end', function(){
                 callback(JSON.parse(data).sports[0].leagues[0].teams[0]);
               });
             });
  },
  roster: function(teamId, callback){
    http.get('http://api.espn.com/v1/sports/basketball/nba/teams/' +
             parseInt(teamId, 10) +
             '?apiKey=8s24r2hcjbbdq3m5f4vgxnq9&enable=roster',
             function(response){
               var data = '';
               response.on('data', function(chunk){
                 data += chunk;
               });
               response.on('end', function(){
                 callback(JSON.parse(data).sports[0].leagues[0].teams[0].athletes);
               });
             });
  }
};