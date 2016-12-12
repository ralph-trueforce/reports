/**
 * Created by ralph on 12/5/16.
 */

var CONFIG_DASHBOARD = {
	'1': {
		id: '1',
		name: 'Home',
		widgets: [{
			col: 0,
			row: 1,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Donut",
			id: 'e2fbbae93b05e97b3b821237a47b590194420cb1',
			type: 'Donut'
		}, {
			col: 0,
			row: 5,
			sizeY: 2,
			sizeX: 2,
			name: "Widget_Horiz",
			id: 'd6475ff9ec83dd6c399c6c5a9c68ae2b9677359a',
			type: 'Horiztool'
		}, {
			col: 2,
			row: 5,
			sizeY: 2,
			sizeX: 2,
			name: "Widget_Donutt",
			id: 'd6475ff3ec83dd6c399a6c5a9c68de2b9677359a',
			type: 'Donutt'
		}, {
			col: 1,
			row: 6,
			sizeY: 2,
			sizeX: 4,
			name: "Widget_Linest",
			id: 'd5475ff3ec83dd6c399a6c5a9c68de2c9677358a',
			type: 'Linest'
		}, {
			col: 1,
			row: 1,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Lines",
			id: 'd6475ff9ec83dc6c199c6c5a9c68ee2b9677359a',
			type: 'Lines'
		}, {
			col: 2,
			row: 1,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Bar",
			id: 'b5a401f33303e66e8d71f52c47260415ae2041c8',
			type: 'Bar'
		}, {
			col: 3,
			row: 1,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Pie",
			id: 'c49dbcdab9c2f24580078429ccafe24a4bf02edd',
			type: 'Pie'
		}, {
			col: 1,
			row: 3,
			sizeY: 1,
			sizeX: 2,
			name: "Widget_Stacked",
			id: 'cb097accaab79146eaf5900d9aabd4bfe19a184c',
			type: 'Stacked'
		}, {
			col: 3,
			row: 3,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Funel",
			id: 'eae43061961f88160c7ed44be52ca15d3159cc5a',
			type: 'Funel'
		}, {
			col: 0,
			row: 2,
			sizeY: 1,
			sizeX: 1,
			name: "Widget_Hierarchical",
			id: 'b84b50477b0e135113261f0f52054472b62b8318',
			type: 'Hierarchical'
		}, {
			col: 0,
			row: 4,
			sizeY: 2,
			sizeX: 4,
			name: "Widget_Revenue",
			id: 'bafcf1f61a98dfe0253bdc22275432ee9686e968',
			type: 'Revenue'
		}, {
			col: 0,
			row: 5,
			sizeY: 2,
			sizeX: 2,
			name: "Widget_Sunburst",
			id: 'e8ce9b633ffda2a83be486b4e06abc0c59729a88',
			type: 'Sunburst'
		}, {
			col: 1,
			row: 2,
			sizeY: 2,
			sizeX: 4,
			name: "Widget_Series",
			id: 'b5150a7d30a8017ef67f9cfddc543b6c9ddd14e3',
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
			id: 'f61ffe391ce7fd6fd1d43ae49698e2973b40aa48',
			type: 'Lines'
		}, {

			col: 1,
			row: 3,
			sizeY: 1,
			sizeX: 1,
			name: "Other Widget 2",
			id: 'bfce37a4a6272cd1be0227c6211b9d3401068ead',
			type: 'Donut'
		}]
	}
};


// these map directly to gridsterItem options
var STANDARD_ITEMS = [{
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
var CUSTOM_ITEMS = [{
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
