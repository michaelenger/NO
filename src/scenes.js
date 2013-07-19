(function() {
"use strict";

/**
 * Game Scene - Where the action is ;)
 */
Crafty.scene('Game', function() {
	var board_width = Math.ceil((Game.config.width < Game.config.height ? Game.config.width : Game.config.height) * 0.8),
		board_height = board_width,
		board_x = Math.ceil((Game.config.width - board_width) / 2),
		board_y = Math.ceil((Game.config.height - board_height) / 2);

	Crafty.e('Board')
		.attr({ x: board_x, y: board_y, w: board_width, h: board_height })
		.board(6);
});

})();
