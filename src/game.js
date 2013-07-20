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
		width: 800,
		height: 600
	},

	/**
	 * Start the game.
	 */
	start: function() {
		var element = document.getElementById('cr-stage');
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
