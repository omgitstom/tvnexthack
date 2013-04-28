var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseio.com/')
  , usersRef = new Firebase('https://drivia.firebaseio.com/users')
  , triviaRef = new Firebase('https://drivia.firebaseio.com/trivia');

var event = "basketball-game";

var func = {
  allDrink: function(event, length) {
    mainRef.child(event).child('drink').set(true);

    // give a drink to all the users
    usersRef.once('child_added', function(data){
      var userName = data.name();
      var userData = data.val();
      usersRef.child(userName).child('drinks').once('value', function(snapshot){
        var currentDrinks = snapshot.val();
        // If currentPoints is null, set to 1, otherwise increment by 1
        currentDrinks ? currentDrinks = currentDrinks + 1 : currentDrinks = 1;
        usersRef.child(userName).child('drinks').set(currentDrinks);
      });
    });

    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  },
  oneDrink: function(user) {
    var userDrinkRef = usersRef.child(user).child('drink');
    userDrinkRef.set(true);
    setTimeout(function(){
      userDrinkRef.set(false);
    }, 3000);
  },
  question: {
    send: function(question, answers, correctIx) {
      var parent = this;
      triviaRef.child('current').child('correct').once('value', function(data) {
        parent.tallyPrevious(data.val());
        var newQuestion = {
          question: question,
          answers: answers,
          correct: correctIx
        };
        triviaRef.child('current').set(newQuestion);
      });
    },
    tallyPrevious: function(answer) {
      // get all the answers for the current question
      triviaRef.child('current').child('users').once('value', function(data){
        data.forEach(function(child){
          var userName = child.name();
          var userAnswer = child.val();
          //console.log({user: userName, answer: answer, userAnswer: userAnswer})
          usersRef.child(userName).child('points').once('value', function(snapshot){
            var currentPoints = snapshot.val();
            console.log({user: userName, userAnswer: userAnswer, actualAnswer: answer});
            if (userAnswer === answer) {
              // If currentPoints is null, set to 1, otherwise increment by 1
              currentPoints ? currentPoints = currentPoints + 1 : currentPoints = 1;
              //console.log({user: userName, answer: userAnswer, correct: true, score: currentPoints});
            } else {
              // decrement by 1 if currentPoints is greater than 0, otherwise set to 0
              currentPoints > 0 ? currentPoints = currentPoints - 1 : currentPoints = 0;
              //console.log({user: userName, answer: userAnswer, correct: false, score: currentPoints});
              func.oneDrink(userName);
            }
            // Set the value for the child.
            usersRef.child(userName).child('points').set(currentPoints);
          });
        });
      });
    }
  }
};

module.exports = func;