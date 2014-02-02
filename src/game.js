"use strict";
(function() {

	/**
	 * NO - A game of numbers.
	 */
	var Game = function(element) {
		var width = element.clientWidth,
			height = element.clientHeight;

		// Set the stage
		this.stage = new PIXI.Stage(0xf0f3f7);
		this.renderer = PIXI.autoDetectRenderer(width, height);
		element.appendChild(this.renderer.view);

		// Setup the board
		var board = new Board(width / 2, height * 0.6, height * 0.6, 6);
		this.stage.addChild(board);

		// Draw
		this.draw();
	};

	/**
	 * Render the stage.
	 */
	Game.prototype.draw = function() {
		this.renderer.render(this.stage);
		requestAnimFrame(this.draw.bind(this));
	};

	/**
	 * Board - A game board used in the game.
	 */
	var Board = function(x, y, size, cells) {
		var graphics = new PIXI.Graphics();
		var s2 = size / 2,
			x1 = x - s2,
			x2 = x + s2,
			y1 = y - s2,
			y2 = y + s2,
			cell = size / cells;

		// Cell separators
		graphics.lineStyle(2, 0xb2e1f7, 1);
		for (var i = 1; i < cells; i++) {
			graphics.moveTo(x1 + (i * cell), y1);
			graphics.lineTo(x1 + (i * cell), y2);
			graphics.moveTo(x1, y1 + (i * cell));
			graphics.lineTo(x2, y1 + (i * cell));
		}

		// Border
		graphics.lineStyle(2, 0x3fc1f5, 1);
		graphics.moveTo(x1, y1);
		graphics.lineTo(x2, y1);
		graphics.lineTo(x2, y2);
		graphics.lineTo(x1, y2);
		graphics.lineTo(x1, y1);

		return graphics;
	};

	// Start the game
	window.onload = function() {
		var game = document.getElementById("game");
		new Game(game); // let's go
	}

})();
