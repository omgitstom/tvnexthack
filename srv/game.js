'use strict';

var
  http = require('http'),
  baseball = require('./baseball'),
  pubsub = require('./pubsub'),
  espn = require('./espn');

module.exports = function(){
  var
    reported = 0,

    checkForMatches = function(text){
      text = text.toLowerCase();
      Object.keys(baseball).forEach(function(level){
        baseball[level].forEach(function(keyword){
          if (~text.indexOf(keyword)){
            console.log('matched at level', level, keyword, text);
            pubsub.drink('baseball-game', level);
            return;
          }
        });
      });
    },

    lightningRound = function(){
      http.get('http://livefeed.api.tv/hack2013/v1/getlivefeeditems/args/livefeed/1632393/starttime/live/format.json', function(response){
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
    },

    random = function(start, end){
      return start + Math.round((end - start) * Math.random());
    },

    weightQuestion = function(left, right){
      return function(){
        var
          team = random(0, 1) ? left : right,
          athlete = team[random(0, team.length)],
          correctIx = random(0, 4),
          i = 0,
          answers = [];

        for (; i < 4; ++i) {
          if (i == correctIx) {
            answers.push(athlete.weight);
          } else if (random(0, 1)) {
            answers.push(athlete.weight - 5 - (5 * random(0, 3)));
          } else {
            answers.push(athlete.weight + 5 + (5 * random(0, 3)));
          }
        }
        
        console.log("How much does " + athlete.displayName + " weigh?", answers, correctIx);
        pubsub.sendQuestion("How much does " + athlete.displayName + " weigh?", answers, correctIx);
      }
    };

  // when a keyword is matched in the captions, a "lightning" round begins
  setInterval(lightningRound, 1000);

  // get the team rosters
  espn.roster(espn.teams.celtics, function(roster){
    var celtics = roster;
    espn.roster(espn.teams.knicks, function(roster){
      var knicks = roster;

      // send new trivia questions to all the players
      setInterval(weightQuestion(celtics, knicks), 3000);
    });
  });
  
};
