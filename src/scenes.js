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

	// Events
	this.bind('BoardChanged', function(board) {
		console.log('BoardChanged', board._cells);
	});
}, function() {
	this.unbind('BoardChanged');
});

})();
