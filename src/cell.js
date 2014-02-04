"use strict";
define(['lib/pixi'], function(PIXI) {

	/**
	 * Cell - A cell in the board.
	 */
	var Cell = function(x, y, size, type) {
		PIXI.Graphics.call(this);

		this.x = x;
		this.y = y;
		this.size = size;
		this.type = type;

		this.redraw();
	};

	Cell.prototype = Object.create(PIXI.Graphics.prototype);
	Cell.prototype.constructor = Cell;

	Cell.FILLED = 1;
	Cell.HINT = 2;

	/**
	 * Draw the cell - should be called if the position/size is changed.
	 */
	Cell.prototype.redraw = function() {
		var x = this.x,
			y = this.y,
			s = this.size;
		this.width = this.size;
		this.height = this.size;

		this.clear();

		switch (this.type) {
			case Cell.FILLED:
				s = this.size / 2;
				x = this.x - s;
				y = this.y - s;
				this.beginFill(0x757778, 1);
				this.drawRect(x, y, this.size, this.size);
				this.endFill();
				break;
			case Cell.HINT:
				s = this.size * 0.35;
				x = this.x - (this.size * 0.3);
				y = this.y - (this.size * 0.3);
				this.lineStyle(8, 0xd8dbdf, 1);
				this.drawCircle(this.x, this.y, s);
				this.moveTo(x, y + (this.size * 0.6));
				this.lineTo(x + (this.size * 0.6), y);
				break;
			default:
				console.error("Unhandled cell type: " + this.type);
		}
	};

	return Cell;

});
