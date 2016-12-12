/**
 * Created by raeioul on 11/22/16.
 */

/**
 * Funel Class
 *
 * @param width
 * @param height
 * @constructor
 */
function Funel(width, height) {
	this.base = Round;
	this.base(width, height); //call super constructor.
	this.name = arguments.callee.name.toLowerCase();

    this.process = function (tag_id) {

		var _this = this;

        var width = this.width - 20,
            height = this.height - 10;

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

		d3.select(tag_id).style("background-color", this.config.background_color);

        d3.json("data/funel.json", function (error, data) {

        	var funnel = d3.funnel()
                .size([width, height])
                .mouth([100, 100])
                .value(function (d) {
                    return d.value;
                });

            var line = d3.svg.line()
                .interpolate('linear-closed')
                .x(function (d, i) {
                    return d.x;
                })
                .y(function (d, i) {
                    return d.y;
                });

            var g = svg.selectAll(".funnel-group")
                .data(funnel(data))
                .enter().append("g")
                .attr("class", "funnel-group");

            g.append("path")
                .attr("d", function (d) {
                    return line(d.coordinates);
                })
                .style("fill", function (d) {
                    return _this.color(d.process);
                });

            g.append("text")
                .attr({
                    "y": function (d, i) {
                        if (d.coordinates.length === 4) {
                            return (((d.coordinates[0].y - d.coordinates[1].y) / 2) + d.coordinates[1].y) + 5;
                        } else {
                            return (d.coordinates[0].y + d.coordinates[1].y) / 2 + 10;
                        }
                    },
                    "x": function (d, i) {
                        return width / 2;
                    }
                })
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.process;
                });
        });
    };
}

Funel.prototype = Object.create(Round.prototype);
