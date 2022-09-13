var $ = require( 'jquery' );
var Expander = require('./Expander.js');

var About = function( $_ele, $_toggle ){
	this.$ele = $( $_ele );
	this.$toggle = $( $_toggle );
	this.$scroller = $('.about--scroller', this.$ele );
	this.visible = this.$ele.hasClass( 'visible' );
	this.expanderTerms = new Expander( $('.about--terms', this.$ele ) );
	this.expanderTerms.collapse();
	this.expanderSizing = new Expander( $('.about--sizing', this.$ele ) );
	this.expanderSizing.collapse();
	this.setupInterface();
}

var proto = About.prototype;

proto.setupInterface = function(){
	var that = this;
	this.$toggle.click(function( e ){
		e.preventDefault();
		that.toggleVisibility();
	});
	this.expanderTerms.onChange = function(){
		if( that.expanderTerms.expanded ){
			setTimeout(function(){
				var pos = that.expanderTerms.$ele.position().top;
				that.$scroller.animate({ 'scrollTop': pos }, 300 );
			},250)
		}
	}
	this.expanderSizing.onChange = function(){
		if( that.expanderSizing.expanded ){
			setTimeout(function(){
				var pos = that.expanderSizing.$ele.position().top;
				that.$scroller.animate({ 'scrollTop': pos }, 300 );
			},250)
		}
	}
};

proto.toggleVisibility = function(){
	if( this.visible ){
		this.hide();
	} else {
		this.show();
	}
};

proto.hide = function(){
	this.visible = false;
	this.$ele.removeClass('visible');
	this.$toggle.text('About');
	this._onHide();
};

proto.show = function(){
	this.visible = true;
	this.$ele.addClass('visible');
	this.$toggle.text('Close');
	this._onShow();
};

proto._onShow = function(){
	if( typeof this.onShow === 'function' ){
		this.onShow();
	}
}

proto.onShow = function(){ /* ... override ... */ }

proto._onHide = function(){
	if( typeof this.onHide === 'function' ){
		this.onHide();
	}
}

proto.onHide = function(){ /* ... override ... */ }

module.exports = About;
