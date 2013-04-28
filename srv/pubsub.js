var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseio.com/')
  , trivia = new Firebase('https://drivia.firebaseio.com/trivia');

var event = "basketball-game";

module.exports = {
  drink: function(event, length) {
    mainRef.child(event).child('drink').set(true);
    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  },
  question: {
    send: function(question, answers, correctIx) {
      var question = {
        question: question,
        answers: answers,
        correct: correctIx
      };
      trivia.child('current').set(question);
    },
    tallyPrevious: function(question, answers) {
      var usersRef = new Firebase('https://drivia.firebaseio.com/users');
      var answers = trivia.child('current').child('users').val();

    }
  }
};