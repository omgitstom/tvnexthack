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
    usersRef.child(user).child('drinks').once('value', function(snapshot){
      var currentDrinks = snapshot.val();
      // If currentPoints is null, set to 1, otherwise increment by 1
      currentDrinks ? currentDrinks = currentDrinks + 1 : currentDrinks = 1;
      usersRef.child(user).child('drinks').set(currentDrinks);
    });
  },
  question: {
    send: function(question, answers, correctIx) {
      triviaRef.child('current').child('correct').once('value', function(data) {
        console.log({old: data.val()});
        var oldAnswer = data.val();
        triviaRef.child('current/users').once('value', function(old){
          func.question.tallyPrevious(old.val(), oldAnswer);
          var newQuestion = {
            question: question,
            answers: answers,
            correct: correctIx
          };
          triviaRef.child('current').set(newQuestion);
        });
      });
    },
    tallyPrevious: function(lastAnswers, answer) {
      console.log(lastAnswers);

      for(var user in lastAnswers){
        var lastAnswer = lastAnswers[user];
        console.log({user: user, answer: lastAnswers[user]});
        usersRef.child(user).child('points').once('value', function(snapshot){
          var currentPoints = snapshot.val();
          if (lastAnswer == answer) {
            console.log('Correct!');
            // If currentPoints is null, set to 1, otherwise increment by 1
            currentPoints ? currentPoints = currentPoints + 1 : currentPoints = 1;
            //console.log({user: userName, answer: userAnswer, correct: true, score: currentPoints});
          } else {
            console.log('Incorrect!');
            // decrement by 1 if currentPoints is greater than 0, otherwise set to 0
            currentPoints > 0 ? currentPoints = currentPoints - 1 : currentPoints = 0;
            //console.log({user: userName, answer: userAnswer, correct: false, score: currentPoints});
            func.oneDrink(user);
          }
          // Set the value for the child.
          usersRef.child(user).child('points').set(currentPoints);
        });
      }
    }
  }
};

module.exports = func;