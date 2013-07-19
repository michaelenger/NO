(function() {
"use strict";

/**
 * Board - The game board where the game takes place.
 */
Crafty.c('Board', {
	/**
	 * Size of the grid.
	 *
	 * @var int
	 */
	_grid_size: undefined,

	/**
	 * Initialize the board.
	 */
	init: function() {
		this.requires('Canvas, 2D, Mouse')
			.bind('Draw', this.drawBoard)
			.bind('Click', function(e) {
				var x = e.layerX - this._x,
					y = e.layerY - this._y,
					cell_size = Math.ceil(this._w / this._grid_size);
				x = Math.ceil(x / cell_size);
				y = Math.ceil(y / cell_size);

				Crafty.trigger('BoardCellClicked', {
					board: this,
					event: e,
					x: x,
					y: y
				});
			});
	},

	/**
	 * Draw the board using the canvas context.
	 *
	 * @param object vars Canvas variables
	 */
	drawBoard: function(vars) {
		var context = vars.ctx,
			cell_size = Math.ceil(this._w / this._grid_size);

		context.save();

		// Inner separators
		context.strokeStyle = 'rgba(63, 193, 245, 0.3)';
		context.lineWidth = 1;
		for (var i = 1; i < this._grid_size; i++) {
			context.beginPath();
			context.moveTo(this._x + (cell_size * i), this._y);
			context.lineTo(this._x + (cell_size * i), this._y + this._h);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(this._x, this._y + (cell_size * i));
			context.lineTo(this._x + this._w, this._y + (cell_size * i));
			context.stroke();
			context.closePath();
		}

		// Border
		context.strokeStyle = 'rgba(63, 193, 245, 1)';
		context.lineWidth = 2;
		context.strokeRect(this._x, this._y, this._w, this._h);

		context.restore();
	},

	/**
	 * Setup the board with a specific size.
	 *
	 * @param int size Size of the grid
	 * @return this
	 */
	board: function(size) {
		this._grid_size = size || this._grid_size;
		this.ready = true;
		return this;
	}
});

})();
