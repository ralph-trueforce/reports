/**
 * Class Bar
 *
 * @param width
 * @param height
 * @constructor
 */
function Bar(width, height) {
	this.base = Cartesian;
	this.base(width, height); //call super constructor.
	this.name = arguments.callee.name.toLowerCase();

	//TODO: Should be a private function
	this.process = function(tag_id) {

		var _this = this;

		var width = this.width - this.margin.left - this.margin.right,
			height = this.height - this.margin.top - this.margin.bottom;

		var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10);

		var svg = d3.select(tag_id).append("svg")
			.attr("width", width + this.margin.left + this.margin.right)
			.attr("height", height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform",
			"translate(" + this.margin.left + "," + this.margin.top + ")");

		d3.csv("data/dataBar.csv", function (error, data) {

			data.forEach(function (d) {
				//d.date = parseDate(d.date);
				d.population = +d.population;
			});

			x.domain(data.map(function (d) { return d.age; }));
			y.domain([0, d3.max(data, function (d) { return d.population; })]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", "-.55em")
				.attr("transform", "rotate(-90)");

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end");

			svg.selectAll("bar")
				.data(data)
				.enter()
				.append("rect")
				.style("fill", function(d) { return _this.color(d.age); })
				.attr("x", function (d) { return x(d.age)+5; })
				.attr("y", function (d) { return y(d.population); })
				.attr("width", x.rangeBand()-10)
				.attr("height", function (d) { return height - y(d.population); });

		});
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-book\"></span> Share <a href=\"#\">https://www.domo.com/connectors/excel</a>  <span class=\"glyphicon glyphicon-eye-open\"></span>";
    }
}

Bar.prototype = Object.create(Cartesian.prototype);
