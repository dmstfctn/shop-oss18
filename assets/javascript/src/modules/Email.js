var $ = require( 'jquery' );

var Email = function( $_ele ){
	this.$ele = $( $_ele );
	this.ele = this.$ele[0];

	this.$close = $('.email-cancel', this.$ele );
	this.$submit = $( '', this.$ele );
	this.$form = $( 'form', this.$ele );
	this.$shoppingUrlField = $( '[name="url"]', this.$form );
	this.submitURL = this.$form.attr('action');
	this.$message = $('.email-message', this.$ele );

	this.setupInterface();
}

var proto = Email.prototype;

proto.setupInterface = function(){
	var that = this;
	this.$form.submit( function(e){
		e.preventDefault();
		that.send();
		return false;
	});
}

proto.updateShoppingURL = function( to ){
	this.$shoppingUrlField.val( to );
}

proto.send = function(){
	var that = this;
	this.$message.removeClass('visible');
	this.$ele.addClass('loading');
	var post = $.post( this.submitURL, this.$form.serializeArray(), function( data ){
		console.log( 'emailer says: ', data );
		if( data.status === 'SUCCESS' && data.description === 'SENT' ){
			that.success();
		} else {
			that.error();
		}
		clearTimeout( that.loadingTimeout );
		that.loadingTimeout = setTimeout(function(){
			that.$ele.removeClass('loading');
		}, 500 );
	}, 'json' );
}

proto.success = function( _cb ){
	var that = this;
	this.$message.addClass('success');
	this.$message.html( 'Email sent &#x2714;' )
	this.$message.addClass('visible');
	clearTimeout(this.messageTimeout);
	this.messageTimeout = setTimeout( function(){
		that.$message.removeClass('visible');
		that._onSuccess();
	}, 2000 );
	setTimeout( _cb , 300 );
}

proto.error = function(){
	var that = this;
	this.$message.removeClass('success');
	this.$message.html( 'Email error, please retry' );
	this.$message.addClass('visible');
	clearTimeout(this.messageTimeout);
	this.messageTimeout = setTimeout( function(){
		that.$message.removeClass('visible');
	}, 2000 );
}

proto._onSuccess = function(){
	if( typeof this.onSuccess === 'function' ){
		this.onSuccess();
	}
}

proto.onSuccess = function(){ /* ... override ... */ };

module.exports = Email;
