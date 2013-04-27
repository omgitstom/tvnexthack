var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseio.com/');

module.exports = {
  drink: function(event, length) {
    mainRef.child(event).child('drink').set(true);
    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  },
  sendQuestion: function(question, answers, correctIx) {
    var trivia = new Firebase('https://drivia.firebaseio.com/trivia');
    newQuestion = trivia.push();
    newQuestion.set({question: question, answers: answers, correct: correctIx});
  },
  answerQuestion: function() {}
};
