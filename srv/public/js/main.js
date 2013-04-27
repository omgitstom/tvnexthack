function Rinkd(options) {
	if (!(this instanceof Rinkd)) {
    	return new Rinkd(options);
  	}

	this.options = options;
}

Rinkd.prototype.init = function (){
	this.firebase = new Firebase(this.options.fireBaseURL);
	this.authClient = new FirebaseAuthClient(this.firebase,  this.did_login.bind(this));
	//wire up interface
	$('.play-now').click(this.authenticate.bind(this));
	$('.logout').click(this.logout.bind(this));
};

Rinkd.prototype.authenticate = function(){
	this.authClient.login('twitter');
};
Rinkd.prototype.logout = function (){
	this.authClient.logout();
}

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