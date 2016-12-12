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
	this.base(width, height); //call super constructor.
	this.name = arguments.callee.name.toLowerCase();

    this.process = function (tag_id) {
    	var _this = this;

		this.color = d3.scale.category20c();

        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        var partition = d3.layout.partition()
            .sort(null)
            .size([2 * Math.PI, radius * radius])
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

        d3.json("data/sunburst.json", function (error, root) {
            if (error) throw error;

            var path = svg.datum(root).selectAll("path")
                .data(partition.nodes)
                .enter().append("path")
                .attr("display", function (d) {
                    return d.depth ? null : "none";
                }) // hide inner ring
                .attr("d", arc)
                .style("stroke", "#fff")
                .style("fill", function (d) {
                    return _this.color((d.children ? d : d.parent).name);
                })
                .style("fill-rule", "evenodd")
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
						.duration(_this.config.transition)
						.attrTween("d", arcTween);
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
        d3.select(self.frameElement).style("height", this.height + "px");
    };

    this.getFooter = function() {
        return "<form><label><input type='radio' name='sun_mode' value='size'> Size</label>" +
            "<label><input type='radio' name='sun_mode' value='count' checked> Count</label></form>";
    }
}

Sunburst.prototype = Object.create(Round.prototype);
