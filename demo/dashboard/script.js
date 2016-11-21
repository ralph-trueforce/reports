angular.module('app')

.directive( 'getSize', function() {
	return {
		link: function( scope, element, attrs ) {
			scope.$watch
			(
				function () {
					return '{"height":' + (element[0].clientHeight + 3) + ', "width":' + (element[0].clientWidth + 2) + '}';
				},
				function (newSize, oldSize) {
					//console.log(element[0].id);
					var div_size = JSON.parse(newSize);
					var old_div_size = JSON.parse(oldSize);
					//console.log("(" + div_size.height + "," + div_size.width + ")");
					//console.log("(" + old_div_size.height + "," + old_div_size.width + ")");

					if (div_size.height > 408 || div_size.width > 450) {
						var ID = element[0].id;
						//angular.element(document.querySelector("#" + ID)).empty();
						//eval("var graph = new " + ID + "("+div_size.width+", "+div_size.height+");");
						//graph.draw("#" + ID);
					}
				}
			);
			scope.$on('gridster-item-resized', function(item) {
				// console.log(element[0].id + 'item resized');
				//console.log(element[0]);
				//console.log(scope);
				var ID = element[0].id;
				if (isNaN(ID)) {
					angular.element(document.querySelector("#" + ID)).empty();
					eval("var graph = new " + ID + "(" + element[0].clientWidth + ", " + (element[0].clientHeight + 380) + ");");
					graph.draw("#" + ID);
				}

			});
			scope.$on('gridster-item-transition-end', function(item) {
				//console.log(element[0].id + ' item transition');
				//console.log("end(" + element[0].clientWidth+", "+element[0].clientHeight + ")");
				//console.log(element[0]);
				//console.log(scope);
				var ID = element[0].id;
				if (isNaN(ID)) {
					angular.element(document.querySelector("#" + ID)).empty();
					eval("var graph = new " + ID + "(" + element[0].clientWidth + ", " + (element[0].clientHeight + 380) + ");");
					graph.draw("#" + ID);
				}

			});
		}
	};
})

.directive( 'dragme', function() {
	return {
		link: function( scope, element, attrs ) {
			element.bind('click', function() {
				alert("click me");
			});
			element.bind('mouseup', function() {
				alert("release me");
			});
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

.controller('DashboardCtrl', ['$scope', '$timeout', '$sce',
	function($scope, $timeout, $sce) {
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
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: "Donut",
					type: 'graph'
				}, {
					col: 2,
					row: 1,
					sizeY: 1,
					sizeX: 1,
					name: "Widget",
					id: "Lines",
					type: 'graph'
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
					name: "Other Widget 1"
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2"
				}]
			}
		};

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = function() {
			if (localStorage['widget_index']) {
				widgetIndex = localStorage['widget_index'];
				widgetIndex++;
			} else {
				widgetIndex = 3;
			}
			localStorage['widget_index'] = widgetIndex;

			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1,
				id: widgetIndex,
				text: $sce.trustAsHtml("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt risus luctus lobortis vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris bibendum leo a congue mattis. In blandit finibus nibh. Etiam tincidunt volutpat mollis. Integer dolor purus, ullamcorper nec purus et, semper interdum ligula. Curabitur magna mauris, feugiat sit amet convallis sagittis, pellentesque eget erat. Proin non laoreet elit. Vivamus posuere orci quis dolor rutrum ornare. Etiam convallis efficitur nulla eu scelerisque. Pellentesque congue accumsan turpis sit amet rutrum.</p><p>Aliquam vel massa tempor turpis auctor accumsan. Praesent et lacinia orci. Nulla dignissim quis ligula non fermentum. Pellentesque dictum mollis posuere. Sed congue eros eget euismod ornare. Integer id venenatis metus. Donec porttitor tincidunt lectus sed facilisis. Etiam condimentum, nulla et faucibus luctus, quam mi mollis metus, finibus tempor massa nisl at nisi. Suspendisse sodales pulvinar urna sodales maximus. Phasellus egestas quam ex, sed blandit eros finibus aliquam. Ut nec tellus rhoncus, tempor magna sed, volutpat ipsum.</p>"),
				type: 'html'
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
			row: widget.row
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
