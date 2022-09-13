var $ = require( 'jquery' );
var queryString = require('query-string');

var Cart = function( $_ele, $_toggle ){
	this.$ele = $( $_ele );
	this.ele = this.$ele[0];

	this.$buyNow = $('.buy-now-holder', this.$ele );
	this.$emailMe = $('.button__email-me', this.$ele );
	this.$emailHolder = $('.cart--email', this.$ele );
	this.$inner = $('.cart--inner', this.$ele);
	this.$btnHolder = $('.button--paypal-holder', this.$ele );
	this.$toggle = ($_toggle) ? $($_toggle) : $('.cart-toggle', this.$ele );

	this.isVisible = this.$ele.hasClass('visible');
	this.emailMeVisible = this.$emailHolder.hasClass('active');

	this.updateUrl = '/calculate.php';
	this.shippingType = 'UK';
	this.contents = [];
	this.parseFromURL();
	this.toQueryString();
	this.setupInterface();
	this.setupChangeableInterface();
};

var proto = Cart.prototype;

proto.setupInterface = function(){
	var that = this;
	this.$emailMe.click( function(){
		that.showEmailMe();
		that._onEmailMe();
	});
	this.$toggle.click( function(){
		that.toggleVisibility();
	})
}

proto.showTemporarily = function(){
	var that = this;
	clearTimeout( this.showTimer );
	this.show();
	this.showTimer = setTimeout( function(){
		that.hide();
	}, 3000 );
}

proto.getOpenHeight = function(){
	return $('.cart--products', this.$inner).outerHeight() + $('.cart--shipping', this.$inner).outerHeight() + $('.cart--buy', this.$inner).outerHeight() + 60;
}

proto.setOpenHeight = function(){
	if( this.isVisible ){
		var h = this.getOpenHeight();
		this.$inner.css('max-height', h );
	}
}

proto.ensureHeight = function(){
	if( this.isVisible ){
		var h = this.getOpenHeight();
		this.$inner.css('max-height', h );
	}
}

proto.show = function(){
	clearTimeout( this.showTimer );
	this.isVisible = true;
	var h = this.getOpenHeight();
	this.$inner.css('max-height', h );
	this.$ele.addClass('visible');
	this.$toggle.addClass( "toggle--cart__visible");
}

proto.hide = function(){
	clearTimeout( this.showTimer );
	this.$inner.css('max-height', 0 )
	this.$ele.removeClass('visible');
	this.$toggle.removeClass( "toggle--cart__visible")
	this.isVisible = false;
	if( this.emailMeVisible ){
		this.hideEmailMe();
	}
}

proto.toggleVisibility = function(){
	if( this.isVisible ){
		this.hide();
	} else {
		this.show();
	}
}

proto.toggleEmailme = function(){
	if( this.emailMeVisible ){
		this.hideEmailMe();
	} else {
		this.showEmailMe();
	}
	if( this.isVisible ){
		console.log( 'rsize to show emial')
		this.show();
	}
}

proto.showEmailMe = function(){
	this.$emailHolder.addClass('active');
	this.emailMeVisible = true;
}
proto.hideEmailMe = function(){
	this.$emailHolder.removeClass('active');
	this.emailMeVisible = false;
}

proto._onEmailMe = function(){
	if( typeof this.onEmailMe === 'function' ){
		this.onEmailMe();
	}
}

proto.setupChangeableInterface = function(){
	var that = this;
	this.$products = $( '.cart--products', this.$ele );
	this.$shippingOptions = $( '.shipping-options', this.$ele );

	this.$shippingSelectors = $( 'input[name="shipping-distance"]', this.$shippingOptions );

	this.$itemRemover = $( '.cart-product--remove', this.$ele );

	this.$shippingSelectors.change( function(){
		that.changeShipping( this.value );
	});

	this.$itemRemover.click( function(){
		var toRemove = $(this).closest( '.cart-product' ).data('item-key');
		that.remove( toRemove );
	});
}

proto.parseFromURL = function(){
	var GET = queryString.parse( window.location.search );
	if( typeof GET['cart[]'] !== 'undefined' ){
		this.contents = this.contents.concat( GET['cart[]'] );
	}
	this.shippingType = GET.shipping || this.shippingType;
}

proto.toQueryString = function(){
	var GET = { 'cart[]': this.contents, shipping: this.shippingType };
	this.queryString = queryString.stringify( GET );
	return this.queryString;
}

proto.getButton = function( _cb ){
	$.get( this.updateUrl + '?' + this.queryString, function( data ){
		if( typeof _cb === 'function' ){
			_cb( data.cart.button );
		}
	});
}

proto.add = function( sku, size ){
	var id = (size) ? sku + '-' + size : sku;
	this.contents.push( id );
	this._onUpdate();
}

proto.remove = function( key ){
	var index = this.contents.indexOf( key );
	if( index !== -1 ){
		this.contents.splice( index, 1 );
		this._onUpdate();
	}
}

proto.changeShipping = function( to ){
	if( to === 'UK' || to === 'EU' || to === 'WORLD' ){
		this.shippingType = to;
		this._onUpdate();
	}
}

proto.getData = function( _cb ){
	var that = this;
	$.get( this.updateUrl + '?' + this.queryString, function( data ){
		if( typeof _cb === 'function' ){
			_cb( data );
		}
		that._onGetData( data );
	});
}

proto.updateInterface = function(){
	var that = this;
	//console.log('updating cart interface, contents length: ', this.contents.length );
	if( this.contents.length !== 0 ){
		if( !this.isVisible ){
			this.showTemporarily();
		} else {
			this.show();
		}
	} else {
		this.hide();
	}

	this.getData( function( data ){
		//console.log( 'cart update: ', data );
		var cartCount = data.cart.contents.length || 0;
		//console.log( cartCount + ' items in cart ' );
		var $cart = $( data.cart_markup );
		that.$products.empty();
		that.$products.append( $cart.find('.cart--products').html() );
		that.$shippingOptions.empty();
		that.$shippingOptions.append( $cart.find('.shipping-options').html() );
		$('.cart--total', that.$ele ).html( $cart.find('.cart--total').html() );

		that.$buyNow.html( $cart.find('.buy-now-holder').html() );

		if( cartCount <= 0 ){
			that.$ele.addClass( 'empty' );
		} else {
			that.$ele.removeClass( 'empty' );
		}

		if( that.isVisible ){
			that.ensureHeight();
		}

		that.setupChangeableInterface();
	});
};

proto._onGetData = function( data ){
	if( typeof this.onGetData === 'function' ){
		this.onGetData( data  );
	}
}

proto.onGetData = function( data ){ /* ... override ... */ };


proto._onUpdate = function(){
	this.toQueryString();
	this.updateInterface();
	if( typeof this.onUpdate === 'function' ){
		this.onUpdate( this.contents );
	}
}

proto.onUpdate = function(){ /* ... override ... */ };

module.exports = Cart;
