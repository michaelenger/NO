(function() {
"use strict";

/**
 * Game Scene - Where the action is ;)
 */
Crafty.scene('Game', function() {
	var board_size = 6, // @todo: set this in a menu somewhere
		board_width = Math.ceil((Game.config.width < Game.config.height ? Game.config.width : Game.config.height) * 0.8),
		board_height = board_width,
		board_x = Math.ceil((Game.config.width - board_width) / 2),
		board_y = Math.ceil((Game.config.height - board_height) / 2),
		puzzle = new Array(board_size);

	// Puzzle
	for (var x = 0; x < puzzle.length; x++) {
		puzzle[x] = new Array(board_size);
		for (var y = 0; y < puzzle[x].length; y++) {
			puzzle[x][y] = Math.round(Math.random()) == 1 ? true : false;
		}
	}

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

	// Events
	this.bind('BoardChanged', function(board) {
		var success = true;
		for (var x = 0; x < puzzle.length; x++) {
			for (var y = 0; y < puzzle[x].length; y++) {
				if (puzzle[x][y] !== board._cells[x][y]) {
					success = false;
					break;
				}
			}
			if (!success) {
				break;
			}
		}
		console.log('BoardChanged', success);
	});
}, function() {
	this.unbind('BoardChanged');
});

})();
