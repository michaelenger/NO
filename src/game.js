(function() {
"use strict";

/**
 * Game - Main game object which handles starting the game as well as some config info.
 */
var Game = {
	/**
	 * Start the game.
	 */
	start: function() {
		Crafty.mobile = false; // prevent Crafty from taking up the whole viewport
		Crafty.init(800, 600);
		Crafty.background('#f0f3f7');
		Crafty.scene('Loading');
	}

}

// Start the game
if (window) {
	window.addEventListener('load', Game.start);
}

})();
