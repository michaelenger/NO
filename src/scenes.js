(function() {
"use strict";

/**
 * Game Scene - Where the action is ;)
 */
Crafty.scene('Game', function() {

	// Game board
	var board_size = 6, // @todo: set this in a menu somewhere
		board_width = Math.ceil((Game.config.width < Game.config.height ? Game.config.width : Game.config.height) * 0.8),
		board_height = board_width,
		board_x = Math.ceil((Game.config.width - board_width) / 2),
		board_y = Math.ceil((Game.config.height - board_height) / 2);

	Crafty.e('Board')
		.attr({ x: board_x, y: board_y, w: board_width, h: board_height })
		.board(board_size);

	// Selected cells
	var cells = new Array(board_size);
	for (var x = 0; x < cells.length; x++) {
		cells[x] = new Array(board_size);
		for (var y = 0; y < cells[x].length; y++) {
			cells[x][y] = false;
		}
	}

	// Events
	this.bind('BoardCellClicked', function(e) {
		console.log('Board cell clicked: ' + e.x + 'x' + e.y);
	});
}, function() {
	this.unbind('BoardCellClicked');
});

})();
