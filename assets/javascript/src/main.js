var $ = require( 'jquery' );
var Cart = require( './modules/Cart.js' );
var Product = require('./modules/Product.js');
var Slideshow = require( './modules/Slideshow.js');
var Email = require( './modules/Email.js');
var About = require( './modules/About.js');
var TaxTicker = require( './modules/TaxTicker.js');

var BREAKPOINTS = {
	small: 700
};

$('.site--products').add('.site--about').css({opacity: 0});

var about = new About( $('.site--about'), $('.toggle--about') );
var cart = new Cart( $('.site--cart'), $('.site--header .toggle--cart').add('.site--cart .toggle--cart') );
var email = new Email( $('.site--emailform') );
var slideshow = new Slideshow( $('.product-slideshow'), $('.product-list .product') );
var tt = new TaxTicker( $('.site--taxticker'), false, $('body').attr('data-currency-sign') );

setInterval(function(){
	tt.getSoldCount();
}, 10 * 60 * 1000 ); // every 10 minutes

if( $(window).width() < BREAKPOINTS.small ){
	tt.stop();
}

email.onSuccess = function(){
	cart.hideEmailMe();
}

cart.onUpdate = function( contents ){
	window.history.replaceState( {} , null, '?' + cart.queryString + window.location.hash);
	email.updateShoppingURL( window.location.href );
}

cart.onGetData = function(){
	for( var i = 0; i < products.length; i++ ){
		if( products[i].addingToCart ){
			products[i].addToCartButton.setComplete();
			products[i].addingToCart = false;
		}
	}
}

var products = [];
$( '.product-list .product' ).each(function( i ){
	var product = new Product( $(this), slideshow.getSlideAt( i ) ) ;
	product.onAddToCart = function( sku, size ){
		cart.add( sku, size );
	}
	product.$info.find('a[href="#about"]').click(function(e){
		e.preventDefault();
		about.show();
	})
	product.onToggleInfo = function( hidden ){
		if( !hidden ){
			$('body').addClass('product-info-visible');
			if( $(window).width() < BREAKPOINTS.small ){
				cart.hide();
			}
		} else {
			$('body').removeClass('product-info-visible')
		}
	}
	products.push( product );
	if( i >= 1 ){
		$(this).addClass('product__hide-interface');
	} else {
		$(this).removeClass('product__hide-interface');
	}
});

$('.site--products').addClass('slideshow-active');

slideshow.onSelect = function( index ){
	$('.product-list .product').addClass('product__hide-interface');
	var $active = $('.product-list .product').eq( index );
	$active.removeClass('product__hide-interface');
	$('body').attr( 'data-current-product', $active.attr('id') );
	window.location.hash = $active.attr('id');
};

about.onShow = function(){
	$('body').attr( 'data-about-visible', true );
	cart.hide();
	if( $(window).width() < BREAKPOINTS.small ){
		tt.start();
	}
}
about.onHide = function(){
	$('body').attr( 'data-about-visible', false );
	if( $(window).width() < BREAKPOINTS.small ){
		tt.stop();
	}
}

if( window.location.hash ){
	slideshow.jumpTo( window.location.hash );
}



// var pWinW = $(window).width();
// var pWinH = $(window).height();
var isAboveBreak = ($(window).width() > BREAKPOINTS.small);

$(window).on('resize', function(){
	if( $(window).width() < BREAKPOINTS.small ){
		if( isAboveBreak ){	// was previously larger than breakpoint
			cart.hide();
			tt.stop();
			for( var i = 0; i < products.length; i++ ){
				products[i].startAutoSlideshow();
			}
		}
		isAboveBreak = false;
	} else {
		if( !isAboveBreak ){ // was previously smaller than breakpoint
			tt.start();
			for( var i = 0; i < products.length; i++ ){
				products[i].stopAutoSlideshow();
			}
		}
		isAboveBreak = true;

	}
	cart.setOpenHeight();
	//pWinW = $(window).width();
	//pWinH = $(window).height();
});

setTimeout(function(){
	$('.site--products').add('.site--about').animate({opacity: 1}, 1000 );
	tt.getSoldCount();
	if( $(window).width() < BREAKPOINTS.small ){
		for( var i = 0; i < products.length; i++ ){
			products[i].startAutoSlideshow();
		}
	} 
}, 1000 );
