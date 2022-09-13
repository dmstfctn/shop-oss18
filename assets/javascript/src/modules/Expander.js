var $ = require( 'jquery' );

var Expander = function( $_ele ){
	this.$ele = $( $_ele );
	this.$toggle = $( '.expander--toggle', this.$ele );
	this.$contents = $( '.expander--contents', this.$ele );
	this.$contentsInner = $( 'expander--contents-inner', this.$ele );
	this.expanded = this.$ele.hasClass( 'expanded' );
	this.setupInterface();	
};

var proto = Expander.prototype;

proto.setupInterface = function(){
	var that = this;
	this.$toggle.on('click', function(){
		that.toggle();
	});
};

proto.toggle = function(){
	var that = this;
	if( this.expanded ){
		this.collapse()
	} else {
		this.expand();
	}
};

proto.expand = function(){
	this.$ele.addClass('expanded');
	this.expanded = true;
	this._onChange();
}

proto.collapse = function(){
	this.$ele.removeClass('expanded');
	this.expanded = false;
	this._onChange();
}

proto._onChange = function(){
	if( typeof this.onChange === 'function' ){
		this.onChange();
	}
};

proto.onChange = function(){ /*... override ...*/ };

module.exports = Expander;
