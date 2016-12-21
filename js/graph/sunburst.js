/**
 * Created by raeioul on 11/23/16.
 */

/**
 * Class Sunburst
 *
 * @param width
 * @param height
 * @constructor
 */
function Sunburst(width, height) {
	this.base = Round;
	this.base(width, height, arguments); //call super constructor.

    this.process = function (tag_id) {
    	var _this = this;

		var width = this.width - this.margin.left - this.margin.right,
			height = this.height - this.margin.top - this.margin.bottom;

		this.color = d3.scale.category20c();
		this.radius = Math.min(width, height) / 2;

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var partition = d3.layout.partition()
            .sort(null)
            .size([2 * Math.PI, this.radius * this.radius])
            .value(function (d) {
                return 1;
            });

        var arc = d3.svg.arc()
            .startAngle(function (d) {
                return d.x;
            })
            .endAngle(function (d) {
                return d.x + d.dx;
            })
            .innerRadius(function (d) {
                return Math.sqrt(d.y);
            })
            .outerRadius(function (d) {
                return Math.sqrt(d.y + d.dy);
            });

		var tooltip = this.tooltip;
		var tooltip_div = d3.select(tag_id).append("div")
			.attr("class",        tooltip.name + this.id)
			.style("position",    tooltip.position)
			.style("text-align",  tooltip.text_align)
			.style("width",       tooltip.width)
			.style("height",      tooltip.height)
			.style("font-family", tooltip.font_family)
			.style("font-size",   tooltip.font_size)
			.style("background",  tooltip.background_color)
			.style("border",      tooltip.border)
			.style("border-radius",  tooltip.border_radius)
			.style("pointer-events", tooltip.pointer_events)
			.style("opacity", 0);

        d3.json(this.source, function (error, root) {
			root = _this.preData(error, root);

            var path = svg.datum(root).selectAll("path")
                .data(partition.nodes)
                .enter().append("path")
                .attr("display", function (d) {
                    return d.depth ? null : "none";
                }) // hide inner ring
                .attr("d", arc)
                .style("stroke", _this.stroke)
				.style("stroke-width", _this.strokeWidth)
                .style("fill", function (d) {
                    return _this.color((d.children ? d : d.parent).name);
                })
                .style("fill-rule", _this.fill_role)
                .each(stash);

            d3.selectAll("input[name=\"sun_mode\"]")
				.on("change", function change() {
					var value = this.value === "count"
						? function () {
						return 1;
					}
						: function (d) {
						return d.size;
					};
					path
						.data(partition.value(value).nodes)
						.transition()
						.duration(_this.transition)
						.attrTween("d", arcTween);
				});

            path
				.on("mouseover",function(data) {
					var object = (data.children ? data : data.parent);
					var html = "Name: " + object.name + "<br/>" + (data.size?('size: ' + data.size):('children: ' + data.value));

					tooltip_div
						.transition()
						.duration(200)
						.style("opacity", _this.tooltip.opacity);
					tooltip_div
						.html(html)
						.style("left", (d3.event.layerX) + "px")
						.style("top", (d3.event.layerY - 28) + "px");
				})
				.on("mouseout",function(data) {
					tooltip_div
						.transition()
						.duration(500)
						.style("opacity", 0);
				});
        });

        // Stash the old values for transition.
        function stash(d) {
            d.x0 = d.x;
            d.dx0 = d.dx;
        }

		// Interpolate the arcs in data space.
        function arcTween(a) {
            var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
            return function (t) {
                var b = i(t);
                a.x0 = b.x;
                a.dx0 = b.dx;
                return arc(b);
            };
        }
        d3.select(self.frameElement).style("height", height + "px");
    };

    this.getFooter = function() {
        return "<form><label><input type='radio' name='sun_mode' value='size'> Size</label>" +
            "<label><input type='radio' name='sun_mode' value='count' checked> Count</label></form>";
    }
}

Sunburst.prototype = Object.create(Round.prototype);
