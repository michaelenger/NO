"use strict";
define(['lib/pixi'], function(PIXI) {

	/**
	 * Button - Pressable sprite.
	 */
	var Button = function(text, size) {
		PIXI.Text.call(this, text, {
			font: "bold " + size + "px Arial",
			fill: "#fff",
			align: "center"
		});
		PIXI.EventTarget.call(this);

		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.tint = 0x757778;
		this.interactive = true;

		this.mouseover = this.onMouseOver;
		this.mouseout = this.onMouseOut;
		this.mousedown = this.touchstart = this.onClicked;
	};

	Button.prototype = Object.create(PIXI.Text.prototype);
	Button.prototype.constructor = Button;

	/**
	 * On mouse clicked event.
	 */
	Button.prototype.onClicked = function(data) {
		this.dispatchEvent(new CustomEvent("clicked"));
	};

	/**
	 * On mouse out event.
	 */
	Button.prototype.onMouseOut = function(data) {
		this.tint = 0x757778;
	};

	/**
	 * On mouse over event.
	 */
	Button.prototype.onMouseOver = function(data) {
		this.tint = 0x3fc1f5;
	};

	return Button;

});
