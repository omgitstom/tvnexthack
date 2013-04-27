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
    trivia: new Firebase('https://drivia.firebaseio.com/trivia'),
    send: function(question, answers, correctIx) {
      var newQuestion = this.trivia.push();
      newQuestion.set({question: question, answers: answers, correct: correctIx});
      this.current = newQuestion;
      return newQuestion;
    },
    answer: function(question, user, answer) {
      if (question != this.current) {
        console.log('Not the current question');
      } else {
        question.users.child(user.username).set(answer);
      }
    }
  }
};
