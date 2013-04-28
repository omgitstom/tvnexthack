function Rinkd(options) {
	if (!(this instanceof Rinkd)) {
    	return new Rinkd(options);
  	}

	this.options = options;
}

Rinkd.prototype.init = function (){
	this.firebase = new Firebase(this.options.fireBaseURL);
	this.authClient = new FirebaseAuthClient(this.firebase,  this.did_login.bind(this));
	this.trivia = new Firebase(this.options.fireBaseURL+'/trivia/current');
	this.users = new Firebase(this.options.fireBaseURL+'/users');
	this.presence = new Firebase(this.options.fireBaseURL+'/disconnectmessage');

	this.trivia.on('value',this.onTriviaChildAdded.bind(this));
	this.users.on('value', this.onUserValue.bind(this));

	//wire up interface
	$('.play-now').click(this.authenticate.bind(this));
	$('.logout').click(this.logout.bind(this));
};
Rinkd.prototype.onUserValue = function (data){
	//get a user
	var users = data.val();

	var tbody = $('.user-table-data').empty();
	for(var name in users){
		var user = users[name];
		tbody.append(
				$('<tr />').append(
						$('<td />').text(user.drinks),
						$('<td />').text(user.points),
						$('<td />').append(
								$('<a />').attr('href', 'https://twitter.com/'+name).text(name)
							)
					)
			);
	};
};	
Rinkd.prototype.onValue = function(data){
	var currentQuestion = data.val();
	console.log(currentQuestion);
};
Rinkd.prototype.onTriviaChildAdded = function(data){
	
	var currentQuestion = data.val();
	var question = currentQuestion.question;
	var answers = currentQuestion.answers;
	var length = answers.length;
	var i = 0;
	var answerNode = $('.answers').empty();
	var self = this;

	this.currentQuestion = currentQuestion;

	$('.question').text(question);
	
	for(i; i<length; i+=1){
		answerNode.append($('<button />')
			.addClass('btn btn-primary')
			.attr('type', 'button')
			.text(answers[i])
			.attr('answerIx', i)
			.on('click',{'self':self}, self.answerQuestion)
			);
	}

};
Rinkd.prototype.answerQuestion = function (evt){
	var self = evt.data.self;
	var target = evt.target;
	var answerIx = $(target).attr('answerIx');
	var screen_name = self.screen_name;

	self.trivia.child('users').child(screen_name).set(answerIx);
};
Rinkd.prototype.authenticate = function(){
	this.authClient.login('twitter');
};
Rinkd.prototype.logout = function (){
	this.authClient.logout();
	this.users.child(this.screen_name).remove();
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
		var data = {
			'screen_name': user.screen_name,
			'profile_url': user.profile_image_url
		}
	    this.users.child(data.screen_name).child('profile_url').set(data.profile_url);
	    this.users.child(data.screen_name).child('drink').set(false);
	    this.users.child(data.screen_name).child('drinks').set(0);
	    this.users.child(data.screen_name).child('points').set(0);

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