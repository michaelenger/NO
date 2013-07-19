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
		var element = document.getElementById('cr-stage');
		Crafty.init(800, 600);
		Crafty.background('rgb(255,13,158)');
	}

}

// Start the game
if (window) {
	window.addEventListener('load', Game.start);
}

})();
