function Rinkd(options) {
	if (!(this instanceof Rinkd)) {
    	return new Rinkd(options);
  	}

	this.options = options;
}

Rinkd.prototype.init = function (){
	var date = new Date();
	this.firebase = new Firebase(this.options.fireBaseURL);
	this.authClient = new FirebaseAuthClient(this.firebase,  this.did_login.bind(this));
	this.trivia = new Firebase(this.options.fireBaseURL+'/trivia');
	this.trivia = this.trivia.limit(1);

	//this.trivia.on('value',this.onValue.bind(this));
	this.trivia.on('child_added',this.onTriviaChildAdded.bind(this));

	//wire up interface
	$('.play-now').click(this.authenticate.bind(this));
	$('.logout').click(this.logout.bind(this));
};
Rinkd.prototype.onValue = function(snapshot){

}
Rinkd.prototype.onTriviaChildAdded = function(snapshot){
	console.log(snapshot.val());
	var question = snapshot.val().question;
	var answers = snapshot.val().answers;
	var length = answers.length;
	var i = 0;
	var answerNode = $('.answers').empty();

	$('.question').text(question);
	
	for(i; i<length; i+=1){
		answerNode.append($('<button />').addClass('btn').text(answers[i]));
	}
}
Rinkd.prototype.authenticate = function(){
	this.authClient.login('twitter');
};
Rinkd.prototype.logout = function (){
	this.authClient.logout();
};
Rinkd.prototype.onDrink = function (){

};
Rinkd.prototype.did_login = function (error, user){
	if (error) {
	    // an error occurred while attempting login
	    console.log(error);
	} else if (user) {
	    // user authenticated with Firebase
	    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
	    
	    //add user name
	    $('.username').text('@'+user.screen_name);

	    //Show log out button
	    $('.logout').show();

	    //Slide Intro Down/Slide in Game
	    $('.intro').fadeOut(function(){$('.game').slideDown('slow')});


	} else {
		$('.username').text('');
		$('.game').slideUp('slow', function(){$('.intro').fadeIn()});
	    $('.logout').hide();
	}
}
/**
To bootstrap the creation of Rinkd
**/
$(document).ready(function(){
	//Set up the options
	var options = {
		'fireBaseURL':'https://drivia.firebaseio.com'
	},

	//Create a new object
	drink = new Rinkd(options);

	//Run init
	drink.init();
});