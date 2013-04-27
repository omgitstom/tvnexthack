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
      var newQuestion = trivia.push();
      var question = {question: question, questionIx: newQuestion.name(), answers: answers, correct: correctIx};
      trivia.child('current').set(question);
      newQuestion.set(question);
      return newQuestion;
    },
    answer: function(event, questionIx, user, answer) {
      var trivia = mainRef.child(event).child('trivia');
      if (questionIx != trivia.child('current').child(questionIx).val()) {
        console.log('Not the current question');
        return false;
      }
      question.users.child(user.username).set(answer);
      return true;
    }
  }
};