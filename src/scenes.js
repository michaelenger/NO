(function() {
"use strict";

/**
 * Game Scene - Where the action is ;)
 */
Crafty.scene('Game', function() {
	var board_size = 6, // @todo: set this in a menu somewhere
		board_width = Math.ceil((Game.config.width < Game.config.height ? Game.config.width : Game.config.height) * 0.6),
		board_height = board_width,
		board_x = Math.ceil((Game.config.width - board_width) / 2),
		board_y = Math.ceil((Game.config.height - board_height) * 0.8),
		puzzle = new Array(board_size),
		clues = undefined;

	// Puzzle
	for (var x = 0; x < puzzle.length; x++) {
		puzzle[x] = new Array(board_size);
		for (var y = 0; y < puzzle[x].length; y++) {
			puzzle[x][y] = Math.round(Math.random() * 5) < 2 ? false : true; // 3/5 chance of getting a filled-in cell
		}
	}

	// Translate cells to horizontal/vertical clues
	// Please excuse how ugly this is....
	var translateCellsToClues = function(cells) {
		var clues = {
				horizontal: new Array(cells.length),
				vertical: new Array(cells.length)
			},
			ynum = new Array(cells.length);
		for (var y = 0; y < ynum.length; y++) {
			ynum[y] = 0;
			clues.horizontal[y] = new Array();
		}
		for (var x = 0; x < cells.length; x++) {
			var num = 0;
			clues.vertical[x] = new Array();
			for (var y = 0; y < cells[x].length; y++) {
				if (cells[x][y]) {
					num++;
					ynum[y]++;
				} else {
					if (num) {
						clues.vertical[x].push(num);
					}
					if (ynum[y]) {
						clues.horizontal[y].push(ynum[y]);
					}
					num = 0;
					ynum[y] = 0;
				}
			}
			if (num) {
				clues.vertical[x].push(num);
			}
		}
		for (var y = 0; y < ynum.length; y++) {
			if (ynum[y]) {
				clues.horizontal[y].push(ynum[y]);
			}
		}

		return clues;
	}
	clues = translateCellsToClues(puzzle);

	// Output the puzzle (for debug reasons)
	var output = new Array(puzzle.length);
	for (var x = 0; x < puzzle.length; x++) {
		for (var y = 0; y < puzzle[x].length; y++) {
			if (typeof output[y] == 'undefined') {
				output[y] = '';
			}
			output[y] += puzzle[x][y] ? 'X' : 'O';
		}
	}
	console.log(output.join('\n'));

	// Game board
	Crafty.e('Board')
		.attr({ x: board_x, y: board_y, w: board_width, h: board_height })
		.board(board_size);

	// Clues
	var cell_size = Math.ceil(board_height / board_size),
		clue_css = {
			'color': '#444',
			'text-align': 'right',
			'vertical-align': 'bottom'
		},
		clue_text = {
			weight: 'bold',
			family: 'Arial',
			size: Math.ceil(cell_size * 0.6) + 'px'
		};
	for (var y = 0; y < clues.horizontal.length; y++) {
		Crafty.e('2D, DOM, Text')
			.text(clues.horizontal[y].join(' '))
			.attr({ x: 0, y: board_y + (cell_size * y) + Math.ceil(cell_size * 0.2), w: board_x - 10, h: cell_size })
			.textFont(clue_text)
			.css(clue_css);
	}
	clue_css['text-align'] = 'center';
	for (var x = 0; x < clues.vertical.length; x++) {
		Crafty.e('2D, DOM, Text')
			.text(clues.vertical[x].join('<br>'))
			.attr({ x: board_x + (cell_size * x), y: board_y - (Math.ceil(cell_size * 0.7) * clues.vertical[x].length) - 5, w: cell_size })
			.textFont(clue_text)
			.css(clue_css);
	}

	// Events
	this.bind('BoardChanged', function(board) {
		var boardClues = translateCellsToClues(board._cells),
			success = clues.vertical.compare(boardClues.vertical) && clues.horizontal.compare(boardClues.horizontal);
		if (success) {
			Crafty.scene('Game'); // hard-reset, MOTHERFUCKER
		}
	});
}, function() {
	this.unbind('BoardChanged');
});

})();
