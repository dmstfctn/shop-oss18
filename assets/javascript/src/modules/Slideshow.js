var $ = require( 'jquery' );
var Flickity = require( 'flickity' )

var Slideshow = function( _$ele, _$src ){
	this.$ele = $(_$ele);
	if( _$src ){
		this.createFrom( _$src );
	}
}

var proto = Slideshow.prototype;

proto.createFrom = function( $src ){
	var that = this;
	$src.each(function( i ){
		var $img = $(this).find('.product--image');
		var $prod = $('<div class="product product__' + $(this).attr('id') + '"></div>');
		$prod.append( $img );
		that.$ele.append( $prod );
	});

	this.createSlider();
}

proto.getSlideAt = function( index ){
	return this.$ele.find('.product').eq( index );
}

proto.createSlider = function(){
	var that = this;
	this.slider = new Flickity( this.$ele[0], {
		wrapAround: true,
		imagesLoaded: true,
		pageDots: false,
		// arrowShape: {
		// 	x0: 38.85,
		// 	x1: 56.78, y1: 50,
		// 	x2: 61.15, y2: 48.43,
		// 	x3: 43.78
		// }
		arrowShape: {
			x0: 40.25,
			x1: 58.08, y1: 50,
			x2: 59.96, y2: 48.86,
			x3: 42.38
		}
	});

	this.slider.on('select', function( ){
		that._onSelect( that.slider.selectedIndex );
	});
}

proto.jumpTo = function( name ){
	name = name.replace('#','');
	var index = this.$ele.find( '.product' ).filter( '.product__' + name ).index();
	this.slider.select( index, false, true );
}

proto._onSelect = function( index ){
	if( typeof this.onSelect === 'function' ){
		this.onSelect( index );
	}
}

module.exports = Slideshow;
