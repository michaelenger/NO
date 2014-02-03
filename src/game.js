"use strict";
requirejs.config({
	baseUrl: 'src',
	paths: {
		lib: '../lib/'
	}
});

require(['lib/pixi', 'Board'], function(PIXI, Board) {

	/**
	 * NO - A game of numbers.
	 */
	var Game = function(element) {
		var width = element.clientWidth,
			height = element.clientHeight;

		// Set the stage
		this.stage = new PIXI.Stage(0xf0f3f7);
		this.renderer = PIXI.autoDetectRenderer(width, height);
		element.appendChild(this.renderer.view);

		// Setup the board
		this.board = new Board(width / 2, height * 0.6, height * 0.6, 6);
		this.stage.addChild(this.board);

		// Draw
		this.draw();
	};

	/**
	 * Render the stage.
	 */
	Game.prototype.draw = function() {
		this.renderer.render(this.stage);
		requestAnimFrame(this.draw.bind(this));
	};

	// Let's go!
	var game = document.getElementById("game");
	new Game(game); // let's go

});
