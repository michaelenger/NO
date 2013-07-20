(function() {
"use strict";

/**
 * Board - The game board where the game takes place.
 */
Crafty.c('Board', {
	/**
	 * List of "active" cells.
	 *
	 * @var array
	 */
	_cells: undefined,

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
				x = Math.floor(x / cell_size);
				y = Math.floor(y / cell_size);

				this._cells[x][y] = !this._cells[x][y];
				this.trigger('Change');

				Crafty.trigger('BoardChanged', this);
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
		context.strokeStyle = 'rgba(63, 193, 245, 0.7)';
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

		// Cells
		context.fillStyle = 'rgba(117, 119, 120, 0.9)';
		for (var x = 0; x < this._cells.length; x++) {
			for (var y = 0; y < this._cells[x].length; y++) {
				if (this._cells[x][y]) {
					context.fillRect(this._x + (cell_size * x) + 1, this._y + (cell_size * y) + 1, cell_size - 2, cell_size - 2);
				}
			}
		}

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

		this._cells = new Array(this._grid_size);
		for (var x = 0; x < this._cells.length; x++) {
			this._cells[x] = new Array(this._grid_size);
			for (var y = 0; y < this._cells[x].length; y++) {
				this._cells[x][y] = false;
			}
		}

		this.ready = true;
		return this;
	}
});

})();
