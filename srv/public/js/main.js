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
	this.trivia = new Firebase(this.options.fireBaseURL+'/trivia/current');

	this.trivia.on('child_changed',this.onTriviaChildAdded.bind(this));

	//wire up interface
	$('.play-now').click(this.authenticate.bind(this));
	$('.logout').click(this.logout.bind(this));
};
Rinkd.prototype.onValue = function(snapshot){

}
Rinkd.prototype.onTriviaChildAdded = function(snapshot){
	this.currentQuestion = snapshot.val();
	var question = snapshot.val().question;
	var answers = snapshot.val().answers;
	var length = answers.length;
	var i = 0;
	var answerNode = $('.answers').empty();
	var self=this;

	$('.question').text(question);
	
	for(i; i<length; i+=1){
		answerNode.append($('<button />')
			.addClass('btn')
			.text(answers[i])
			.on('click',{'self':self}, self.answerQuestion)
			);
	}
}
Rinkd.prototype.answerQuestion = function (evt){
	var self = evt.data.self;
	var target = evt.target;
	var answer = $(target).text();
	var currentQuestion = self.currentQuestion;
	var data = {
		'questionIx': currentQuestion.questionIx,
		'user':self.screen_name,
		'answer':answer
	};

	$.post('/', data);

};
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
		//
		this.screen_name = user.screen_name;
	    
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