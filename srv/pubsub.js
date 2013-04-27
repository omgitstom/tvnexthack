var Firebase = require('firebase')
  , mainRef = new Firebase('https://drivia.firebaseIO-demo.com/');

module.exports = {
  drink: function(event, length) {
    console.log('Drink!!1!');
    mainRef.child(event).child('drink').set(true);
    setTimeout(function() {
      mainRef.child(event).child('drink').set(false);
    }, length * 1000);
  }
};
