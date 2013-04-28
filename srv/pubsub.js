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
      var newQuestion = trivia.push();
      var question = {question: question, answers: answers, questionIx: newQuestion.name(), correct: correctIx};
      newQuestion.set(question);
      trivia.child('current').set(question);
      return newQuestion;
    },
    answer: function(questionIx, user, answer) {
      if (questionIx != trivia.child('current').child(questionIx).val()) {
        console.log('Not the current question');
        return false;
      } else if (trivia.child('trivia').child(questionIx).child(user.username).val()) {
        console.log('Already answered.');
        return false;
      }
      trivia.child('trivia').child(questionIx).child(user.username).set(answer);
      return true;
    }
  }
};