(function() {
"use strict";

/**
 * Loading Scene - Loads assets.
 */
Crafty.scene('Loading', function() {
	Crafty.e('2D, DOM, Text')
		.text('Loading')
		.attr({ x: 0, y: Game.config.height * 0.35, w: Game.config.width, h: 60 })
		.textFont({
			weight: 'bold',
			family: 'Arial',
			size: '60px'
		}).css({ color: 'rgba(50,50,50,0.1)', 'text-align': 'center' });

	Crafty.load(['assets/clue.png'], function() {
		Crafty.sprite(30, 'assets/clue.png', {
			sprite_clue: [0, 0]
		});

		Crafty.scene('Game');
	});
});

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
		clues = undefined,
		start_time = new Date();

	// Puzzle
	for (var x = 0; x < puzzle.length; x++) {
		puzzle[x] = new Array(board_size);
		for (var y = 0; y < puzzle[x].length; y++) {
			puzzle[x][y] = Math.round(Math.random() * 5) < 2 ? 0 : 1; // 3/5 chance of getting a filled-in cell
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
				if (cells[x][y] === 1) {
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
	var board = Crafty.e('Board')
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
			var end_time = new Date(),
				time_taken = (end_time - start_time) / 1000;
			board._active = false;

			if (time_taken > 60) {
				var min = Math.floor(time_taken / 60),
					sec = time_taken - (min * 60);
				time_taken = min + ' minutes ' + Math.round(sec * 100) / 100 + ' seconds';
			} else {
				time_taken = Math.round(time_taken * 100) / 100 + ' seconds';
			}

			// End game overlay
			var overlay = Crafty.e('2D, DOM, Color, Tween')
				.attr({ x: 0, y: 0, w: Game.config.width, h: Game.config.height, alpha: 0 })
				.color('#f0f3f7')
				.tween({alpha: 0.95 }, 15)
				.bind('TweenEnd', function() {
					Crafty.e('2D, DOM, Text')
						.text('Congratulations!')
						.attr({ x: 0, y: Game.config.width * 0.15, w: Game.config.width, h: 60 })
						.textFont({
							weight: 'bold',
							family: 'Arial',
							size: '60px'
						}).css({ color: '#444', 'text-align': 'center' });
					Crafty.e('2D, DOM, Text')
						.text('You completed the level in <span style="color:rgb(125,198,250)">' + time_taken + '</span>!')
						.attr({ x: 0, y: Game.config.width * 0.15 + 80, w: Game.config.width, h: 20 })
						.textFont({
							weight: 'bold',
							family: 'Arial',
							size: '20px'
						}).css({ color: '#666', 'text-align': 'center' });
					Crafty.e('TextButton')
						.button('Play Again', Game.config.width / 2, Game.config.height * 0.8)
						.bind('ButtonClicked', function() {
							Crafty.scene('Game');
						});
				});
		}
	});
}, function() {
	this.unbind('BoardChanged');
});

})();
