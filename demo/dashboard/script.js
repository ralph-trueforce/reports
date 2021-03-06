//TODO move the Factory method (pattern design on /js) for graphs into a class
angular.module('app')
.factory('dashboardService', function() {
	return {
		settings_up: false,
		remove_message: "Do you really want to delete this widget?"
	};
})
.directive('drawGraph', ['dashboardService', function(dashboardService) {
	return {
		link: function( scope, element, attrs ) {

			/**
			 * Called after a widget is loaded
			 */
			element.ready(function() {
				if (attrs.name == 'New Widget') {
					updateGraph();
				}
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
			function updateGraph(event) {
				if (dashboardService.settings_up == true) {
					return;
				}
				//if(event)console.log(element[0].id + " - "+event.name);
				//console.log(object.targetScope.gridsterItem);
				//console.log(element[0]);
				element.css('height', (element[0].parentElement.clientHeight - 100) + 'px');
				var ID = element[0].id;
				if (isNaN(ID) && !isAngularModelVar(ID)) {
					//todo: clean the way to get enough info to create graph
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
			//scope.$on('gridster-resizable-changed',   updateGraph);
            //scope.$on('gridster-item-initialized',    updateGraph);

		}
	};
}])

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

			function appendFooter(object) {
				//TODO: workaround remove the html alone
				if (object.type == 'Html') {
					return;
				}

				eval("var graph = new " + object.type + "();");
				graph.setID(object.id?object.id:object.class);
				htmlText = graph.getFooter();
				var html_contents = "<div class=\"box-link\">" + $sce.trustAsHtml(htmlText) + "</div>";

				scope.$watch('widgetFooter', function () {
				    element.append(html_contents);
				});
			}

			function updateFooter(event, object) {
				if (object.id == attr.class) {
					angular.element(document.querySelector('.' + attr.class)).empty();
					appendFooter(object);
				}
			}

			appendFooter(attr);

			scope.$on('updateFooter', updateFooter);
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
					//return;
					request = {
						method: "POST",
						url: "http://localhost:3000/dashboard",
						dataType: 'json',
						data: {
							method: 'fetch_configurations'
						},
						headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip' }
					};

					$http(request).then(
						function(response, status, headers, config)	{
                            //console.log(response.data);
							response.data.forEach(function(item) {
								localStorage[item.id + '.config'] = JSON.stringify(item.data);
							});

							request = {
								method: "POST",
								url: "http://localhost:3000/dashboard",
								dataType: 'json',
								data: {
									method: 'fetch_sources'
								},
								headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip' }
							};

							$http(request).then(
								function(response, status, headers, config)	{
									//console.log(response.data);
									response.data.forEach(function(item) {
										localStorage[item.id + 'data'] = JSON.stringify(item.data);
									});
								}
								,function(response, status, headers, config) {
									console.log("Source data request failed");
								}
							);
						}
						,function(response, status, headers, config) {
							console.log("Configurations request failed");
						}
					);
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

.controller('CustomWidgetCtrl', ['$scope', '$modal', '$http', '$timeout', 'dashboardService',
	function($scope, $modal, $http, $timeout, dashboardService) {
		$scope.display = false;
		$scope.displaySource = false;
		$scope.belong_group = 0;

		$scope.remove = function(widget) {

			var response = confirm(dashboardService.remove_message);
			if (response == true) {

				var request = {
					method: "POST",
					url: "http://localhost:3000/widget",
					dataType: 'json',
					data: {
						param: widget,
						method: 'remove'
					},
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				};

				$http(request)
					.then(function (response, status, headers, config) {
							$timeout(function () {
								window.alert(response.data.Result);
							});
						}
						, function (response, status, headers, config) {
							$timeout(function () {
								window.alert(response.data);
							});
						}
					);

				$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			}
		};

		$scope.openSettings = function(widget) {
			dashboardService.settings_up = true;
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
			//Will retrieve data from the data TEMPLATE
			localStorage.removeItem(widget.id + 'data');
			localStorage.removeItem(widget.id + '.config');
			angular.element(document.querySelector("#" + widget.id)).empty();

			var width = WidgetCache.getWidth(widget);
			var height = WidgetCache.getHeight(widget);
			eval("var graph = new " + to + "(" + width + ", " + height + ");");
			graph.draw("#" + widget.id);

			index = $scope.dashboard.widgets.indexOf(widget);
			$scope.dashboard.widgets[index].type = to;

			$scope.$broadcast('updateFooter', {id : widget.id, type: to});

			$scope.display = false;
		};

		$scope.changeSource = function(widget, new_source) {
			localStorage.removeItem(widget.id + 'data');
			angular.element(document.querySelector("#" + widget.id)).empty();

			var width = WidgetCache.getWidth(widget);
			var height = WidgetCache.getHeight(widget);
			//var graph = factory.graphics(widget);
			eval("var graph = new " + widget.type + "(" + width + ", " + height + ");");
			graph.setID(widget.id);
			graph.setSource(new_source);
			graph.draw("#" + widget.id);

			$scope.displaySource = false;
		};

		$scope.modules = (new GraphHandler()).getClassesNames();

		$scope.sources = (new GraphHandler()).getSourceNames($scope.belong_group);

	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget', '$http', 'dashboardService',
	function($scope, $timeout, $rootScope, $modalInstance, widget, $http, dashboardService) {
		$scope.widget = widget;
		$scope.editorConfig = null;
		$scope.editorData  = null;

		$scope.getSource = function() {
			eval("var graphic = new " + widget.type + "();");
			return graphic.source;
		};

		$scope.loadConfiguration = function() {
			eval("var graphic = new " + widget.type + "();");
            // //obj = JSON.parse(localStorage[widget.id + '.config']);
            // obj = JSON.parse(localStorage[graphic.config_filename]);
            // return JSON.stringify(obj, null, 4);
            return graphic.getConfiguration(widget.id);
		};

		$scope.loadData = function() {
			eval("var graphic = new " + widget.type + "();");
            // obj = JSON.parse((localStorage[widget.id + 'data'])?localStorage[widget.id + 'data']:localStorage[graphic.source]);
            // return JSON.stringify(obj, null, 4);
            return graphic.getData(widget.id);
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
			config: $scope.loadConfiguration(),
			data:   $scope.loadData()
		};

		$scope.dismiss = function() {
			$modalInstance.dismiss();
			delete $scope.editorConfig;
			delete $scope.editorData;
			$timeout(function() {
				dashboardService.settings_up = false;
			});
		};

		$scope.remove = function() {

			var response = confirm(dashboardService.remove_message);
			if (response == true) {
				$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);

				var request = {
					method: "POST",
					url: "http://localhost:3000/widget",
					dataType: 'json',
					data: {
						param: widget,
						method: 'remove'
					},
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				};

				$http(request)
					.then(function (response, status, headers, config) {
							$timeout(function () {
								window.alert(response.data.Result);
							});
						}
						, function (response, status, headers, config) {
							$timeout(function () {
								window.alert(response.data);
							});
						}
					);
				$modalInstance.close();
				$timeout(function () {
					dashboardService.settings_up = false;
				});
			}
		};

		$scope.saveIntoDB = function(widget_form) {
			var configJson = ($scope.editorConfig)?$scope.editorConfig.getValue():widget_form.config;
			var dataJson = ($scope.editorData)?$scope.editorData.getValue():widget_form.data;

			var widget_config = {
				content: JSON.parse(configJson)
			};
			//localStorage[widget.type.toLowerCase() + '.config'] = JSON.stringify(widget_config.content);
			localStorage[widget_form.id + '.config'] = JSON.stringify(widget_config.content);

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
							dashboardService.settings_up = false;
							window.alert(response.data.Result);
						});
					}
					,function(response, status, headers, config)
					{
						$timeout(function() {
							dashboardService.settings_up = false;
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
				graph.setID(ID);
				graph.setSource($scope.form.source);
				graph.draw("#" + ID);

				index = $scope.dashboard.widgets.indexOf(widget);
				$scope.dashboard.widgets[index].type = $scope.form.type;

				$rootScope.$broadcast('updateFooter', {id : ID, type: _Class});

				delete $scope.editorConfig;
				delete $scope.editorData;
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
			$scope.editorConfig.operation(function() {
				for (var i = 0; i < $scope.errorWidgetsConfig.length; ++i)
					$scope.editorConfig.removeLineWidget($scope.errorWidgetsConfig[i]);
				$scope.errorWidgetsConfig.length = 0;

				JSHINT($scope.editorConfig.getValue());
				for (i = 0; i < JSHINT.errors.length; ++i) {
					var err = JSHINT.errors[i];
					if (!err) continue;
					var msg = document.createElement("div");
					var icon = msg.appendChild(document.createElement("span"));
					icon.innerHTML = "!!";
					icon.className = "lint-error-icon";
					msg.appendChild(document.createTextNode(err.reason));
					msg.className = "lint-error";
					$scope.errorWidgetsConfig.push($scope.editorConfig.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
				}
			});
			var info = $scope.editorConfig.getScrollInfo();
			var after = $scope.editorConfig.charCoords({line: $scope.editorConfig.getCursor().line + 1, ch: 0}, "local").top;
			if (info.top + info.clientHeight < after)
				$scope.editorConfig.scrollTo(null, after - info.clientHeight + 3);
		};

		$scope.updateHintsData = function () {
			$scope.editorData.operation(function() {
				for (var i = 0; i < $scope.errorWidgetsData.length; ++i)
					$scope.editorData.removeLineWidget($scope.errorWidgetsData[i]);
				$scope.errorWidgetsData.length = 0;

				JSHINT($scope.editorData.getValue());
				for (i = 0; i < JSHINT.errors.length; ++i) {
					var err = JSHINT.errors[i];
					if (!err) continue;
					var msg = document.createElement("div");
					var icon = msg.appendChild(document.createElement("span"));
					icon.innerHTML = "!!";
					icon.className = "lint-error-icon";
					msg.appendChild(document.createTextNode(err.reason));
					msg.className = "lint-error";
					$scope.errorWidgetsData.push($scope.editorData.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
				}
			});
			var info = $scope.editorData.getScrollInfo();
			var after = $scope.editorData.charCoords({line: $scope.editorData.getCursor().line + 1, ch: 0}, "local").top;
			if (info.top + info.clientHeight < after)
				$scope.editorData.scrollTo(null, after - info.clientHeight + 3);
		};

		$scope.setTab = function(newTab) {
			$scope.tab = newTab;
			if (newTab == 2) {
				if (!$scope.editorConfig) {
					$scope.editorConfig = CodeMirror.fromTextArea(document.getElementById("cmconfig"), {
						lineNumbers: true,
						indentUnit: 4,
						matchBrackets: true,
						autoCloseBrackets: true,
						mode: "application/ld+json",
						lineWrapping: true
					});
					var waitingConfig;
					$scope.editorConfig.on("change", function() {
						clearTimeout(waitingConfig);
						waitingConfig = setTimeout($scope.updateHintsConfig, 500);
					});
					setTimeout($scope.updateHintsConfig, 100);
				}
				setTimeout(function() {
					$scope.editorConfig.focus();
					$scope.editorConfig.refresh();
					$scope.editorConfig.focus();
				}, 1);
			} else if (newTab == 3) {
				if (!$scope.editorData) {
					$scope.editorData = CodeMirror.fromTextArea(document.getElementById("cmdata"), {
						lineNumbers: true,
						indentUnit: 4,
						matchBrackets: true,
						autoCloseBrackets: true,
						mode: "application/ld+json",
						lineWrapping: true
					});
					var waitingData;
					$scope.editorData.on("change", function() {
						clearTimeout(waitingData);
						waitingData = setTimeout($scope.updateHintsData, 500);
					});
					setTimeout($scope.updateHintsData, 100);
				}
				setTimeout(function() {
					$scope.editorData.focus();
					$scope.editorData.refresh();
					$scope.editorData.focus();
				}, 1);
			}
		};

		$scope.isSet = function(tabNum) {
			return $scope.tab === tabNum;
		};

		// Load selected TEMPLATE
		$scope.updateSource = function() {
			var name = $scope.form.type.toLowerCase();
			$scope.form.source = 'data/' + name + '.json';

			//NOTE: When the source changes it will replace with template data, then your current 'data' could be "LOST" if you saved.
			//takes data from the template
			obj = JSON.parse(localStorage[name + '.config']);
			$scope.form.config = JSON.stringify(obj, null, 4);
			//takes from the template
			obj = JSON.parse(localStorage[$scope.form.source]);
			$scope.form.data = JSON.stringify(obj, null, 4);

			if ($scope.editorConfig) {
				$scope.editorConfig.setValue($scope.form.config);
				setTimeout(function () {
					$scope.editorConfig.refresh();
				}, 1);
			}
			if ($scope.editorData) {
				$scope.editorData.setValue($scope.form.data);
				setTimeout(function () {
					$scope.editorData.refresh();
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
