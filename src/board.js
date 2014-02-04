"use strict";
define(['lib/pixi'], function(PIXI) {

	/**
	 * Board - A game board used in the game.
	 */
	var Board = function(x, y, size, cells) {
		PIXI.Graphics.call(this);
		PIXI.EventTarget.call(this);

		this.x = x;
		this.y = y;
		this.size = size;
		this.cells = cells;
		this.interactive = true;
		this.mousedown = this.touchstart = this.onClicked;

		this.redraw();

		Object.defineProperty(this, "cellSize", {
			get: function() {
				return this.size / this.cells;
			}
		});
	};

	Board.prototype = Object.create(PIXI.Graphics.prototype);
	Board.prototype.constructor = Board;

	/**
	 * Board was clicked/touched.
	 */
	Board.prototype.onClicked = function(event) {
		var clickEvent = new CustomEvent("clicked", {
			detail: this.reverseTranslatePosition(event.global)
		});
		this.dispatchEvent(clickEvent);
	};

	/**
	 * Draw the board - should be called if the position/size is changed.
	 */
	Board.prototype.redraw = function() {
		var s2 = this.size / 2,
			x1 = this.x - s2,
			x2 = this.x + s2,
			y1 = this.y - s2,
			y2 = this.y + s2,
			cell = this.size / this.cells;
		this.width = this.size;
		this.height = this.size;
		this.hitArea = new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);

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

	/**
	 * Translate global X/Y position to local coordinates.
	 */
	Board.prototype.reverseTranslatePosition = function(position) {
		var position = position.clone(),
			x = this.x - (this.size / 2),
			y = this.y - (this.size / 2),
			cellSize = this.cellSize;
		position.x = Math.ceil((position.x - x) / cellSize);
		position.y = Math.ceil((position.y - y) / cellSize);
		return position;
	};

	/**
	 * Translate local X/Y position to global coordinates.
	 */
	Board.prototype.translatePosition = function(position) {
		var position = position.clone(),
			x = this.x - (this.size / 2),
			y = this.y - (this.size / 2),
			cellSize = this.cellSize;
		position.x = x + ((position.x - 0.5) * this.cellSize);
		position.y = y + ((position.y - 0.5) * this.cellSize);
		return position;
	};

	return Board;

});
