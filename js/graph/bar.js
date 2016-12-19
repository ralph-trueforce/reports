/**
 * Class Bar
 *
 * @param width
 * @param height
 * @constructor
 */
function Bar(width, height) {
	this.base = Cartesian;
	this.base(width, height, arguments); //call super constructor.
	// this.name = arguments.callee.name.toLowerCase();
	// this.source = 'data/bar.json';

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
			.attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")");

		d3.select(tag_id).style("background-color", this.background_color);

		var config_tooltip = this.tooltip;
		var tooltip = d3.select(tag_id).append("div")
			.attr("id",        config_tooltip.name + this.id)
			.style("position", config_tooltip.position)
			.style("width",    config_tooltip.width)
			.style("height",   config_tooltip.height)
			.style("padding",  config_tooltip.padding)
			.style("background-color", config_tooltip.background_color)
			.style("border",   config_tooltip.border)
			.style("display",  config_tooltip.display)
			.style("opacity",  config_tooltip.opacity);

		d3.json(this.source, function (error, data) {
			data = _this.preData(error, data);

			data.forEach(function (d) {
				//d.date = parseDate(d.date);
				d.value = +d.value;
			});

			x.domain(data.map(function (d) { return d.process; }));
			y.domain([0, d3.max(data, function (d) { return d.value; })]);

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
				.style("fill", function(d) { return _this.color(d.process); })
				.attr("x", function (d) { return x(d.process) + 5; })
				.attr("y", function (d) { return y(d.value); })
				.attr("width", x.rangeBand() - 10)
				.attr("height", function (d) { return height - y(d.value); });

			var cache_color;
			svg.selectAll("rect")
				.on("mouseover", function (d) {
					cache_color = d3.select(this).style("fill");
					cache_width = d3.select(this).attr("width");
					var colour = d3.rgb(cache_color);
					colour.r +=40;
					colour.g +=40;
					colour.b +=40;
					d3.select(this)
						.style("fill", "rgb(" + colour.r + ", " + colour.g + ", " + colour.b + ")")
						.style("border","1px solid black");
					tooltip
						.style("top", y(d.value) + 40 + "px")
						.style("left", x(d.process) + 40 + (cache_width / 2) + "px")
						.style("display", "block")
						.html("<p>" + d.value + "</p>");
				})
				.on("mouseout", function (d) {
					d3.select(this).style("fill", cache_color).style("border","none");
					tooltip
						.style("display", "none");
				}	);
		});
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-book\"></span> Share <a href=\"#\">https://www.domo.com/connectors/excel</a>  <span class=\"glyphicon glyphicon-eye-open\"></span>";
    }
}

Bar.prototype = Object.create(Cartesian.prototype);
