/**
 * Created by ralph on 11/18/16.
 */

/**
 * Super Class Cartesian
 *
 * @param width
 * @param height
 * @constructor
 */
function Cartesian(width, height, arguments) {
	this.base = Graphic;
	this.base(width, height, arguments); //call super constructor.
	//this.name = arguments.callee.name.toLowerCase();

	/**
	 * Configure the data for cartesians graphics
	 * @param data
	 * @param error
	 */
	this.configure = function(data, error) {

		this.configure_base(data, error);

		this.margin = (typeof data.margins !== 'undefined') ? data.margins : null;

		// this.svg = d3.select(this.id)
		// 	.append("svg")
		// 	.attr("width", this.width)
		// 	.attr("height", this.height)
		// 	.append("g");
	};

}

Cartesian.prototype = Object.create(Graphic.prototype);
