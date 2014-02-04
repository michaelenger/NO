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
		var s2 = this.size / 2,
			x1 = this.x - s2,
			x2 = this.x + s2,
			y1 = this.y - s2,
			y2 = this.y + s2,
			cell = this.size / this.cells;
		this.width = this.size;
		this.height = this.size;

		this.clear();

		switch (this.type) {
			case Cell.FILLED:
				this.beginFill(0x757778, 1);
				this.moveTo(x1, y1);
				this.lineTo(x2, y1);
				this.lineTo(x2, y2);
				this.lineTo(x1, y2);
				this.lineTo(x1, y1);
				this.endFill();
				break;
			default:
				console.error("Unhandled cell type: " + this.type);
		}
	};

	return Cell;

});
