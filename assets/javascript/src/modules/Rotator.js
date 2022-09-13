var $ = require( 'jquery' );

var Rotator = function( $_ele ){
	this.$ele = $( $_ele );
	this.rotated = false;
	this.setupInterface();
};

var proto = Rotator.prototype;

proto.setupInterface = function(){
	var that = this;
	this.$ele.on('click', function(){
		that.rotate();
	});
};

proto.rotate = function(){
	this.rotated = !this.rotated;
	if( this.rotated ){
		this.$ele.addClass('rotated');
	} else {
		this.$ele.removeClass('rotated');
	}
	this._onRotate();
};

proto._onRotate = function(){
	if( typeof this.onRotate === 'function' ){
		this.onRotate();
	}
};

proto.onRotate = function(){ /*... override ...*/ };

module.exports = Rotator;
