'use strict';

var
  http = require('http'),
  baseball = require('./baseball'),
  pubsub = require('./pubsub'),
  espn = require('./espn'),
  util = require('util');

module.exports = function(){
  var
    reported = 0,

    // player lookup
    players = {},

    teams = {},

    checkForKeywordMatches = function(text){
      text = text.toLowerCase();

      Object.keys(baseball).forEach(function(level){
        baseball[level].forEach(function(keyword){
          if (~text.indexOf(keyword)){
            pubsub.drink('baseball-game', level);
            return;
          }
        });
      });
    },

    mentions = [],
    checkForPlayerMentions = function(text){
      var lower = text.toLowerCase();
      util.print(text);

      Object.keys(players).forEach(function(teamName){
        Object.keys(players[teamName]).forEach(function(playerName){
          if (~lower.indexOf(playerName)){
            console.log('detected mention of ', playerName);
            mentions.push({
              team: teamName,
              name: playerName,
              ix: players[teamName][playerName]
            });
          }
        });
      });
    },

    sendQuestion = function(question, answers, correctIx){
      console.log(question, answers, correctIx);
      //pubsub.question.send(question, answers, correctIx);
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
            // checkForKeywordMatches(item.Data.Text);
            checkForPlayerMentions(item.Data.Text);
          });
        });
      });
    },

    // range is inclusive
    random = function(start, end){
      return start + Math.round((end - start) * Math.random());
    },
    randoms = function(start, end, count){
      var result = [], next;
      while (result.length < count) {
        next = random(start, end);
        if (!~result.indexOf(next)) {
          result.push(next);
        }
      }
      return result;
    },

    questions,

    chooseQuestion = function(left, right){
      return function(){
        var
          team,
          mention,
          athlete;
        console.log('choosing', mentions);
        if (mentions.length) {
          mention = mentions.pop();
          team = teams[mention.team];
          athlete = team.roster[mention.ix];
          console.log('using ' + athlete.displayName);
        } else {
          team = random(0, 1) ? left : right;
          athlete = team.roster[random(0, team.roster.length - 1)];
        }

        console.log(athlete);

        questions[random(0, questions.length - 1)](team, athlete);
      }
    },

    weightQuestion = function(team, athlete){
      var
        correctIx = random(0, 3),
        answers = randoms(0, 3, 3);

      answers = answers.map(function(e){
        if (random(0, 1)) {
          return athlete.weight + (5 * e) + 5;
        } else {
          return athlete.weight - (5 * e) - 5;
        }
      });
      answers.splice(correctIx, 0, athlete.weight);

      sendQuestion("How much does " + athlete.displayName + " weigh?", answers, correctIx);
    },
    ageQuestion = function(team, athlete){
      var
        correctIx = random(0, 3),
        answers = randoms(0, 5, 3);

      answers = answers.map(function(e){
        if (random(0, 1)) {
          return athlete.age + e + 1;
        } else {
          return athlete.age - e - 1;
        }
      });
      answers.splice(correctIx, 0, athlete.age);

      sendQuestion("How old is " + athlete.displayName + "?", answers, correctIx);
    },
    heightQuestion = function(team, athlete){
      var
        correctIx = random(0, 3),
        answers = randoms(0, 5, 3);

      answers = answers.map(function(e){
        var height;
        if (random(0, 1)) {
          height = athlete.height + e + 1;
        } else {
          height = athlete.height - e - 1;
        }
        return Math.floor(height / 12) + "'" + (height % 12) + '"';
      });
      answers.splice(correctIx, 0, Math.floor(athlete.height / 12) + "'" + (athlete.height % 12) + '"');

      sendQuestion("How tall is " + athlete.displayName + "?", answers, correctIx);
    },
    winsQuestion = function(team, athlete){
      var
        correctIx = random(0, 3),
        answers = randoms(1, 6, 3);

      answers = answers.map(function(e){
        return random(0, 1) ? e + team.record.wins : team.record.wins - e;
      });
      answers.splice(correctIx, 0, team.record.wins);

      sendQuestion("How many wins do the " + team.name + " have this season?", answers, correctIx);
    },
    overtimeLossesQuestion = function(team, athlete){
      sendQuestion("How many overtime losses did the " + team.name + " have this season?", ['0', '1', '2', '3'], 0);
    };

  questions = [
    weightQuestion,
    ageQuestion,
    heightQuestion,
    winsQuestion,
    overtimeLossesQuestion
  ];

  // get the team summaries
  espn.team(espn.teams.celtics, function(team){
    teams.celtics = team;
    espn.team(espn.teams.knicks, function(team){
      teams.knicks = team;

      // get the team rosters
      espn.roster(espn.teams.celtics, function(roster){
        teams.celtics.roster = roster;
        espn.roster(espn.teams.knicks, function(roster){
          var populatePlayers = function(teamName, team){
            players[teamName] = {};
            team.roster.forEach(function(athlete, ix){
              var
                first = athlete.firstName.toLowerCase(),
                last = athlete.lastName.toLowerCase();
              if (!players[teamName][first]) {
                players[teamName][first] = [];
              }
              players[teamName][first].push(ix);

              if (!players[teamName][last]) {
                players[teamName][last] = [];
              }
              players[teamName][last].push(ix);
            });
          };

          teams.knicks.roster = roster;

          populatePlayers('knicks', teams.knicks);
          populatePlayers('celtics', teams.celtics);

          // when a keyword is matched in the captions, a "lightning" round begins
          setInterval(lightningRound, 1000);

          setInterval(function(){
            // send new trivia questions to all the contestants
            chooseQuestion(teams.celtics, teams.knicks)();

            // clear out the mentions every once in awhile
            mentions = [];
          }, 3000);
        });
      });
    });
  });
};
