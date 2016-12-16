/**
 * Class Linestooltip
 *
 * @param width
 * @param height
 * @constructor
 */

function Linest(width, height) {
    this.base = Cartesian;
    this.base(width, height, arguments); //call super constructor.
    //this.name = arguments.callee.name.toLowerCase();

    //TODO: Should be a private function
    this.process = function (tag_id) {

        var _this = this;

        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

        // Parse the date / time
        var parseDate = d3.time.format("%d-%b-%y").parse;
        var formatTime = d3.time.format("%e %B");

        // Set the ranges
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        // Define the line
        var valueline = d3.svg.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        // Define the div for the tooltip
        var div = d3.select(tag_id).append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", "60px")
            .style("height", "38px")
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("background", "lightsteelblue")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("pointer-events", "none")
            .style("opacity", 0);


        // Adds the svg canvas
        var svg = d3.select(tag_id)
            .append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height + this.margin.top + this.margin.bottom)
            .attr("font-size", _this.fontSize)
            .attr("font-family", _this.fontType)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

        // Get the data
        d3.json("data/datum.json", function (error, data) {
			if (error) {
				throw error;
			}

			localStorage[_this.source] = JSON.stringify(data);

            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.close;
            })]);

            // Add the valueline path.
            svg.append("path")
                .attr("class", "line")
                .attr("stroke", _this.lineColor)
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("d", valueline(data));

            // Add the scatterplot
            svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 5)
                .attr("cx", function (d) {
                    return x(d.date);
                })
                .attr("cy", function (d) {
                    return y(d.close);
                })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(formatTime(d.date) + "<br/>" + d.close)
                        .style("left", (d3.event.layerX) + "px")
                        .style("top", (d3.event.layerY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                // .style("fill", "none")
                .style("stroke", _this.fontColor)
                .style("stroke-width", 1)
                .style("shape-rendering", "crispEdges")
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                // .style("fill", "none")
                .style("stroke", _this.fontColor)
                .style("stroke-width", 1)
                .style("shape-rendering", "crispEdges")
                .call(yAxis);

        });
    }
}

Linest.prototype = Object.create(Cartesian.prototype);
