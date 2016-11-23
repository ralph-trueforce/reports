angular.module('app')

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

		}
	};
})

.controller('MainCtrl', function($scope, $timeout) {

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
		row: 1,
		col: 0,
		id: 'Pie__1'
	}, {
		sizeX: 2,
		sizeY: 2,
		row: 1,
		col: 2,
		id: 'Lines__1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 1,
		col: 4,
		id: 'Bar__3'
	}, {
		sizeX: 1,
		sizeY: 2,
		row: 1,
		col: 5,
		id: 'Pie__3'
	}, {
		sizeX: 2,
		sizeY: 1,
		row: 2,
		col: 0,
		id: 'Bar__1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 2,
		col: 4,
		id: 'Donut__1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 3,
		col: 1,
		id: 'Series__1'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 3,
		col: 4,
		id: 'Pie__2'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 3,
		col: 5,
		id: 'Series__2'
	}, {
		sizeX: 2,
		sizeY: 1,
		row: 3,
		col: 2,
		id: 'Bar__2'
	}, {
		sizeX: 1,
		sizeY: 1,
		row: 3,
		col: 0,
		id: 'Lines__2'
	}];

	// these are non-standard, so they require mapping options
	$scope.customItems = [{
		size: {
			x: 2,
			y: 1
		},
		position: [1, 0],
		id: 'Lines__3'
	}, {
		size: {
			x: 2,
			y: 2
		},
		position: [1, 2],
		id: 'Donut__2'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [2, 4],
		id: 'Pie__4'
	}, {
		size: {
			x: 1,
			y: 2
		},
		position: [2, 5],
		id: 'Bar__4'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [3, 0],
		id: 'Series__4'
	}, {
		size: {
			x: 2,
			y: 1
		},
		position: [3, 1],
		id: 'Bar__6'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [3, 3],
		id: 'Pie__5'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [1, 4],
		id: 'Bar__5'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [1, 5],
		id: 'Lines__4'
	}, {
		size: {
			x: 2,
			y: 1
		},
		position: [1, 0],
		id: 'Series__5'
	}, {
		size: {
			x: 1,
			y: 1
		},
		position: [3, 4],
		id: 'Donut__3'
	}];

	// map the gridsterItem to the custom item structure
	$scope.customItemMap = {
		sizeX: 'item.size.x',
		sizeY: 'item.size.y',
		row: 'item.position[0]',
		col: 'item.position[1]'
	};

});
