(function() {
"use strict";

/**
 * Loading Scene - Loads assets.
 */
Crafty.scene('Loading', function() {
	Crafty.e('2D, DOM, Text')
		.text('Loading')
		.attr({ x: 0, y: Crafty.viewport.height * 0.35, w: Crafty.viewport.width, h: 60 })
		.textFont({
			weight: 'bold',
			family: 'Arial',
			size: '60px'
		}).css({ color: 'rgba(50,50,50,0.1)', 'text-align': 'center' });
	Crafty.load(['assets/clue.png', 'assets/arrows.png', 'assets/example_1.png', 'assets/example_2.png', 'assets/example_3.png'], function() {
		Crafty.sprite(30, 'assets/clue.png', {
			sprite_clue: [0, 0]
		});
		Crafty.sprite(32, 'assets/arrows.png', {
			sprite_arrow_left: [0, 0],
			sprite_arrow_right: [1, 0],
			sprite_arrow_left_hover: [0, 1],
			sprite_arrow_right_hover: [1, 1]
		});

		Crafty.scene('Menu');
	});
});

/**
 * Menu Scene - Lets the user choose the size of the map.
 */
Crafty.scene('Menu', function() {
	var board_size = Game.config.board_size,
		board_width = Math.ceil((Crafty.viewport.width < Crafty.viewport.height ? Crafty.viewport.width : Crafty.viewport.height) * 0.35),
		board_height = board_width,
		board_x = Math.ceil((Crafty.viewport.width - board_width) / 2),
		board_y = Math.ceil(Crafty.viewport.height * 0.5 - (board_height / 2));

	var board = Crafty.e('Board, Tween')
		.attr({ x: board_x, y: board_y, w: board_width, h: board_height })
		.board(board_size);
	board._active = false;

	// Puzzle size
	var sizes = {
		3: 'Tiny',
		4: 'Smaller',
		5: 'Small',
		6: 'Normal',
		7: 'Big',
		8: 'Bigger',
		9: 'Huge',
		10: 'Gigantic'
	};
	var puzzle_size = Crafty.e('2D, DOM, Text')
		.text(sizes[board_size])
		.attr({ x: 0, y: board_y + board_height + 15, w: Crafty.viewport.width })
		.textFont({
			family: 'Arial',
			weight: 'bold',
			size: '16px'
		})
		.css({
			color: '#999',
			'text-align': 'center',
			'text-transform': 'uppercase'
		});

	// Header
	var h1 = Crafty.e('2D, DOM, Text')
		.text('NO')
		.attr({ x: 0, y: 10, w: Crafty.viewport.width })
		.textFont({
			family: 'Arial',
			weight: 'bold',
			size: (Crafty.viewport.width * 0.1) + 'px'
		})
		.css({
			'text-align': 'center',
		});
	Crafty.e('2D, DOM, Text')
		.text('A Game of Numbers')
		.attr({ x: 0, y: (Crafty.viewport.width * 0.1) + 20, w: Crafty.viewport.width })
		.textFont({
			family: 'Arial',
			weight: 'bold',
			size: (Crafty.viewport.width * 0.025) + 'px'
		})
		.css({
			'color': 'rgb(125,198,250)',
			'text-align': 'center',
		});

	// Previous & Next
	Crafty.e('SpriteButton')
		.button('sprite_arrow_left', 'sprite_arrow_left_hover', board_x - 48, board_y + (board_height / 2) - 12)
		.bind('ButtonClicked', changeBoardSize);
	Crafty.e('SpriteButton')
		.button('sprite_arrow_right', 'sprite_arrow_right_hover', board_x + board_width + 16, board_y + (board_height / 2) - 12)
		.bind('ButtonClicked', changeBoardSize);

	function changeBoardSize(button) {
		var direction = button._sprite_normal == "sprite_arrow_right" ? 1 : -1,
			new_board_size = board_size + direction;
		if (new_board_size >= 3 && new_board_size <= 10) {
			board_size = new_board_size;
			puzzle_size.text(sizes[board_size]);
			var next_board = Crafty.e('Board, Tween')
					.attr({ x: board.x + (100 * direction), y: board.y, w: board_width, h: board_height, aplha: 0 })
					.board(board_size);
				next_board._active = false;
				board.tween({ x: board.x - (100 * direction), alpha: 0 }, 100)
					.bind("TweenEnd", function(){
						board.destroy();
						board = next_board
					});
				next_board.tween({ x: board.x, alpha: 1 }, 100);
		}
	}

	// Start
	Crafty.e('TextButton')
		.button('Start Game', Crafty.viewport.width / 2, Crafty.viewport.height * 0.82)
		.bind('ButtonClicked', function() {
			Game.config.board_size = board_size;
			Crafty.scene('Game');
		});

	// Instructions
	Crafty.e('TextButton')
		.button('Instructions', Crafty.viewport.width / 2, Crafty.viewport.height * 0.82 + 50)
		.bind('ButtonClicked', function() {
			Game.config.board_size = board_size;
			Crafty.scene('Instructions');
		});
});

/**
 * Instructions Scene - Shows how to play the game.
 */
Crafty.scene('Instructions', function() {

	// Pages
	var current_page = 0,
		pages = [
		Crafty.e("HTML")
			.attr({ x:0, y:0, w:Crafty.viewport.width, h:Crafty.viewport.height })
			.replace('<div class="instructions"><h3>How to Play</h3>\
			<p>\
				This game is a basic interpretation of a <a href="http://en.wikipedia.org/wiki/Nonogram">Nonogram</a>, where you fill in a pattern on a grid based on the numbers surrounding it.\
			</p>\
			<p>\
				The numbers on the sides are clues to which grid cells need to be filled in. The number denotes the amount of <em>connected cells</em> which are filled in and in the cases where there is more than one number, it means that there are several groups of cells with one (or more) empty spaces between them.\
				<img src="assets/example_1.png" alt="">\
			</p>'),
		Crafty.e("HTML")
			.attr({ x:0, y:0, w:Crafty.viewport.width, h:Crafty.viewport.height })
			.replace('<div class="instructions"><h3>How to Play</h3>\
			<p>\
				The filled in cells don\'t have to be separated by a single empty space, nor do they have to hug the sides.\
				<img src="assets/example_2.png" alt="">\
			</p>'),
		Crafty.e("HTML")
			.attr({ x:0, y:0, w:Crafty.viewport.width, h:Crafty.viewport.height })
			.replace('<div class="instructions"><h3>How to Play</h3>\
			<p>\
				Use the <strong>not-filled hint</strong> to put down clues on which cells shouldn\'t be filled in. This really helps on larger boards.\
				<img src="assets/example_3.png" alt="">\
			</p>'),
		Crafty.e("HTML")
			.attr({ x:0, y:0, w:Crafty.viewport.width, h:Crafty.viewport.height })
			.replace('<div class="instructions"><h3>Controls</h3>\
			<p>\
				<strong>Left mouse button</strong> - Toggle a grid cell<br>\
				<strong>Right mouse button</strong> - Place a clue to flag cells as not-filled\
			</p>')
	];
	function togglePageVisibility() {
		for (var i = 0; i < pages.length; i++) {
			pages[i].visible = i == current_page;
		}
	}
	togglePageVisibility();

	// Previous & Next
	Crafty.e('SpriteButton')
		.button('sprite_arrow_left', 'sprite_arrow_left_hover', 10, Crafty.viewport.height - 48)
		.bind('ButtonClicked', function() {
			if (current_page != 0) {
				current_page--;
				togglePageVisibility();
			}
		});
	Crafty.e('SpriteButton')
		.button('sprite_arrow_right', 'sprite_arrow_right_hover', Crafty.viewport.width - 48, Crafty.viewport.height - 48)
		.bind('ButtonClicked', function() {
			if (current_page != pages.length - 1) {
				current_page++;
				togglePageVisibility();
			}
		});

	// Back
	Crafty.e('TextButton')
		.button('BACK', Crafty.viewport.width - 48, 24)
		.textFont({
			size: '24px'
		})
		.bind('ButtonClicked', function() {
			Crafty.scene('Menu');
		});
});

/**
 * Game Scene - Where the action is ;)
 */
Crafty.scene('Game', function() {
	var board_width = Math.ceil((Crafty.viewport.width < Crafty.viewport.height ? Crafty.viewport.width : Crafty.viewport.height) * 0.6),
		board_height = board_width,
		board_x = Math.ceil((Crafty.viewport.width - board_width) / 2),
		board_y = Math.ceil((Crafty.viewport.height - board_height) * 0.8),
		puzzle = new Array(Game.config.board_size),
		clues = undefined,
		start_time = new Date();

	// Puzzle
	for (var x = 0; x < puzzle.length; x++) {
		puzzle[x] = new Array(Game.config.board_size);
		for (var y = 0; y < puzzle[x].length; y++) {
			puzzle[x][y] = Math.round(Math.random());
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
		.board(Game.config.board_size);

	// Clues
	var cell_size = Math.ceil(board_height / Game.config.board_size),
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

	Crafty.e('TextButton')
		.button('BACK', Crafty.viewport.width - 48, 24)
		.textFont({
			size: '24px'
		})
		.bind('ButtonClicked', function() {
			Crafty.scene('Menu');
		});

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
				.attr({ x: 0, y: 0, w: Crafty.viewport.width, h: Crafty.viewport.height, alpha: 0 })
				.color('#f0f3f7')
				.tween({alpha: 0.95 }, 200)
				.bind('TweenEnd', function() {
					Crafty.e('2D, DOM, Text')
						.text('Congratulations!')
						.attr({ x: 0, y: Crafty.viewport.width * 0.15, w: Crafty.viewport.width, h: 60 })
						.textFont({
							weight: 'bold',
							family: 'Arial',
							size: '60px'
						}).css({ color: '#444', 'text-align': 'center' });
					Crafty.e('2D, DOM, Text')
						.text('You completed the puzzle in <span style="color:rgb(125,198,250)">' + time_taken + '</span>!')
						.attr({ x: 0, y: Crafty.viewport.width * 0.15 + 80, w: Crafty.viewport.width, h: 20 })
						.textFont({
							weight: 'bold',
							family: 'Arial',
							size: '20px'
						}).css({ color: '#666', 'text-align': 'center' });
					Crafty.e('TextButton')
						.button('Play Again', Crafty.viewport.width / 2, Crafty.viewport.height * 0.7)
						.bind('ButtonClicked', function() {
							Crafty.scene('Game');
						});
					Crafty.e('TextButton')
						.button('Back', Crafty.viewport.width / 2, Crafty.viewport.height * 0.7 + 60)
						.bind('ButtonClicked', function() {
							Crafty.scene('Menu');
						});
				});
		}
	});
}, function() {
	this.unbind('BoardChanged');
});

})();
