"use strict";
requirejs.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib/'
	}
});

require(['lib/pixi', 'components/Board', 'components/Cell', 'lib/Array.compare'], function(PIXI, Board, Cell) {

	/**
	 * NO - A game of numbers.
	 */
	var Game = function(element, boardSize) {
		var width = element.clientWidth,
			height = element.clientHeight;

		this.renderer = PIXI.autoDetectRenderer(width, height);
		this.setup(boardSize);
		this.board.addEventListener("clicked", this.boardClicked.bind(this));

		element.appendChild(this.renderer.view);

		// Begin the loop
		this.loop();
	};

	/**
	 * Board was clicked.
	 */
	Game.prototype.boardClicked = function(event) {
		var position, cell;

		// Toggle cell
		if (this.cells[event.detail.x-1][event.detail.y-1]) {
			cell = this.cells[event.detail.x-1][event.detail.y-1];
			if (cell.type == Cell.FILLED) {
				cell.type = Cell.HINT;
				cell.redraw();
			} else {
				this.stage.removeChild(cell);
				this.cells[event.detail.x-1][event.detail.y-1] = undefined;
			}
		} else {
			position = this.board.translatePosition(event.detail);
			cell = new Cell(position.x, position.y, this.board.cellSize - 2, Cell.FILLED);
			this.stage.addChild(cell);
			this.cells[event.detail.x-1][event.detail.y-1] = cell;
		}

		// Check solution
		var cells = [];
		for (var x = 0; x < this.cells.length; x++) {
			cells[x] = [];
			for (var y = 0; y < this.cells[x].length; y++) {
				cells[x][y] = this.cells[x][y] && this.cells[x][y].type == Cell.FILLED ? true : false;
			}
		}

		if (this.checkSolution(cells, this.hints)) {
			this.reset();
		}
	};

	/**
	 * Build hints from a puzzle.
	 */
	Game.prototype.buildHints = function(puzzle) {
		var hints = {
			horizontal: [],
			vertical: []
		};
		var tempHorizontal = [];

		for (var x = 0; x < puzzle.length; x++) {
			var current = 0;
			hints.vertical[x] = [];
			for (var y = 0; y < puzzle[x].length; y++) {
				if (!tempHorizontal[y]) {
					tempHorizontal[y] = [];
				}

				tempHorizontal[y].push(puzzle[x][y]);

				if (puzzle[x][y]) {
					current++;
				} else if (current != 0) {
					hints.vertical[x].push(current);
					current = 0;
				}
			}
			if (current != 0) {
				hints.vertical[x].push(current);
			}
		}

		for (var y = 0; y < tempHorizontal.length; y++) {
			var current = 0;
			hints.horizontal[y] = [];
			for (var i = 0; i < tempHorizontal[y].length; i++) {
				if (tempHorizontal[y][i]) {
					current++;
				} else if (current != 0) {
					hints.horizontal[y].push(current);
					current = 0;
				}
			}
			if (current != 0) {
				hints.horizontal[y].push(current);
			}
		}

		return hints;
	};

	/**
	 * Check the solution against the hints.
	 */
	Game.prototype.checkSolution = function(solution, hints) {
		var solutionsHints = this.buildHints(solution);
		if (solutionsHints.horizontal.compare(hints.horizontal) &&
			solutionsHints.vertical.compare(hints.vertical)) {
			return true;
		}
		return false;
	};

	/**
	 * Generate a new puzzle.
	 */
	Game.prototype.generatePuzzle = function(size) {
		var cells = [];
		for (var x = 0; x < size; x++) {
			cells[x] = [];
			for (var y = 0; y < size; y++) {
				cells[x][y] = Math.floor(Math.random() * (10 - 2) + 1) < 5 ? true : false;
			}
		}

		// Debug display of the puzzle
		var lines = [];
		for (var x = 0; x < cells.length; x++) {
			for (var y = 0; y < cells[x].length; y++) {
				if (!lines[y]) {
					lines[y] = "";
				}
				lines[y] += cells[x][y] ? "X" : "O";
			}
		}
		console.log(lines.join("\n"));
		return cells;
	};

	/**
	 * Main loop.
	 */
	Game.prototype.loop = function() {
		this.renderer.render(this.stage);
		requestAnimFrame(this.loop.bind(this));
	};

	/**
	 * Setup the game.
	 */
	Game.prototype.setup = function(boardSize) {
		// Set the stage
		this.stage = new PIXI.Stage(0xf0f3f7);
		this.board = new Board(this.renderer.width / 2, this.renderer.height * 0.6, this.renderer.height * 0.6, boardSize);
		this.stage.addChild(this.board);

		// Setup the cells
		this.cells = [];
		for (var x = 0; x < boardSize; x++) {
			this.cells[x] = [];
			for (var y = 0; y < boardSize; y++) {
				this.cells[x][y] = undefined;
			}
		}

		// Generate the puzzle and show hints
		this.puzzle = this.generatePuzzle(boardSize);
		this.hints = this.buildHints(this.puzzle);
		for (var x = 0; x < this.hints.vertical.length; x++) {
			var content = this.hints.vertical[x].join("\n"),
				text = new PIXI.Text(content, {
				font: "bold " + (this.board.cellSize * 0.5) + "px Arial",
				fill: "#444444",
				align: "center"
			});
			text.anchor.x = 0.5;
			text.anchor.y = 1;
			text.position.x = this.board.x - (this.board.width / 2) + ((x + 0.5) * this.board.cellSize);
			text.position.y = this.board.y - (this.board.height / 2) - (this.board.cellSize * 0.1);
			this.stage.addChild(text);
		}
		for (var y = 0; y < this.hints.horizontal.length; y++) {
			var content = this.hints.horizontal[y].join(" ") + " ",
				text = new PIXI.Text(content, {
				font: "bold " + (this.board.cellSize * 0.5) + "px Arial",
				fill: "#444444",
				align: "center"
			});
			text.anchor.x = 1;
			text.anchor.y = 0.5;
			text.position.x = this.board.x - (this.board.width / 2) - (this.board.cellSize * 0.1);
			text.position.y = this.board.y - (this.board.height / 2) + ((y + 0.5) * this.board.cellSize);
			this.stage.addChild(text);
		}
	};

	Game.prototype.reset = function() {
		this.setup(6);
	}

	// Let's go!
	var game = document.getElementById("game");
	new Game(game, 6); // let's go

});
