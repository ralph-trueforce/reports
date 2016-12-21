var editorConfig;
var editorData;
var settingsUp = false;
//TODO move the Factory method for graphs into a class
angular.module('app')

.directive('drawGraph', function() {
	return {
		link: function( scope, element, attrs ) {

			/**
			 * Called after a widget is loaded
			 */
			element.ready(function() {
				updateGraph();
			});

			/**
			 * Work-around: Check if the id has a angular model variable
			 * @param string
			 * @returns {boolean}
			 */
			function isAngularModelVar(string) {
				return (string.indexOf("{{") !== -1 && string.indexOf("}}") !== -1);
			}

			/**
			 * Update the graph, by getting the div ID, then clearing the target Div and render inside it.
			 */
			function updateGraph(object) {
				if (settingsUp == true) {
					return;
				}
				//console.log(object.targetScope.gridsterItem);
				//console.log(element[0]);
				element.css('height', (element[0].parentElement.clientHeight - 100) + 'px');
				var ID = element[0].id;
				if (isNaN(ID) && !isAngularModelVar(ID)) {
					var _Class = document.getElementById(ID);
					if (_Class == null || !_Class) {
						_Class = attrs.alt;
					} else {
						_Class = _Class.getAttribute('alt');
					}
					if (_Class == 'Html') {
						return;
					}
					angular.element(document.querySelector("#" + ID)).empty();
					WidgetCache.setWidth(ID, element[0].clientWidth);
					WidgetCache.setHeight(ID, element[0].clientHeight);
					eval("var graph = new " + _Class + "(" + element[0].clientWidth + ", " + (element[0].clientHeight) + ");");
					graph.draw("#" + ID);
				}
			}

			scope.$on('gridster-item-resized',        updateGraph);
			scope.$on('gridster-item-transition-end', updateGraph);
			scope.$on('gridster-resized',             updateGraph);
			scope.$on('gridster-resizable-changed',   updateGraph);
			scope.$on('gridster-item-initialized',    updateGraph);
		}
	};
})

.directive('widgetHtml', function() {
	return {
		restrict: 'E',
		replace: 'true',
		scope: {
			text: '@'
		},
		template: '<span><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt risus luctus lobortis vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris bibendum leo a congue mattis. In blandit finibus nibh. Etiam tincidunt volutpat mollis. Integer dolor purus, ullamcorper nec purus et, semper interdum ligula. Curabitur magna mauris, feugiat sit amet convallis sagittis, pellentesque eget erat. Proin non laoreet elit. Vivamus posuere orci quis dolor rutrum ornare. Etiam convallis efficitur nulla eu scelerisque. Pellentesque congue accumsan turpis sit amet rutrum.</p><p>Aliquam vel massa tempor turpis auctor accumsan. Praesent et lacinia orci. Nulla dignissim quis ligula non fermentum. Pellentesque dictum mollis posuere. Sed congue eros eget euismod ornare. Integer id venenatis metus. Donec porttitor tincidunt lectus sed facilisis. Etiam condimentum, nulla et faucibus luctus, quam mi mollis metus, finibus tempor massa nisl at nisi. Suspendisse sodales pulvinar urna sodales maximus. Phasellus egestas quam ex, sed blandit eros finibus aliquam. Ut nec tellus rhoncus, tempor magna sed, volutpat ipsum.</p></span>'
	};
})

.directive ('widgetFooter', ['$sce', function($sce) {
	return {
		scope: {
			type: "@type"
		},
		link: function (scope, element, attr) {

			function appendFooter() {
				//TODO: workaround remove the html alone
				if (attr.type == 'Html') {
					return;
				}

				eval("var graph = new " + attr.type + "(0,0);");
				htmlText = graph.getFooter();
				var html_contents = "<div class=\"box-link\">" + $sce.trustAsHtml(htmlText) + "</div>";

				scope.$watch('widgetFooter', function () {
						element.append(html_contents);
					}
				);
			}
			appendFooter();
			//TODO: update footer if the graph type has changed.
			//scope.$on('gridster-resized', appendFooter);
		}
	}
}])

