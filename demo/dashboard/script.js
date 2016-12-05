angular.module('app')

.directive( 'getSize', function() {
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
			function updateGraph() {
				element.css('height', (element[0].parentElement.clientHeight - 100) + 'px');
				var ID = element[0].id;
				if (isNaN(ID) && !isAngularModelVar(ID)) {
					var _Class = ID.split("_")[0];
					if (_Class == 'Html') {
						return;
					}
					angular.element(document.querySelector("#" + ID)).empty();
					eval("var graph = new " + _Class + "(" + element[0].clientWidth + ", " + (element[0].clientHeight) + ");");
					graph.draw("#" + ID);
				}
			}
			scope.$watch
			(
				function () {
					return '{"height":' + (element[0].clientHeight + 3) + ', "width":' + (element[0].clientWidth + 2) + '}';
				},
				function (newSize, oldSize) {
					var div_size = JSON.parse(newSize);
					var old_div_size = JSON.parse(oldSize);
					if (div_size.height > 408 || div_size.width > 450) {
						var ID = element[0].id;
					}
				}
			);
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
			)
		}
	}
}])

.directive ('dashboardButtons', ['$sce', function($sce) {
	return {
		link: function (scope, element, attr) {

			var handler = new GraphHandler();
			var html_contents = handler.createGraphButtons();
			html_contents = "<div>" + $sce.trustAsHtml(html_contents) + "</div>";
			scope.$watch('dashboardButtons', function () {
				 element.append(html_contents);
			});
		}
	}
}])


.controller('DashboardCtrl', ['$scope', '$timeout', '$sce',
	function($scope, $timeout, $sce) {
		$scope.graphics = (new GraphHandler()).getClassesNames();

		$scope.gridsterOptions = {
			margins: [20, 20],
			columns: 4,
			draggable: {
				handle: 'h3'
			}
		};

		$scope.dashboards = {
			'1': {
				id: '1',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Donut'
				}, {
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Lines'
				}, {
					col: 2,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Bar'
				}, {
					col: 3,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Pie'
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 2,
					name: "Widget",
					id: 1,
					type: 'Stacked'
				}, {
					col: 3,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Funel'
				}, {
					col: 0,
					row: 2,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: 1,
					type: 'Hierarchical'
				}, {
					col: 0,
					row: 4,
					sizeY: 2,
					sizeX: 4,
					name: "Widget",
					id: 1,
					type: 'Revenue'
				}, {
					col: 0,
					row: 5,
					sizeY: 2,
					sizeX: 2,
					name: "Widget",
					id: 1,
					type: 'Sunburst'
				}, {
					col: 1,
					row: 2,
					sizeY: 2,
					sizeX: 4,
					name: "Widget",
					id: 1,
					type: 'Series'
				}]
			},
			'2': {
				id: '2',
				name: 'Other',
				widgets: [{
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 2,
					name: "Other Widget 1",
					id: 1,
					type: 'Lines'
				}, {

					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2",
					id: 1,
					type: 'Donut'
				}]
			}
		};

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.getButtons = function() {
		   var handler = new GraphHandler();
		   var html_contents = handler.createGraphButtons();
		   html_contents = $sce.trustAsHtml(html_contents);

		   return html_contents;
		};

		$scope.addWidget = function(type) {
			if (localStorage[type + '_index']) {
				widgetIndex = localStorage[type + '_index'];
				widgetIndex++;
			} else {
				widgetIndex = 2;
			}
			localStorage[type + '_index'] = widgetIndex;

			var html_text;
			/*if (type == 'Html') {
				html_text = $sce.trustAsHtml("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt risus luctus lobortis vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris bibendum leo a congue mattis. In blandit finibus nibh. Etiam tincidunt volutpat mollis. Integer dolor purus, ullamcorper nec purus et, semper interdum ligula. Curabitur magna mauris, feugiat sit amet convallis sagittis, pellentesque eget erat. Proin non laoreet elit. Vivamus posuere orci quis dolor rutrum ornare. Etiam convallis efficitur nulla eu scelerisque. Pellentesque congue accumsan turpis sit amet rutrum.</p><p>Aliquam vel massa tempor turpis auctor accumsan. Praesent et lacinia orci. Nulla dignissim quis ligula non fermentum. Pellentesque dictum mollis posuere. Sed congue eros eget euismod ornare. Integer id venenatis metus. Donec porttitor tincidunt lectus sed facilisis. Etiam condimentum, nulla et faucibus luctus, quam mi mollis metus, finibus tempor massa nisl at nisi. Suspendisse sodales pulvinar urna sodales maximus. Phasellus egestas quam ex, sed blandit eros finibus aliquam. Ut nec tellus rhoncus, tempor magna sed, volutpat ipsum.</p>");
			}*/

			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1,
				id: /*type + '_' +*/ widgetIndex,
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

	}
])

.controller('CustomWidgetCtrl', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
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
	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
	function($scope, $timeout, $rootScope, $modalInstance, widget) {
		$scope.widget = widget;

		$scope.form = {
			name: widget.name,
			sizeX: widget.sizeX,
			sizeY: widget.sizeY,
			col: widget.col,
			row: widget.row,
			type: widget.type,
			source: 'File'
		};

		$scope.sizeOptions = [{
			id: '1',
			name: '1'
		}, {
			id: '2',
			name: '2'
		}, {
			id: '3',
			name: '3'
		}, {
			id: '4',
			name: '4'
		}];

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.remove = function() {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			$modalInstance.close();
		};

		$scope.submit = function() {
			angular.extend(widget, $scope.form);

			$modalInstance.close(widget);


		};

		$scope.typeGraph = (new GraphHandler()).getClassesNames();

		$scope.dataSources = ['Network', 'File'];

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
