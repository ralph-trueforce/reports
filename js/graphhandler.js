/**
 * Class GraphHandler
 *
 * @constructor
 */
function GraphHandler () {

	var config_graph = {
		"Options": {
		},
		"classes": [],
		"sources": [/*TODO: complete lists automatically, take a while, like parsing all the json*/
			[{'name':'Bar','path': 'data/bar.json'}, {'name':'Donut', 'path':'data/donut.json'}, {'name':'Funel', 'path':'data/funel.json'}, {'name':'Pie', 'path':'data/pie.json'}],
			[]
		]
	};

	$("script.graph").each(function() {
		var src = $(this).attr("src");
		var filename = getSrcFile(src);
		filename = filename.replace('.js', '');
		filename = toTitleCase(filename);
		config_graph.classes.push(filename);
	});

	function getSrcFile (src) {
		var position = src.lastIndexOf('/') + 1;
		return src.substring(position);
	}

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	this.clear = function() {
		config_graph.classes.forEach(function (_class) {
			localStorage.removeItem(_class + '_index');
		});
		//TODO: remove hardcoded
		localStorage.removeItem('Html_index');
		//localStorage.clear();
	};

	this.createButtons = function() {
		config_graph.classes.forEach(function (_class) {
			var newAnchor = document.createElement('a');
			newAnchor.setAttribute('class', 'pull-right btn btn-primary');
			newAnchor.setAttribute('ng-click', 'addWidget(\'' + _class + '\')');
			newAnchor.innerHTML = "<i class=\"glyphicon glyphicon-plus\"></i> Add " + _class;
			var target = document.getElementById('ph_buttons');
			//target.appendChild(newAnchor);
			target.insertBefore(newAnchor, target.firstChild);
		});
	};

	this.createGraphButtons = function() {
		var htmlContent = '';
		config_graph.classes.forEach(function (_class) {
			htmlContent += "<a class=\"pull-right btn btn-primary\" ng-click=\"addWidget('" + _class + "')\"><i class=\"glyphicon glyphicon-plus\"></i> Add " + _class + "</a>";
		});

		return htmlContent;
	};

	this.getClassesNames = function() {
		return config_graph.classes;
	};

	this.getSourceNames = function(type) {
		return config_graph.sources[type];
	};

	this.doesBelongToSourceGroup = function(type) {
		for (var group = 0; group < config_graph.sources.length; group++){
			for (var item = 0; item < config_graph.sources[group].length; item++) {
				if (config_graph.sources[group][item].name == type) {
					return group;
				}
			}
		}

		return false;
	}
}
