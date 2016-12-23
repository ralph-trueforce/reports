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
	//data template
	this.source = 'data/' + this.name + '.json';
	//config template
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
};

/**
 * Virtual function configure
 *
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
 *
 * @param tag_id
 */
Graphic.prototype.draw = function(tag_id) {
	var _this = this;
	this.id = tag_id.replace('#', '');

	if (localStorage[this.id + '.config'] === undefined) {
	//if (localStorage[this.config_filename] === undefined) {
		//Asynchronous json reading
		d3.json("config/" + this.config_filename + ".json", function (error, data) {
			_this.configure(data, error);
			_this.process(tag_id);
			_this.saveConfig(data);
			_this.saveConfigTemplate(data);
		});
	} else {
		data = JSON.parse(localStorage[this.id + '.config']);
		//data = JSON.parse(localStorage[this.config_filename]);
		this.configure(data, null);
		this.process(tag_id);
		this.saveConfig(data);
	}
};

Graphic.prototype.drawing = function (error, data) {
	this.configure(data, error);
	this.process(this.id);
};

/**
 * Update the graphic reading again from config file.
 *
 * @param tag_id
 */
Graphic.prototype.update = function(tag_id, $http) {
	//TODO: need to inject http to Graph parent class
	var ID = tag_id.replace('#', '');
	var request = {
		method: "POST",
		url: "http://localhost:3000/widget",
		dataType: 'json',
		data: {
			param: ID,
			method: 'fetch_config'
		},
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	};

	var _this = this;

	$http(request).then(
		function(response, status, headers, config)	{
			try {
				localStorage[ID + '.config'] = JSON.stringify(response.data);
				//localStorage[_this.config_filename] = JSON.stringify(response.data);
			} catch(e) {
				console.log(e);
				return;
			}
			_this.draw(tag_id);
		}
		,function(response, status, headers, config) {
			_this.draw(tag_id);
		}
	);
};

/**
 * Returns the default 'html' content.
 *
 * @returns {string}
 */
Graphic.prototype.getFooter = function() {
	return '<span><a href="ts.autobox.com">ts.autobox.com</a></span>';
};

/**
 * Update the Data source {network or filepath}
 *
 * @param source_path
 */
Graphic.prototype.setSource = function(source_path) {
	data = JSON.parse(localStorage[this.id + '.config']);
	//data = JSON.parse(localStorage[this.config_filename]);
	data.source = source_path;
	localStorage[this.id + '.config'] = JSON.stringify(data);
	//localStorage[this.config_filename] = JSON.stringify(data);
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
 *
 * @returns {*}
 */
Graphic.prototype.preData = function(error, data) {
	if (error) {
		throw error;
	}
	//localStorage[this.source] = JSON.stringify(data);
	localStorage[this.id + 'data'] = JSON.stringify(data);

	if (typeof localStorage[this.id + 'data'] !== 'undefined') {
		data = JSON.parse(localStorage[this.id + 'data']);
	}

	return data;
};

/**
 * Set the ID of the current element
 *
 * @param tag_id
 */
Graphic.prototype.setID = function(tag_id) {
	if (tag_id) {
		this.id = tag_id.replace('#', '');
	}
};

/**
 * Save template into cache
 * @param data
 */
Graphic.prototype.saveConfigTemplate = function(data) {
	if (!(this.config_filename in localStorage)) {
		localStorage[this.config_filename] = JSON.stringify(data);
	}
};

/**
 * Save into cache
 * @param data
 */
Graphic.prototype.saveConfig = function(data) {
	if (!((this.id + '.config') in localStorage)) {
		localStorage[this.id + '.config'] = JSON.stringify(data);
	}
};

/**
 * Get template from cache
 */
Graphic.prototype.getTemplateConfiguration = function() {
	obj = JSON.parse(localStorage[this.config_filename]);
	return JSON.stringify(obj, null, 4);
};

/**
 * Get from cache
 * @param id
 */
Graphic.prototype.getConfiguration = function(id) {
	obj = JSON.parse(localStorage[id + '.config']);
	return JSON.stringify(obj, null, 4);
};

/**
 * Get from cache
 * @param id
 */
Graphic.prototype.getData = function(id) {
	obj = JSON.parse((localStorage[id + 'data'])?localStorage[id + 'data']:localStorage[this.source]);
	return JSON.stringify(obj, null, 4);
};
