/**
 * Class Donutt
 *
 * @param width
 * @param height
 * @constructor
 */

function Donutt(width, height) {
    this.base = Cartesian;
    this.base(width, height, arguments); //call super constructor.

    //TODO: Should be a private function
    this.process = function (tag_id) {

        var _this = this;

        var width = this.width - this.margin.left - this.margin.right - 20,//WORKAROUND: leyends are not in all the div
            height = this.height - this.margin.top - this.margin.bottom - 20;

        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width - this.margin.left - this.margin.right)
            .attr("height", this.height - this.margin.top - this.margin.bottom)
            .attr("font-family", _this.fontType)
            .attr("position", "relative");

        svg.append("g")
            .attr("class", "slices")
            .attr("stroke-width", this.slides_stroke_width);
        svg.append("g")
            .attr("class", "labelName");
        svg.append("g")
            .attr("class", "labelValue")
            .attr("font-size", _this.fontSize)
            .attr("opacity", this.labels_opacity);
        svg.append("g")
            .attr("class", "lines")
            .style("opacity", this.lines_opacity)
            .style("stroke", this.lines_stroke)
            .style("stroke-width", this.lines_stroke_width)
            .style("fill", this.lines_fill);

        radius = Math.min(width, height) / 2;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        var legendRectSize = (radius * 0.05);
        var legendSpacing = radius * 0.02;

        var tooltip = this.tooltip;
        var tooltip_div = d3.select(tag_id).append("div")
            .attr("class",        tooltip.name + this.id)
            .style("font-family", tooltip.font_family)
            .style("position",    tooltip.position)
            .style("display",     "none")
            .style("width",       tooltip.width)
            .style("height",      tooltip.height)
            .style("background",  tooltip.background_color)
            .style("border",      tooltip.border)
            .style("border-radius", tooltip.border_radius)
            .style("box-shadow",  tooltip.box_shadow)
            .style("color",       tooltip.color)
            .style("font-size",   tooltip.font_size)
            .style("padding",     tooltip.padding)
            .style("text-align",  tooltip.text_align);

		svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var colorRange = d3.scale.category20();
        var color = d3.scale.ordinal()
            .range(colorRange.range());

        var data = d3.json("data/datasetTotal.json", function (data) {
            data = _this.preData(null, data);
            change(data);
        });

		//d3.selectAll("#donutoption").attr("id", "donutoption" + this.id);
        d3.selectAll("#donutoption" + this.id)
            .on("change", selectDataset);

        function selectDataset() {
            var value = this.value;
            if (value == "total") {
                change(d3.json("data/datasetTotal.json", function (data) {
                    change(data);
                }));
            }
            else if (value == "option1") {
                change(d3.json("data/dataset1.json", function (data) {
                    change(data);
                }));
            }
            else if (value == "option2") {
                change(d3.json("data/dataset2.json", function (data) {
                    change(data)
                }));
            }
        }

        function change(data) {

            /* ------- PIE SLICES -------*/
            var slice = svg./*select(".slices").*/selectAll("path.slice")
                .data(pie(data), function (d) {
                    return d.data.label
                });

            slice.enter()
                .insert("path")
                .style("fill", function (d) {
                    return color(d.data.label);
                })
                .attr("class", "slice");

            slice
                .transition().duration(1000)
                .attrTween("d", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        return arc(interpolate(t));
                    };
                });
            slice
                .on("mousemove", function (d) {
					tooltip_div.style("left", d3.event.layerX + 10 + "px");
					tooltip_div.style("top", d3.event.layerY - 25 + "px");
					tooltip_div.style("display", "inline-block");
					tooltip_div.html((d.data.label) + "<br>" + (d.data.value) + "%");
                });
            slice
                .on("mouseout", function (d) {
					tooltip_div.style("display", "none");
                });

            slice.exit()
                .remove();

            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = -3 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color);

            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .attr("font-family", _this.fontType)
                .attr("font-size", _this.fontSize)
				.style("fill", _this.fontcolor)
                .text(function (d) {
                    return d;
                });

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labelName").selectAll("text")
                .data(pie(data), function (d) {
                    return d.data.label
                });

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .text(function (d) {
                    return (d.data.label + ": " + d.value + "%");
                });

            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            text
                .transition().duration(1000)
                .attrTween("transform", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                })
                .text(function (d) {
                    return (d.data.label + ": " + d.value + "%");
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), function (d) {
                    return d.data.label
                });

            polyline.enter()
                .append("polyline");

            polyline.transition().duration(1000)
                .attrTween("points", function (d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function (t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

            polyline.exit()
                .remove();

			text.style("font-size", _this.text_fonsize);
			text.style("font-family", _this.text_fontfamily);
			text.style("fill", _this.text_color);
        }
    };

    this.getFooter = function() {
        return (
			"<label><input type='radio' name='donutoption' id='donutoption" + this.id + "' value='total' checked> Total</label>"+
			"<label><input type='radio' name='donutoption' id='donutoption" + this.id + "' value='option1'> Option 1</label>"+
			"<label><input type='radio' name='donutoption' id='donutoption" + this.id + "' value='option2'> Option 2</label>"
		);
    }
}

Donutt.prototype = Object.create(Cartesian.prototype);
