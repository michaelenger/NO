"use strict";
requirejs.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib/'
	}
});

require(['lib/pixi', 'board', 'cell'], function(PIXI, Board, Cell) {

	/**
	 * NO - A game of numbers.
	 */
	var Game = function(element) {
		var width = element.clientWidth,
			height = element.clientHeight,
			gridSize = 6;

		// Set the stage
		this.stage = new PIXI.Stage(0xf0f3f7);
		this.renderer = PIXI.autoDetectRenderer(width, height);
		element.appendChild(this.renderer.view);

		// Setup the board
		this.board = new Board(width / 2, height * 0.6, height * 0.6, gridSize);
		this.stage.addChild(this.board);
		this.board.addEventListener("clicked", this.boardClicked.bind(this));

		// Setup the cells
		this.cells = [];
		for (var x = 0; x < gridSize; x++) {
			this.cells[x] = [];
			for (var y = 0; y < gridSize; y++) {
				this.cells[x][y] = undefined;
			}
		}

		// Draw
		this.draw();
	};

	/**
	 * Board was clicked.
	 */
	Game.prototype.boardClicked = function(event) {
		var position, cell;

		if (this.cells[event.detail.x-1][event.detail.y-1]) {
			this.stage.removeChild(this.cells[event.detail.x-1][event.detail.y-1]);
			this.cells[event.detail.x-1][event.detail.y-1] = undefined;
		} else {
			position = this.board.translatePosition(event.detail);
			cell = new Cell(position.x, position.y, this.board.cellSize - 2, Cell.FILLED);
			this.stage.addChild(cell);
			this.cells[event.detail.x-1][event.detail.y-1] = cell;
		}
	};

	/**
	 * Render the stage.
	 */
	Game.prototype.draw = function() {
		this.renderer.render(this.stage);
		requestAnimFrame(this.draw.bind(this));
	};

	// Let's go!
	var game = document.getElementById("game");
	new Game(game); // let's go

});
