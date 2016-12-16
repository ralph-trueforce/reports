/**
 * Created by ralph on 11/18/16.
 */

/**
 * Super Class Round
 *
 * @param width
 * @param height
 * @param arguments
 * @constructor
 */
function Round(width, height, arguments) {
	this.base = Graphic;
	this.base(width, height, arguments); //call super constructor.
	//this.name = arguments.callee.name.toLowerCase();

    this.radius = Math.min(width, height) / 2;

	/**
	 * Configure data for Circular type graphics
	 * @param data
	 * @param error
	 */
	this.configure = function(data, error) {

		this.configure_base(data, error);

		if (this.radius === undefined) {
			this.radius = Math.min(this.width, this.height) / 2;
		}

		// this.svg = d3.select(this.id)
		// 	.append("svg")
		// 	.attr("width", this.width)
		// 	.attr("height", this.height)
		// 	.append("g")
		// 	.attr("transform", "translate(" + this.width / 2 + "," + this.width / 2 + ")");

	};

}

Round.prototype = Object.create(Graphic.prototype);
