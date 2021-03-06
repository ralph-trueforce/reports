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
	this.base(width, height, arguments); //call super constructor.
	// this.name = arguments.callee.name.toLowerCase();
	// this.source = 'data/funel.json';
	// this.config_filename = this.name + '.config';

    this.process = function (tag_id) {

		var _this = this;

        var width = this.width - 20,
            height = this.height - 10;

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

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

            var cache_color;
            var g = svg.selectAll(".funnel-group")
                .data(funnel(data))
                .enter().append("g")
                .attr("class", "funnel-group")
				.on("mouseover", function (d) {
					cache_color = d3.select(this).style("fill");
					var colour = d3.rgb(cache_color);
					d3.select(this)
						.style("fill", "rgba(" + colour.r + ", " + colour.g + ", " + colour.b + ", 0.8)");
					tooltip
						.style("top", d3.event.layerY + "px")
						.style("left", d3.event.layerX + "px")
						.style("display", "block")
						.html("<p>" + d.process +": "+d.value+ "</p>");
				})
				.on("mouseout", function (d) {
					d3.select(this).style("fill", cache_color);
					tooltip
						.style("display", "none");
				});

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
