/**
 * Created by raeioul on 11/23/16.
 */
function Sunburst(width, height) {
	this.base = Graphic;
	this.base(width, height); //call super constructor.
	//Graphic.call(width, height);

    this.draw = function (tag_id) {
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;


        var radius = Math.min(width, height) / 2,
            color = d3.scale.category20c();

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

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

        d3.json("data/flare.json", function (error, root) {
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
                    return color((d.children ? d : d.parent).name);
                })
                .style("fill-rule", "evenodd")
                .each(stash);

            d3.selectAll("input[name=\"sun_mode\"]").on("change", function change() {
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
                    .duration(1500)
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

        d3.select(self.frameElement).style("height", height + "px");

    };
    this.getFooter = function() {
        return "<form><label><input type='radio' name='sun_mode' value='size'> Size</label>" +
            "<label><input type='radio' name='sun_mode' value='count' checked> Count</label></form>";
    }
}

Sunburst.prototype = Object.create(Graphic.prototype);