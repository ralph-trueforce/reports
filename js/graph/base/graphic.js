/**
 * Created by ralph on 11/18/16.
 */

/**
 * Super Class Graphic
 *
 * @param width
 * @param height
 * @param arguments
 * @constructor
 */
function Graphic(width, height, arguments) {
    this.width = width;
    this.height = height;
	this.name = arguments.callee.name.toLowerCase();
	this.source = 'data/' + this.name + '.json';
	this.config_filename = this.name + '.config';
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

	for (var key in data) {
		if (typeof key === 'undefined') {
			continue;
		}
		this[key] = data[key];
	}

	if (!data.source) {
		data.source = this.source;
	}

	if (!(this.config_filename in localStorage)) {
		localStorage[this.config_filename] = JSON.stringify(data);
	}
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
	this.id = tag_id.replace('#', '');

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

Graphic.prototype.drawing = function (error, data) {
	this.configure(data, error);
	this.process(this.id);
};

/**
 * Update the graphic reading again from config file.
 * @param tag_id
 */
Graphic.prototype.update = function(tag_id, $http) {
	//TODO: need to inject http to Graph parent class
	var request = {
		method: "POST",
		url: "http://localhost:3000/widget",
		dataType: 'json',
		data: {
			param: tag_id.replace('#',''),
			method: 'fetch_config'
		},
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	};

	var _this = this;

	$http(request).then(
		function(response, status, headers, config)	{
			try {
				localStorage[_this.config_filename] = JSON.stringify(response.data);
			} catch(e) {
				console.log(e);
				return;
			}
			_this.draw(tag_id);
		}
		,function(response, status, headers, config) {
			if (typeof localStorage['CONFIG_DASHBOARD'] !== 'undefined') {
				console.log('Error: could not retrieve config from server.');
			}
		}
	);
};

/**
 * Returns the default 'html' content.
 * @returns {string}
 */
Graphic.prototype.getFooter = function() {
	return '<span><a href="ts.autobox.com">ts.autobox.com</a></span>';
};

/**
 * Update the Data source {network or filepath}
 * @param path
 */
Graphic.prototype.setSource = function(path) {
	data = JSON.parse(localStorage[this.config_filename]);
	data.source = path;
	localStorage[this.config_filename] = JSON.stringify(data);
};

/**
 * Fetch to localStorage the current data from file.
 */
Graphic.prototype.fetchData = function() {
	var _this = this;
	if (!this.source) {
		this.source = 'data/' + this.name + '.json';
	}
	d3.json(this.source, function (error, data) {
		localStorage[_this.source] = JSON.stringify(data);
	});
};

/**
 * Set the correct data before draw.
 *
 * @param error
 * @param data
 * @returns {*}
 */
Graphic.prototype.preData = function(error, data) {
	if (error) {
		throw error;
	}
	localStorage[this.source] = JSON.stringify(data);

	if (typeof localStorage[this.id + 'data'] !== 'undefined') {
		data = JSON.parse(localStorage[this.id + 'data']);
	}

	return data;
};
