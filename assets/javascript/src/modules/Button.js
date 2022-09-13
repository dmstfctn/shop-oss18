var $ = require( 'jquery' );

var Button = function( $_ele, timing ){
	this.$ele = $( $_ele );
	this.timing = timing || 200;
	this.timer = false;
}

var proto = Button.prototype;

proto.setState = function( to ){
	this.$ele.attr('data-button--state', to );
}

proto.setLoading = function(){
	this.setState( 'loading' );
};

proto.setComplete = function(){
	var that = this;
	clearTimeout( this.timer );
	this.setState( 'complete' );

	this.timer = setTimeout( function(){
		that.setClear();
	}, this.timing * 5 );
}

proto.setClear = function(){
	var that = this;
	this.setState( 'wipe' );
	clearTimeout( this.timer );
	this.timer = setTimeout( function(){
		that.setState( false );
	}, this.timing );
}

module.exports = Button;
