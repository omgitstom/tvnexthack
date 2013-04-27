function Rinkd(options) {
	if (!(this instanceof Rinkd)) {
    	return new BrightcoveAdobePass(options);
  	}

	this.options = options;
}

Rinkd.prototype.init = function (){
	this.firebase = new Firebase(this.options.firebaseURL);
	this.firebase.set('Hello World!');
};

/**
To bootstrap the creation of Rinkd
**/
$(document).ready(function(){
	//Set up the options
	var options = {
		'fireBaseURL':''
	},
	//Create a new object
	drink = new Rinkd(options);

	//Run init
	drink.init();
});