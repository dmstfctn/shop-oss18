var $ = require( 'jquery' );
var TickerItem = require( './TickerItem.js' );

var TaxTicker = function( $_ele, _soldCount, _currencySign ){
	this.$ele = $( $_ele );
	this.soldCount = _soldCount || 0;
	this.currencySign = _currencySign || '£';
	this.makeItems();
	this.start();
	// this.getSoldCount();
}

var proto = TaxTicker.prototype;

proto.makeItems = function(){
	var that = this;
	this.items = [];
	for( var i = 0; i < 3; i++ ){
		this.items.push( new TickerItem( 'Shareholders', function( count ){
			return '58';
		}));
		this.items.push( new TickerItem( 'Return on Investment', function( count ){
			var one = (100/89);
			var result = count * one;
			return Math.floor( result * 100 ) / 100 + '%';
		}));
		// this.items.push( new TickerItem( 'Return on Investment (Onshore)', function( count ){
		// 	var one = (100/89);
		// 	var result = count * one;
		// 	return Math.floor( result * 100 ) / 100 + '%';
		// }));
		// this.items.push( new TickerItem( 'Return on Investment (Offshore)', function( count ){
		// 	var one = (100/90) * ( (100/19) / 19 );
		// 	var result = count * one;
		// 	return Math.floor( result * 100 ) / 100 + '%';
		// }));
		// this.items.push( new TickerItem( 'Return on Investment (Offshore)', function( count ){
		// 	var one = (100/89) * 4;
		// 	var result = count * one;
		// 	return Math.floor( result * 100 ) / 100 + '%';
		// }));
		this.items.push( new TickerItem( 'Tax Avoided', function( count ){
			var one = (50*0.33) * 0.19;
			var result = count * one;
			var value = that.currencySign +  Math.floor( result * 100 ) / 100;
			var valueSplit = value.split( '.' );
			if( valueSplit.length > 1 ){
				if( valueSplit[1].length === 1 ){
					value += '0';
				}
			}
			return value;
		}));
		this.items.push( new TickerItem( 'Tax Paid (Onshore)', function( count ){
			return '0%';
		}));
		this.items.push( new TickerItem( 'Tax Paid (Offshore)', function( count ){
			return '0%';
		}));
	}
	this.appendItems();
	this.setLeaders();
}

proto.appendItems = function(){
	for( var i = 0; i < this.items.length; i++ ){
		this.items[i].appendTo( this.$ele );
	}
}

proto.setLeaders = function(){
	for( var i = 0; i < this.items.length; i++ ){
		if( i > 0 ){
			this.items[i].setLeader( this.items[i - 1] );;
		}
	}
	for( var i = 0; i < this.items.length; i++ ){
		if( i > 0 ){
			this.items[i].setPosition();
		}
	}
}

proto.getSoldCount = function(){
	var that = this;
	$.getJSON( 'get/soldcount.json', function( data ){
		that.soldCount = data.sold_count;
		that.calculate();
	})
}

proto.calculate = function(){
	for( var i = 0; i < this.items.length; i++ ){
		this.items[i].calculate( this.soldCount );
	}
}

proto.loop = function(){
	var that = this;
	this.loopCount = (this.loopCount) ? this.loopCount + 1 : 1;
	//console.log( this.loopCount)
	//cancelAnimationFrame( this.animFrame );
	this.animFrame = requestAnimationFrame( function(){
		if( that.loopCount % 2 === 0 ){
			that.frame();
		}
		that.loop();
	});
}

proto.frame = function(){
	this.items[0].move();
	for( var i = 0; i < this.items.length; i++ ){
		this.items[i].update();
	}
	if( this.items[0].hasReachedEdge ){
		// when the first one hits the edge, move it to the end of the array
		var off = this.items.shift();
		off.setLeader( this.items[ this.items.length -1 ] );
		off.reset();
		this.items.push( off );
		// set the new leader to have no leader
		this.items[0].setLeader( false );
	}
}

proto.start = function(){
	cancelAnimationFrame( this.animFrame );
	this.loop();
}

proto.stop = function(){
	cancelAnimationFrame( this.animFrame );
}


module.exports = TaxTicker;
