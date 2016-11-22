angular.module('app')

.directive('integer', function() {
	return {
		require: 'ngModel',
		link: function(scope, ele, attr, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				if (viewValue === '' || viewValue === null || typeof viewValue === 'undefined') {
					return null;
				}
				return parseInt(viewValue, 10);
			});
		}
	};
})

.directive( 'drawing', function() {
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
				element.css('height', (element[0].parentElement.clientHeight - 10) + 'px');
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

			scope.$on('gridster-item-resized',        updateGraph);
			scope.$on('gridster-item-transition-end', updateGraph);
			scope.$on('gridster-resized',             updateGraph);
			scope.$on('gridster-resizable-changed',   updateGraph);
			scope.$on('gridster-item-initialized',    updateGraph);
		}
	};
})

.controller('MainCtrl', function($scope) {

	$scope.gridsterOpts = {
		margins: [20, 20],
		outerMargin: false,
		pushing: true,
		floating: true,
		draggable: {
			enabled: true
		},
		resizable: {
			enabled: true,
			handles: ['n', 'e', 's', 'w', 'se', 'sw']
		}
	};

	// these map directly to gridsterItem options
	$scope.standardItems = [{
		sizeX: 2,
		sizeY: 1,
		row: 0,
		col: 0,
		id: 'Pie_1'
	}, {
		sizeX: 2,
		sizeY: 2,
		row: 0,
		col: 2,
		id: 'Lines_1'
	}, {
		sizeX: 2,
		sizeY: 1,
		row: 2,
		col: 1,
		id: 'Bar_1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 2,
		col: 3,
		id: 'Donut_1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 2,
		col: 4,
		id: 'Series_1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 0,
		col: 4,
		id: 'Pie_2'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 0,
		col: 5,
		id: 'Series_2'
	}, {
		sizeX: 2,
		sizeY: 1,
		row: 1,
		col: 0,
		id: 'Bar_2'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 1,
		col: 4,
		id: 'Bar_3'
	}, {
		sizeX: 1,
		sizeY: 2,
		row: 1,
		col: 5,
		id: 'Pie_3'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 2,
		col: 0,
		id: 'Lines_2'
	}];

	// these are non-standard, so they require mapping options
	$scope.customItems = [{
		size: {
			x: 2,
			y: 1
		},
		position: [0, 0],
		id: 'Lines_3'
	}, {
		size: {
			x: 2,
			y: 2
		},
		position: [0, 2],
		id: 'Donut_2'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [1, 4],
		id: 'Donut_3'
	}, {
		size: {
			x: 1,
			y: 2
		},
		position: [1, 5],
		id: 'Bar_4'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [2, 0],
		id: 'Bar_5'
	}, {
		size: {
			x: 2,
			y: 1
		},
		position: [2, 1],
		id: 'Bar_6'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [2, 3],
		id: 'Donut_4'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [0, 4],
		id: 'Series_3'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [0, 5],
		id: 'Series_4'
	}, {
		size: {
			x: 2,
			y: 1
		},
		position: [1, 0],
		id: 'Series_5'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [2, 4],
		id: 'Pie_4'
	}];

	$scope.emptyItems = [{
		name: 'Item1'
	}, {
		name: 'Item2'
	}, {
		name: 'Item3'
	}, {
		name: 'Item4'
	}];

	// map the gridsterItem to the custom item structure
	$scope.customItemMap = {
		sizeX: 'item.size.x',
		sizeY: 'item.size.y',
		row: 'item.position[0]',
		col: 'item.position[1]'
	};

});
