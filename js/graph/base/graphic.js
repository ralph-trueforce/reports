/**
 * Created by ralph on 11/18/16.
 */

/**
 * Super Class Graphic
 *
 * @param width
 * @param height
 * @constructor
 */
function Graphic(width, height) {
	this.name = '';
    this.width = width;
    this.height = height;
}

/**
 * Parent graphics configuration
 *
 * @param data
 * @param error
 */
Graphic.prototype.configure_base = function(data, error) {
	if (error) {
		console.log(error);
		throw error;
	}
	if (this.width === undefined) {
		this.width = data.width;
	}
	if (this.height === undefined) {
		this.height = data.height;
	}

	if (data.colors === undefined) {
		this.color = d3.scale.category20();
	} else {
		this.color = d3.scale.ordinal().range(data.colors);
	}

	this.config = data;

	localStorage[this.config_filename] = JSON.stringify(data);
};

/**
 * Virtual function configure
 * @param data
 * @param error
 */
Graphic.prototype.configure = function(data, error) {};

/**
 * Virtual function process
 * @param tag_id
 */
Graphic.prototype.process = function(tag_id) {};

/**
 * Draw, called by the children classes instances
 * @param tag_id
 */
Graphic.prototype.draw = function(tag_id) {
	var _this = this;
	this.config_filename = this.name + '.config';
	this.id = tag_id.replace("#", "");

	if (localStorage[this.config_filename] === undefined) {
		//Asynchronous json reading
		d3.json("config/" + this.config_filename + ".json", function (error, data) {
			_this.configure(data, error);
			_this.process(tag_id);
		});
	} else {
		this.configure(JSON.parse(localStorage[this.config_filename]), null);
		this.process(tag_id);
	}
};

/**
 * Update the graphic reading again from config file.
 * @param tag_id
 */
Graphic.prototype.update = function(tag_id) {
	this.config_filename = this.name + '.config';
	localStorage.removeItem(this.config_filename);

	this.draw(tag_id);
};

/**
 * Returns the default 'html' content.
 * @returns {string}
 */
Graphic.prototype.getFooter = function() {
	return '';
};
