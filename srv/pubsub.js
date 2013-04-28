var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseio.com/')
  , usersRef = new Firebase('https://drivia.firebaseio.com/users')
  , triviaRef = new Firebase('https://drivia.firebaseio.com/trivia');

var event = "basketball-game";

module.exports = {
  drink: function(event, length) {
    mainRef.child(event).child('drink').set(true);
    // give a drink to all the users
    usersRef.once('child_added')
    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  },
  question: {
    send: function(question, answers, correctIx) {
      var parent = this;
      triviaRef.child('current').child('correct').once('value', function(data) {
        parent.tallyPrevious(data.val());
      })
      var question = {
        question: question,
        answers: answers,
        correct: correctIx
      };
      //triviaRef.child('current').set(question);
    },
    tallyPrevious: function(answer) {
      // get all the answers for the current question
      var previousAnswers = [];
      triviaRef.child('current').child('users').once('value', function(data){
        var obj = data.val();
        previousAnswers.push(obj);
      });
      //console.log(previousAnswers);
      usersRef.once('value', function(snapshot) {
        var userData = snapshot.val();
        console.log(userData);
        console.log(previousAnswers);
        // console.log(previousAnswers);
        // console.log(previousAnswers[snapshot.name()]);
        if (previousAnswers[snapshot.name()]) {
          if (previousAnswers[snapshot.name()] == answer) {
            // console.log(snapshot.name() + ' answered ' + answer);
            usersRef.child(snapshot.name()).child('points').set(userData.points + 1);
          } else {
            if (userData.points > 0) {
              usersRef.child(snapshot.name()).child('points').set(userData.points - 1);
            }
          }
        }
        // console.log(snapshot.name());
        // console.log(previousAnswers);
        //if (previousAnswers.)
        // console.log(snapshot.name());
      });
    }
  }
};