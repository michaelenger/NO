(function() {
"use strict";

/**
 * Board - The game board where the game takes place.
 */
Crafty.c('Board', {
	/**
	 * Whether the board is active (responds to mouse events).
	 *
	 * @var boolean
	 */
	_active: true,

	/**
	 * List of "active" cells.
	 *
	 * @var array
	 */
	_cells: undefined,

	/**
	 * List of clue entities.
	 *
	 * @var array
	 */
	_clues: [],

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
			.bind('MouseDown', this.mouseDownEvent);
	},

	/**
	 * Draw the board using the canvas context.
	 *
	 * @param object vars Canvas variables
	 */
	drawBoard: function(vars) {
		var context = vars.ctx,
			cell_size = this._w / this._grid_size,
			clue_image = new Image();
		clue_image.src = 'assets/clue.png';

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
		for (var i = 0; i < this._clues.length; i++) {
			//this._clues[i].destroy();
		}
		this._clues = [];

		context.fillStyle = 'rgba(117, 119, 120, 1)';
		context.strokeStyle = 'rgba(216, 219, 223, 1)';
		context.lineWidth = cell_size * 0.13;
		for (var x = 0; x < this._cells.length; x++) {
			for (var y = 0; y < this._cells[x].length; y++) {
				if (this._cells[x][y] === 1) {
					context.fillRect(this._x + (cell_size * x) + 1, this._y + (cell_size * y) + 1, cell_size - 2, cell_size - 2);
				} else if (this._cells[x][y] === -1) {
					context.beginPath();
					context.arc(this._x + (cell_size * x) + (cell_size / 2), this._y + (cell_size * y) + (cell_size / 2), cell_size * 0.35, 0, Math.PI * 2, true);
					context.closePath();
					context.stroke();

					context.beginPath();
					context.moveTo(this._x + (cell_size * x) + (cell_size * 0.25), this._y + (cell_size * y) + (cell_size * 0.75));
					context.lineTo(this._x + (cell_size * x) + (cell_size * 0.75), this._y + (cell_size * y) + (cell_size * 0.25));
					context.closePath();
					context.stroke();

//					context.fillRect(this._x + (cell_size * x) + 1, this._y + (cell_size * y) + 1, cell_size - 2, cell_size - 2);
//					context.drawImage(clue_image, this._x + (cell_size * x), this._y + (cell_size * y), cell_size, cell_size)
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
				this._cells[x][y] = 0;
			}
		}

		if (this.ready) {
			this.trigger('Change');
		} else {
			this.ready = true;
		}
		return this;
	},

	/**
	 * Board was clicked.
	 *
	 * @param MouseEvent event Mouse event
	 */
	mouseDownEvent: function(e) {
		if (!this._active) {
			return;
		}

		var x = e.layerX - this._x,
			y = e.layerY - this._y,
			cell_size = Math.ceil(this._w / this._grid_size);
		x = Math.floor(x / cell_size);
		y = Math.floor(y / cell_size);

		if (e.mouseButton == Crafty.mouseButtons.LEFT) {
			this._cells[x][y] = this._cells[x][y] === 1 ? 0 : 1;
		} else if (e.mouseButton == Crafty.mouseButtons.RIGHT) {
			this._cells[x][y] = this._cells[x][y] === -1 ? 0 : -1;
		}
		this.trigger('Change');

		Crafty.trigger('BoardChanged', this);
	}
});

/**
 * Button - Generic button component.
 */
Crafty.c('Button', {

	/**
	 * Initialize the component.
	 */
	init: function() {
		this.requires('2D, Mouse')
			.bind('Click', this.clickEvent);
	},

	/**
	 * Button was clicked.
	 *
	 * @param MouseEvent event Mouse event
	 */
	clickEvent: function(event) {
		this.trigger('ButtonClicked', this);
	}
});

/**
 * SpriteButton - Button which can be clicked based on a sprite.
 */
Crafty.c('SpriteButton', {

	/**
	 * Contains the current sprite.
	 *
	 * @var Entity
	 */
	_sprite: undefined,

	/**
	 * The sprites for normal and hover states.
	 *
	 * @var string
	 */
	_sprite_normal: undefined,
	_sprite_hover: undefined,

	/**
	 * Initialize the component.
	 */
	init: function() {
		this.requires('Button')
			.bind('MouseOver', this.mouseOverEvent)
			.bind('MouseOut', this.mouseOutEvent);
	},

	/**
	 * Configure the button with the correct position.
	 *
	 * @param string normal_sprite Name of the sprite to show in normal state
	 * @param string hover_sprite  Name of the sprite to show in hover state
	 * @param int    x
	 * @param int    y
	 * @return this
	 */
	button: function(normal_sprite, hover_sprite, x, y) {
		this._sprite_normal = normal_sprite;
		this._sprite_hover = hover_sprite;
		this.attr({ x: x, y: y })
			.sprite(normal_sprite);
		return this;
	},

	/**
	 * Button was mouse outed.
	 *
	 * @param MouseEvent event Mouse event
	 */
	mouseOutEvent: function(event) {
		if (this._sprite_normal) {
			this.sprite(this._sprite_normal);
		}
	},

	/**
	 * Button was mouse overed.
	 *
	 * @param MouseEvent event Mouse event
	 */
	mouseOverEvent: function(event) {
		if (this._sprite_hover) {
			this.sprite(this._sprite_hover);
		}
	},

	/**
	 * Set the current sprite.
	 *
	 * @param string sprite Name of the sprite to set.
	 * @return this
	 */
	sprite: function(sprite) {
		if (typeof this._sprite !== 'undefined') {
			this._sprite.destroy();
			this._sprite = undefined;
		}
		this._sprite = Crafty.e('2D, Canvas, ' + sprite)
			.attr({ x: this._x , y: this._y });
		this.attr({ w: this._sprite._w, h: this._sprite._h });
	}
});

/**
 * TextButton - Button which can be clicked that contains some text.
 */
Crafty.c('TextButton', {
	/**
	 * Font config.
	 *
	 * @var array
	 */
	_font: {
		family: 'Arial',
		weight: 'bold',
		size: '40px'
	},

	/**
	 * Text color on normal and hover states.
	 *
	 * @var string
	 */
	_textColorNormal: '#444',
	_textColorHover: 'rgb(125,198,250)',

	/**
	 * Initialize the component.
	 */
	init: function() {
		this.requires('Button, DOM, Text')
			.textFont(this._font)
			.css({
				color: this._textColorNormal,
				cursor: 'default',
				'text-align': 'center'
			})
			.bind('MouseOver', this.mouseOverEvent)
			.bind('MouseOut', this.mouseOutEvent);
	},

	/**
	 * Configure the button with the right text and position. Note that the position denotes the center of the button.
	 *
	 * @param string text
	 * @param int    x
	 * @param int    y
	 * @return this
	 */
	button: function(text, x, y) {
		var height = parseInt(this._font.size.replace('px', '')),
			width = text.length * height;
		this.text(text)
			.attr({ x: x - Math.ceil(width / 2), y: y - Math.ceil(height / 2), w: width, h: height });
		return this;
	},

	/**
	 * Button was mouse outed.
	 *
	 * @param MouseEvent event Mouse event
	 */
	mouseOutEvent: function(event) {
		this.css({ color: this._textColorNormal });
	},

	/**
	 * Button was mouse overed.
	 *
	 * @param MouseEvent event Mouse event
	 */
	mouseOverEvent: function(event) {
		this.css({ color: this._textColorHover });
	}
});

})();
