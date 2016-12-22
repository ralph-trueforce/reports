/**
 * Created by ralph on 11/18/16.
 */

/**
 * Lines class
 *
 * @param width
 * @param height
 * @constructor
 */
function Lines(width, height) {
	this.base = Cartesian;
	this.base(width, height, arguments); //call super constructor.
	// this.name = arguments.callee.name.toLowerCase();

    /**
     * Process function member
     * @param tag_id
     */
    this.process = function(tag_id) {
    	var _this = this;
        // Set the dimensions of the canvas / graph
        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

        // Parse the date / time
        var parseDate = d3.time.format("%d-%b-%y").parse;

        // Set the ranges
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(this.x_axis.ticks);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(this.y_axis.ticks);

        // Define the line
        var valueline = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Adds the svg canvas
        var svg = d3.select(tag_id)
            .append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		d3.select(tag_id).style("background-color", this.background_color);

        // Get the data
        d3.json(this.source, function(error, data) {
			data = _this.preData(error, data);

            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.close; })]);

            // Add the valueline path.
            svg.append("path")
                .attr("class", "line pin")
                .attr("d", valueline(data));

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var text = svg.selectAll("text");
            text.style("font-size", _this.text_fonsize);
            text.style("font-family", _this.text_fontfamily);
            text.style("fill", _this.text_color);
            svg.selectAll(".x.axis").selectAll('path').style("fill",   _this.axis_backcolor);
            svg.selectAll(".x.axis").selectAll('path').style("stroke", _this.axis_color);
            svg.selectAll(".y.axis").selectAll('path').style("fill",   _this.axis_backcolor);
            svg.selectAll(".y.axis").selectAll('path').style("stroke", _this.axis_color);
            svg.selectAll(".line.pin").style("stroke",  _this.line_color);
        });
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-th-large\"></span>Compare with <a href=\"#\">https://www.domo.com/connectors/excel</a><span class=\"glyphicon glyphicon-road\"></span>";
    }
}

Lines.prototype = Object.create(Cartesian.prototype);
