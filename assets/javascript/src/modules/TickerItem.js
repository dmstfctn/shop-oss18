var $ = require( 'jquery' );

var TickerItem = function( label, _calculationFunction ){
	this.label = label;
	this.calcluationFunction = _calculationFunction;
	this.leaderItem = false;

	this.x = 0;
	this.speed = -3;//-1.5;

	this.hasReachedEdge = false;
	this.constructDOM();
}

var proto = TickerItem.prototype;

proto.constructDOM = function(){
	this.$ele = $( '<span class="ticker-item"></span>' );
	this.dom = {
		$label: $('<span class="ticker-item--label"></span>'),
		$value: $('<span class="ticker-item--value"></span>')
	};
	this.dom.$label.text( this.label );
	this.dom.$value.text( this.value );
	this.$ele.append( this.dom.$label ).append( this.dom.$value );
	this.$ele.css({
		'position': 'absolute'
	});
}

proto.appendTo = function( $parent ){
	$parent.append( this.$ele );
	this.width = this.$ele.outerWidth();
	this.setPosition();
	this.reset();
}

proto.setLeader = function( leaderItem ){
	this.leaderItem = leaderItem;
	this.setPosition();
}

proto.setPosition = function(){
	if( this.leaderItem ){
		this.x = this.leaderItem.right;
	} else {
		this.x = this.x;
	}
	this.right = this.x + this.width;
	if( this.x < -this.width ){
		this.hasReachedEdge = true;
	}
}

proto.reset = function(){
	this.setPosition();
	this.hasReachedEdge = false;
}

proto.render = function(){
	this.$ele.css({
		'transform': 'translateX(' + this.x + 'px) translateZ(0)'
	});
}

proto.move = function(){
	this.x += this.speed;
}

proto.update = function(){
	this.setPosition();
	this.render();
}

proto.calculate = function( count ){
	this.count = count;
	if( typeof this.calcluationFunction === 'function' ){
		this.value = this.calcluationFunction( count )
	}
	this.dom.$value.text( this.value );
	return this.value;
}

module.exports = TickerItem;