.controller('DashboardCtrl', ['$scope', '$timeout', '$sce', '$http', '$window',
	function($scope, $timeout, $sce, $http, $window) {

		$scope.getRandom = function(min, max) {
			return Math.random() * (max - min) + min;
		};

		$scope.graphics = (new GraphHandler()).getClassesNames();

		$scope.gridsterOptions = {
			margins: [20, 20],
			columns: 6,
			draggable: {
				handle: 'h3'
			}
		};

		$scope.loadDashboard = function() {
			//Get data from DB
			//TODO: move the requests to a class to handle then more easier
			var request = {
				method: "POST",
				url: "http://localhost:3000/dashboard",
				dataType: 'json',
				data: {
					method: 'fetch'
				},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			$http(request).then(
				function(response, status, headers, config)	{
					CONFIG_DASHBOARD[1].widgets = response.data;
					$scope.loadDashboard = CONFIG_DASHBOARD;
				}
				,function(response, status, headers, config) {
					if (typeof localStorage['CONFIG_DASHBOARD'] !== 'undefined') {
						console.log(localStorage['CONFIG_DASHBOARD']);
						//CONFIG_DASHBOARD = localStorage['CONFIG_DASHBOARD'];
						//$scope.loadDashboard = CONFIG_DASHBOARD;
					}
				}
			);

			return CONFIG_DASHBOARD;
		};

		$scope.dashboards = $scope.loadDashboard();

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};


		$scope.addWidget = function(type) {
			var hasher1 = new jsSHA('SHA-1', 'BYTES');
			hasher1.update($scope.getRandom(1, 1000000).toString());
			var widgetIndex = hasher1.getHash('HEX');
			widgetIndex = "a" + widgetIndex;

			var html_text;
			/*if (type == 'Html') {
				html_text = $sce.trustAsHtml("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt risus luctus lobortis vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris bibendum leo a congue mattis. In blandit finibus nibh. Etiam tincidunt volutpat mollis. Integer dolor purus, ullamcorper nec purus et, semper interdum ligula. Curabitur magna mauris, feugiat sit amet convallis sagittis, pellentesque eget erat. Proin non laoreet elit. Vivamus posuere orci quis dolor rutrum ornare. Etiam convallis efficitur nulla eu scelerisque. Pellentesque congue accumsan turpis sit amet rutrum.</p><p>Aliquam vel massa tempor turpis auctor accumsan. Praesent et lacinia orci. Nulla dignissim quis ligula non fermentum. Pellentesque dictum mollis posuere. Sed congue eros eget euismod ornare. Integer id venenatis metus. Donec porttitor tincidunt lectus sed facilisis. Etiam condimentum, nulla et faucibus luctus, quam mi mollis metus, finibus tempor massa nisl at nisi. Suspendisse sodales pulvinar urna sodales maximus. Phasellus egestas quam ex, sed blandit eros finibus aliquam. Ut nec tellus rhoncus, tempor magna sed, volutpat ipsum.</p>");
			}*/

			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1,
				id: widgetIndex,
				text: html_text,
				type: type
			});
		};

		$scope.$watch('selectedDashboardId', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.dashboard = $scope.dashboards[newVal];
			} else {
				$scope.dashboard = $scope.dashboards[1];
			}
		});

		// init dashboard
		$scope.selectedDashboardId = '1';

		$scope.onExit = function() {
			//return ('"Do you really want to close?";');
		};

		$window.onbeforeunload =  $scope.onExit;

	}
])

