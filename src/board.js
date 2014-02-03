"use strict";
define(['lib/pixi'], function(PIXI) {

	/**
	 * Board - A game board used in the game.
	 */
	var Board = function(x, y, size, cells) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.cells = cells;

		PIXI.Graphics.call(this);
		this.redraw();
	};

	Board.prototype = Object.create(PIXI.Graphics.prototype);
	Board.prototype.constructor = Board;

	/**
	 * Redraw the board.
	 */
	Board.prototype.redraw = function() {
		var s2 = this.size / 2,
			x1 = this.x - s2,
			x2 = this.x + s2,
			y1 = this.y - s2,
			y2 = this.y + s2,
			cell = this.size / this.cells;

		this.clear();

		// Cell separators
		this.lineStyle(2, 0xb2e1f7, 1);
		for (var i = 1; i < this.cells; i++) {
			this.moveTo(x1 + (i * cell), y1);
			this.lineTo(x1 + (i * cell), y2);
			this.moveTo(x1, y1 + (i * cell));
			this.lineTo(x2, y1 + (i * cell));
		}

		// Border
		this.lineStyle(2, 0x3fc1f5, 1);
		this.moveTo(x1, y1);
		this.lineTo(x2, y1);
		this.lineTo(x2, y2);
		this.lineTo(x1, y2);
		this.lineTo(x1, y1);
	};

	return Board;

});
