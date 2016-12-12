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
	this.base = Graphic;
	this.base(width, height); //call super constructor.
	//Graphic.call(width, height);

    this.draw = function (tag_id) {

        var width = this.width -20,
            height = this.height - 10,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range([
            	"#255a71",
				"#3a6f71",
				"#4f8471",
				"rgb(101,154,113)",
				"rgb(122,175,113)",
				"rgb(144,197,113)",
				"rgb(165,218,113"]);

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

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
                    return color(d.process);
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

Funel.prototype = Object.create(Graphic.prototype);
