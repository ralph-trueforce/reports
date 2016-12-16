/**
 * Created by raeioul on 11/22/16.
 */

/**
 *
 * @param width
 * @param height
 * @constructor
 */
function Hierarchical(width, height) {
	this.base = Cartesian;
	this.base(width, height, arguments); //call super constructor.
	//this.name = arguments.callee.name.toLowerCase();

    /**
     * Draw function member
     * @param tag_id
     */
    this.process = function(tag_id) {
    	var _this = this;
        // Set the dimensions of the canvas / graph
        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var partition = d3.layout.partition()
            .value(function (d) {
                return d.size;
            });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		d3.select(tag_id).style("background-color", this.background_color);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", up);

        svg.append("g")
            .attr("class", "x axis");

        svg.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("y1", "100%");

        d3.json("data/hierarchical.json", function (error, root) {
			if (error) {
				throw error;
			}

			localStorage[_this.source] = JSON.stringify(root);

            partition.nodes(root);
            x.domain([0, root.value]).nice();
            down(root, 0);
        });

        function down(d, i) {
            if (!d.children || this.__transition__) return;
            var end = _this.duration + d.children.length * _this.delay;

            // Mark any currently-displayed bars as exiting.
            var exit = svg.selectAll(".enter")
                .attr("class", "exit");

            // Entering nodes immediately obscure the clicked-on bar, so hide it.
            exit.selectAll("rect").filter(function (p) {
                return p === d;
            })
                .style("fill-opacity", 1e-6);

            // Enter the new bars for the clicked-on data.
            // Per above, entering bars are immediately visible.
            var enter = bar(d)
                .attr("transform", stack(i))
                .style("opacity", 1);

            // Have the text fade-in, even though the bars are visible.
            // Color the bars as parents; they will fade to children if appropriate.
            enter.select("text").style("fill-opacity", 1e-6);
            enter.select("rect").style("fill", _this.color(true));

            // Update the x-scale domain.
            x.domain([0, d3.max(d.children, function (d) {
                return d.value;
            })]).nice();

            // Update the x-axis.
            svg.selectAll(".x.axis").transition()
                .duration(_this.duration)
                .call(xAxis);

            // Transition entering bars to their new position.
            var enterTransition = enter.transition()
                .duration(_this.duration)
                .delay(function (d, i) {
                    return i * _this.delay;
                })
                .attr("transform", function (d, i) {
                    return "translate(0," + _this.barHeight * i * 1.2 + ")";
                });

            // Transition entering text.
            enterTransition.select("text")
                .style("fill-opacity", 1);

            // Transition entering rects to the new x-scale.
            enterTransition.select("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .style("fill", function (d) {
                    return _this.color(!!d.children);
                });

            // Transition exiting bars to fade out.
            var exitTransition = exit.transition()
                .duration(_this.duration)
                .style("opacity", 1e-6)
                .remove();

            // Transition exiting bars to the new x-scale.
            exitTransition.selectAll("rect")
                .attr("width", function (d) {
                    return x(d.value);
                });

            // Rebind the current node to the background.
            svg.select(".background")
                .datum(d)
                .transition()
                .duration(end);

            d.index = i;
        }

        function up(d) {
            if (!d.parent || this.__transition__) return;
            var end = _this.duration + d.children.length * _this.delay;

            // Mark any currently-displayed bars as exiting.
            var exit = svg.selectAll(".enter")
                .attr("class", "exit");

            // Enter the new bars for the clicked-on data's parent.
            var enter = bar(d.parent)
                .attr("transform", function (d, i) {
                    return "translate(0," + _this.barHeight * i * 1.2 + ")";
                })
                .style("opacity", 1e-6);

            // Color the bars as appropriate.
            // Exiting nodes will obscure the parent bar, so hide it.
            enter.select("rect")
                .style("fill", function (d) {
                    return _this.color(!!d.children);
                })
                .filter(function (p) {
                    return p === d;
                })
                .style("fill-opacity", 1e-6);

            // Update the x-scale domain.
            x.domain([0, d3.max(d.parent.children, function (d) {
                return d.value;
            })]).nice();

            // Update the x-axis.
            svg.selectAll(".x.axis").transition()
                .duration(_this.duration)
                .call(xAxis);

            // Transition entering bars to fade in over the full duration.
            var enterTransition = enter.transition()
                .duration(end)
                .style("opacity", 1);

            // Transition entering rects to the new x-scale.
            // When the entering parent rect is done, make it visible!
            enterTransition.select("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .each("end", function (p) {
                    if (p === d) d3.select(this).style("fill-opacity", null);
                });

            // Transition exiting bars to the parent's position.
            var exitTransition = exit.selectAll("g").transition()
                .duration(_this.duration)
                .delay(function (d, i) {
                    return i * _this.delay;
                })
                .attr("transform", stack(d.index));

            // Transition exiting text to fade out.
            exitTransition.select("text")
                .style("fill-opacity", 1e-6);

            // Transition exiting rects to the new scale and fade to parent color.
            exitTransition.select("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .style("fill", _this.color(true));

            // Remove exiting nodes when the last child has finished transitioning.
            exit.transition()
                .duration(end)
                .remove();

            // Rebind the current parent to the background.
            svg.select(".background")
                .datum(d.parent)
                .transition()
                .duration(end);
        }

// Creates a set of bars for the given data node, at the specified index.
        function bar(d) {
            var bar = svg.insert("g", ".y.axis")
                .attr("class", "enter")
                .attr("transform", "translate(0,5)")
                .selectAll("g")
                .data(d.children)
                .enter().append("g")
                .style("cursor", function (d) {
                    return !d.children ? null : "pointer";
                })
                .on("click", down);

            bar.append("text")
                .attr("x", -6)
                .attr("y", _this.barHeight / 2)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d.name;
                });

            bar.append("rect")
                .attr("width", function (d) {
                    return x(d.value);
                })
                .attr("height", _this.barHeight);

            return bar;
        }

// A stateful closure for stacking bars horizontally.
        function stack(i) {
            var x0 = 0;
            return function (d) {
                var tx = "translate(" + x0 + "," + _this.barHeight * i * 1.2 + ")";
                x0 += x(d.value);
                return tx;
            };
        }

    };
}

Hierarchical.prototype = Object.create(Cartesian.prototype);
