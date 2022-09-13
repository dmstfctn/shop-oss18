var $ = require( 'jquery' );

var ProductImageSlideshow = function( $_ele, $_slides ){
	this.$ele = $( $_ele );
	this.$breadcrumbs = $( '.image-nav--crumb', this.$ele );
	this.$slides = $($_slides);
	this.currentSlide = 0;
	this.slideCount = this.$slides.length;

	console.log( 'make ProductImageSlideshow ', 	this.$breadcrumbs.length, ' breadcrumbs and ', this.slideCount, ' slides ' );
	this.setupInterface();
};

var proto = ProductImageSlideshow.prototype;

proto.startAuto = function(){
	var that = this;
	this.isAutoplaying = true;
	this.auto = setInterval(function(){

		that.currentSlide++;
		if( that.currentSlide > that.slideCount - 1 ){
			that.currentSlide = 0;
		}
		console.log( 'slide interval, to ', that.currentSlide );
		that.selectSlide( that.currentSlide );
	}, 7000 );
}

proto.stopAuto = function(){
	this.isAutoplaying = false;
	clearInterval( this.auto );
}

proto.setupInterface = function(){
	var that = this;
	this.$breadcrumbs.on('click', function(){
		var index = $(this).index();
		that.selectSlide( index );
	});
};

proto.selectSlide = function( which ){
	var wasAutoplaying = this.isAutoplaying;
	if( this.isAutoplaying ){
		this.stopAuto();
	}
	var $targetSlide = this.$slides.eq( which );
	this.currentSlide = which;
	this.$breadcrumbs.removeClass( 'active' );
	this.$breadcrumbs.eq( which ).addClass( 'active' );

	this.$slides.removeClass( 'active' );
	if( $targetSlide.hasClass('loaded') !== true ){
		$targetSlide
			.attr( 'src', $targetSlide.attr('data-src') )
			.addClass( 'loaded' );
	}
	$targetSlide.addClass( 'active' );
	if( wasAutoplaying ){
		this.startAuto();
	}
	this._onSlideChange();
};

proto._onSlideChange = function(){
	if( typeof this.onSlideChange === 'function' ){
		this.onSlideChange();
	}
};

proto.onSlideChange = function(){ /*... override ...*/ };

module.exports = ProductImageSlideshow;
