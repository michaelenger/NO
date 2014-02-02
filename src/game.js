"use strict";
(function() {

	/**
	 * NO - A game of numbers.
	 */
	var Game = function(element) {
		this.stage = new PIXI.Stage(0xf0f3f7);
		this.renderer = PIXI.autoDetectRenderer(element.clientWidth, element.clientHeight);
		element.appendChild(this.renderer.view);
		requestAnimFrame(this.draw.bind(this));
	};

	/**
	 * Render the stage.
	 */
	Game.prototype.draw = function() {
		this.renderer.render(this.stage);
		requestAnimFrame(this.draw.bind(this));
	};

	// Start the game
	window.onload = function() {
		var game = document.getElementById("game");
		new Game(game); // let's go
	}

})();
