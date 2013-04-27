var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseio.com/');

module.exports = {
  drink: function(event, length) {
    mainRef.child(event).child('drink').set(true);
    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  },
  question: {
    send: function(event, question, answers, correctIx) {
      var trivia = mainRef.child(event).child('trivia');
      var newQuestion = this.trivia.push();
      newQuestion.set({question: question, answers: answers, correct: correctIx});
      trivia.child('current').set(newQuestion.name());
      return newQuestion;
    },
    answer: function(event, questionIx, user, answer) {
      var trivia = mainRef.child(event).child('trivia');
      if (questionIx != trivia.child('current')) {
        console.log('Not the current question');
        return false;
      } else {
        question.users.child(user.username).set(answer);
      }
    }
  }
};