.controller('CustomWidgetCtrl', ['$scope', '$modal', '$http', '$timeout',
	function($scope, $modal, $http, $timeout) {
		$scope.display = false;
		$scope.displaySource = false;
		$scope.belong_group = 0;

		$scope.remove = function(widget) {

			var request = {
				method: "POST",
				url: "http://localhost:3000/widget",
				dataType: 'json',
				data: {
					param: widget,
					method: 'remove'
				},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			$http(request)
				.then(function(response, status, headers, config)
					{
						$timeout(function() {
							window.alert(response.data.Result);
						});
					}
					,function(response, status, headers, config)
					{
						$timeout(function() {
							window.alert(response.data);
						});
					}
				);

			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			settingsUp = true;
			$modal.open({
				scope: $scope,
				templateUrl: 'demo/dashboard/widget_settings.html',
				controller: 'WidgetSettingsCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

		$scope.showMenu = function() {
			$scope.display =!$scope.display;
		};

		$scope.showSourceList = function(widget) {
			$scope.belong_group = (new GraphHandler()).doesBelongToSourceGroup(widget.type);
			if ($scope.belong_group === false) {
				return;
			}
			$scope.sources = (new GraphHandler()).getSourceNames($scope.belong_group);
			$scope.displaySource =!$scope.displaySource;
		};

		$scope.update = function(widget) {
			angular.element(document.querySelector("#" + widget.id)).empty();
			var width = WidgetCache.getWidth(widget);
			var height = WidgetCache.getHeight(widget);
			eval("var graph = new " + widget.type + "(" + width + ", " + height + ");");
			graph.update("#" + widget.id, $http);
		};

		$scope.isShowing = function() {
			return $scope.display;
		};

		$scope.isShowingSource = function() {
			return $scope.displaySource;
		};

		$scope.changeGraphTo = function(widget, to) {
			//Will retrieve data from the data template
			localStorage.removeItem(widget.id + 'data');

			angular.element(document.querySelector("#" + widget.id)).empty();
			var width = WidgetCache.getWidth(widget);
			var height = WidgetCache.getHeight(widget);
			eval("var graph = new " + to + "(" + width + ", " + height + ");");
			graph.draw("#" + widget.id);

			index = $scope.dashboard.widgets.indexOf(widget);
			$scope.dashboard.widgets[index].type = to;

			$scope.display = false;
		};

		$scope.changeSource = function(widget, new_source) {
			angular.element(document.querySelector("#" + widget.id)).empty();
			var width = WidgetCache.getWidth(widget);
			var height = WidgetCache.getHeight(widget);
			//var graph = factory.graphics(widget);
			eval("var graph = new " + widget.type + "(" + width + ", " + height + ");");
			graph.setSource(new_source);
			graph.draw("#" + widget.id);
		};

		$scope.modules = (new GraphHandler()).getClassesNames();

		$scope.sources = (new GraphHandler()).getSourceNames($scope.belong_group);

	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget', '$http',
	function($scope, $timeout, $rootScope, $modalInstance, widget, $http) {
		$scope.widget = widget;

		$scope.getSource = function() {
			eval("var graphic = new " + widget.type + "(0,0);");
			return graphic.source;
		};

		$scope.getConfiguration = function() {
			eval("var graphic = new " + widget.type + "(0,0);");
            obj = JSON.parse(localStorage[graphic.config_filename]);
			return JSON.stringify(obj, null, 4);
		};

		$scope.getData = function() {
			eval("var graphic = new " + widget.type + "(0,0);");
			obj = JSON.parse((localStorage[widget.id + 'data'])?localStorage[widget.id + 'data']:localStorage[graphic.source]);
			return JSON.stringify(obj, null, 4);
		};

		$scope.form = {
			id:    widget.id,
			name:  widget.name,
			sizeX: widget.sizeX,
			sizeY: widget.sizeY,
			col:   widget.col,
			row:   widget.row,
			type:  widget.type,
			source: $scope.getSource(),
			config: $scope.getConfiguration(),
			data:   $scope.getData()
		};

		$scope.dismiss = function() {
			$modalInstance.dismiss();
			//todo: workaround, set as a attributes to apply delete.
			editorConfig = null;
			editorData = null;
			settingsUp = false;
		};

		$scope.remove = function() {

			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);

			var request = {
				method: "POST",
				url: "http://localhost:3000/widget",
				dataType: 'json',
				data: {
					param: widget,
					method: 'remove'
				},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			$http(request)
				.then(function(response, status, headers, config)
					{
						$timeout(function() {
							window.alert(response.data.Result);
						});
					}
					,function(response, status, headers, config)
					{
						$timeout(function() {
							window.alert(response.data);
						});
					}
				);
			$modalInstance.close();
			settingsUp = false;
		};

		$scope.saveIntoDB = function(widget_form) {
			var configJson = (editorConfig)?editorConfig.getValue():widget_form.config;
			var dataJson = (editorData)?editorData.getValue():widget_form.data;

			var widget_config = {
				content: JSON.parse(configJson)
			};
			localStorage[widget.type.toLowerCase() + '.config'] = JSON.stringify(widget_config.content);

			var widget_data = {
				content: JSON.parse(dataJson)
			};
			localStorage[widget_form.id + 'data'] = JSON.stringify(widget_data.content);

			//before sent to the server, clean the widget.
			delete widget_form.config;
			delete widget_form.data;

			var request = {
				method: "POST",
				url: "http://localhost:3000/widget",
				dataType: 'json',
				data: {
					param:  widget_form,
					config: widget_config,
					data:   widget_data,
					method: 'save'
				},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			$http(request)
				.then(function(response, status, headers, config)
					{
						$timeout(function() {
							settingsUp = false;
							window.alert(response.data.Result);
						});
					}
					,function(response, status, headers, config)
					{
						$timeout(function() {
							settingsUp = false;
							window.alert(response.data);
						});
					}
				);
		};

		$scope.submit = function() {

			if ($scope.errorWidgetsConfig.length <= 0 && $scope.errorWidgetsData.length <= 0) {

				angular.extend(widget, $scope.form);

				var ID = widget.id;
				var _Class = $scope.form.type;
				document.getElementById(ID).setAttribute('alt', _Class);

				$modalInstance.close(widget);

				$scope.saveIntoDB($scope.form);

				if (_Class == 'Html') {
					return;
				}
				angular.element(document.querySelector("#" + ID)).empty();
				var width = WidgetCache.getWidth(widget);
				var height = WidgetCache.getHeight(widget);
				eval("var graph = new " + _Class + "(" + width + ", " + height + ");");
				graph.setSource($scope.form.source);
				graph.draw("#" + ID);

				index = $scope.dashboard.widgets.indexOf(widget);
				$scope.dashboard.widgets[index].type = $scope.form.type;

				//todo: workaround, set as a attributes to apply delete.
				editorConfig = null;
				editorData = null;
			} else {
				$timeout(function() {
					window.alert("Cannot save with errors in editor");
				});
			}
		};

		$scope.typeGraph = (new GraphHandler()).getClassesNames();

		$scope.tab = 1;

		$scope.errorWidgetsConfig = [];
		$scope.errorWidgetsData = [];

		$scope.updateHintsConfig = function () {
			editorConfig.operation(function() {
				for (var i = 0; i < $scope.errorWidgetsConfig.length; ++i)
					editorConfig.removeLineWidget($scope.errorWidgetsConfig[i]);
				$scope.errorWidgetsConfig.length = 0;

				JSHINT(editorConfig.getValue());
				for (i = 0; i < JSHINT.errors.length; ++i) {
					var err = JSHINT.errors[i];
					if (!err) continue;
					var msg = document.createElement("div");
					var icon = msg.appendChild(document.createElement("span"));
					icon.innerHTML = "!!";
					icon.className = "lint-error-icon";
					msg.appendChild(document.createTextNode(err.reason));
					msg.className = "lint-error";
					$scope.errorWidgetsConfig.push(editorConfig.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
				}
			});
			var info = editorConfig.getScrollInfo();
			var after = editorConfig.charCoords({line: editorConfig.getCursor().line + 1, ch: 0}, "local").top;
			if (info.top + info.clientHeight < after)
				editorConfig.scrollTo(null, after - info.clientHeight + 3);
		};

		$scope.updateHintsData = function () {
			editorData.operation(function() {
				for (var i = 0; i < $scope.errorWidgetsData.length; ++i)
					editorData.removeLineWidget($scope.errorWidgetsData[i]);
				$scope.errorWidgetsData.length = 0;

				JSHINT(editorData.getValue());
				for (i = 0; i < JSHINT.errors.length; ++i) {
					var err = JSHINT.errors[i];
					if (!err) continue;
					var msg = document.createElement("div");
					var icon = msg.appendChild(document.createElement("span"));
					icon.innerHTML = "!!";
					icon.className = "lint-error-icon";
					msg.appendChild(document.createTextNode(err.reason));
					msg.className = "lint-error";
					$scope.errorWidgetsData.push(editorData.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
				}
			});
			var info = editorData.getScrollInfo();
			var after = editorData.charCoords({line: editorData.getCursor().line + 1, ch: 0}, "local").top;
			if (info.top + info.clientHeight < after)
				editorData.scrollTo(null, after - info.clientHeight + 3);
		};

		$scope.setTab = function(newTab) {
			$scope.tab = newTab;
			if (newTab == 2) {
				if (!editorConfig) {
					editorConfig = CodeMirror.fromTextArea(document.getElementById("cmconfig"), {
						lineNumbers: true,
						indentUnit: 4,
						matchBrackets: true,
						autoCloseBrackets: true,
						mode: "application/ld+json",
						lineWrapping: true
					});
					var waitingConfig;
					editorConfig.on("change", function() {
						clearTimeout(waitingConfig);
						waitingConfig = setTimeout($scope.updateHintsConfig, 500);
					});
					setTimeout($scope.updateHintsConfig, 100);
				}
				setTimeout(function() {
					editorConfig.focus();
					editorConfig.refresh();
					editorConfig.focus();
				}, 1);
			} else if (newTab == 3) {
				if (!editorData) {
					editorData = CodeMirror.fromTextArea(document.getElementById("cmdata"), {
						lineNumbers: true,
						indentUnit: 4,
						matchBrackets: true,
						autoCloseBrackets: true,
						mode: "application/ld+json",
						lineWrapping: true
					});
					var waitingData;
					editorData.on("change", function() {
						clearTimeout(waitingData);
						waitingData = setTimeout($scope.updateHintsData, 500);
					});
					setTimeout($scope.updateHintsData, 100);
				}
				setTimeout(function() {
					editorData.focus();
					editorData.refresh();
					editorData.focus();
				}, 1);
			}
		};

		$scope.isSet = function(tabNum) {
			return $scope.tab === tabNum;
		};

		$scope.updateSource = function() {
			var name = $scope.form.type.toLowerCase();
			$scope.form.source = 'data/' + name + '.json';

			//NOTE: when the source changes it will replace with template data.
			//takes data from the template
			obj = JSON.parse(localStorage[name + '.config']);
			$scope.form.config = JSON.stringify(obj, null, 4);
			//takes from the template
			obj = JSON.parse(localStorage[$scope.form.source]);
			$scope.form.data = JSON.stringify(obj, null, 4);

			if (editorConfig) {
				editorConfig.setValue($scope.form.config);
				setTimeout(function () {
					editorConfig.refresh();
				}, 1);
			}
			if (editorData) {
				editorData.setValue($scope.form.data);
				setTimeout(function () {
					editorData.refresh();
				}, 1);
			}
		}
	}
])

// helper code
.filter('object2Array', function() {
	return function(input) {
		var out = [];
		for (i in input) {
			out.push(input[i]);
		}
		return out;
	}
});
