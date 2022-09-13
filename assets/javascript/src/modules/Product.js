var Button = require( './Button.js' );
var ProductImageSlideshow = require( './ProductImageSlideshow.js' );
var $ = require( 'jquery' );


var Product = function( _$ele, _$slide ){
	this.$ele = $( _$ele );
	this.ele = this.$ele[0];

	this.$slide = $( _$slide );

	this.$details = $( '.product--details', this.$ele );
	this.$infoToggle = $( '.product--toggleinfo', this.$ele );
	this.$info = $('.product--info', this.$ele );
	this.infoHidden = !this.$ele.hasClass( 'show-info' );
	this.addingToCart = false;
	this.$addToCart = $('.button__add-to-cart', this.$ele );
	this.addToCartButton = new Button( $('.button__add-to-cart', this.$ele ), 200 );
	this.$paypal = $('.button-paypal form', this.$ele );
	this.hasSizes = $('.config__sizes', this.$ele ).length > 0;
	this.$sizeOptions = $('.config__sizes .config--option', this.$ele );
	this.$imageNav = $('.product--image-nav', this.$ele);
	this.$imageNavCrumb = $('.image-nav--crumb', this.$imageNav );

	this.hasSlideshow = this.$ele.hasClass('product__has-slideshow');
	this.slideshow = (this.hasSlideshow) ? new ProductImageSlideshow( $('.product--image-nav', this.$ele), $('img',this.$slide) ) : false;

	//load first image
	var $firstImg = this.$slide.find( '.product--image .active');
	$firstImg
		.attr('src', $firstImg.attr('data-src') )
		.addClass('loaded');


	this.SKU = this.$ele.data('sku');

	if( !this.infoHidden ){
		this.hideInfo();
	}

	this.setupInterface();
}

Product.prototype = {
	startAutoSlideshow: function(){
		if( this.hasSlideshow ){
			this.slideshow.startAuto();
		}
	},
	stopAutoSlideshow: function(){
		if( this.hasSlideshow ){
			this.slideshow.stopAuto();
		}
	},
	setupInterface: function(){
		var that = this;
		this.$infoToggle.click(function( e ){
			e.preventDefault();
			that.toggleInfo();
		});
		
		// EDIT: disable shop
		// this.$addToCart.click(function( e ){
		// 	e.preventDefault();
		// 	that.addToCartButton.setLoading();
		// 	that.addToCart();
		// });

		this.$sizeOptions.click(function(){
			that.$sizeOptions.removeClass('selected');
			$(this).addClass('selected');
		});

		if( this.hasSlideshow ){

		}
	},
	toggleInfo: function(){
		if( this.infoHidden ){
			this.showInfo();
		} else {
			this.hideInfo();
		}
	},
	showInfo: function(){
		this.infoHidden = false;
		this.$ele.addClass( 'show-info' );
		this.$slide.addClass( 'show-info' );
		this.$infoToggle.text( 'Show Product' );
		this._onToggleInfo();
	},
	hideInfo: function(){
		this.infoHidden = true;
		this.$ele.removeClass( 'show-info' );
		this.$slide.removeClass( 'show-info' );
		this.$infoToggle.text( 'More Info' );
		this._onToggleInfo();
	},
	addToCart: function(){
		var id = this.SKU;
		size = false;
		if( this.hasSizes ){
			size = $('.config__sizes', this.$ele ).find('.selected').attr('data-size');
			id += '-' + size;
		}
		this.addingToCart = true;
		this._onAddToCart( this.SKU, size );
	},
	_onAddToCart: function( sku, size ){
		if( typeof this.onAddToCart === 'function' ){
			this.onAddToCart( sku, size );
		}
	},
	onAddToCart: function( sku, size ){ /* ... override ..*/ },
	_onToggleInfo: function( ){
		if( typeof this.onToggleInfo === 'function' ){
			this.onToggleInfo( this.infoHidden );
		}
	},
	onToggleInfo: function( hidden ){ /* ... override ..*/ }
}

module.exports = Product;
