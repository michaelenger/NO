(function() {
"use strict";

/**
 * Game - Main game object which handles starting the game as well as some config info.
 */
var Game = {

	/**
	 * Game configuration.
	 *
	 * @var object
	 */
	config: {
		board_size: 6,
		width: 800,
		height: 600
	},

	/**
	 * Start the game.
	 */
	start: function() {
		Crafty.mobile = false; // prevent Crafty from taking up the whole viewport
		Crafty.init(Game.config.width, Game.config.height);
		Crafty.background('#f0f3f7');
		Crafty.scene('Loading');
	}

}

// Start the game
if (window) {
	window.addEventListener('load', Game.start);
	window.Game = Game; // expose the game to the other scripts
}

})();
