/**
 * Created by raeioul on 11/22/16.
 */

function Stacked(width, height) {
	this.base = Cartesian;
	this.base(width, height, arguments); //call super constructor.

    this.process = function (tag_id) {
    	var _this = this;

        var parseDate = d3.time.format("%Y-%m").parse,
            formatYear = d3.format("02d"),
            formatDate = function (d) {
                return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100);
            };

        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

        var y0 = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .2);

        var y1 = d3.scale.linear();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, 0);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(formatDate);

        var nest = d3.nest()
            .key(function (d) {
                return d.group;
            });

        var stack = d3.layout.stack()
            .values(function (d) {
                return d.values;
            })
            .x(function (d) {
                return d.date;
            })
            .y(function (d) {
                return d.value;
            })
            .out(function (d, y0) {
                d.valueOffset = y0;
            });

        this.color = d3.scale.category10();

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width + this.margin.left + this.margin.right)
            .attr("height", height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		d3.select(tag_id).style("background-color", this.background_color);

        d3.json(this.source, function (error, data) {
			data = _this.preData(error, data);

            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.value = +d.value;
            });

            var dataByGroup = nest.entries(data);

            stack(dataByGroup);
            x.domain(dataByGroup[0].values.map(function (d) {
                return d.date;
            }));
            y0.domain(dataByGroup.map(function (d) {
                return d.key;
            }));
            y1.domain([0, d3.max(data, function (d) {
                return d.value;
            })]).range([y0.rangeBand(), 0]);

            var group = svg.selectAll(".group")
                .data(dataByGroup)
                .enter().append("g")
                .attr("class", "group")
                .attr("transform", function (d) {
                    return "translate(0," + y0(d.key) + ")";
                });

            group.append("text")
                .attr("class", "group-label")
                .attr("x", -6)
                .attr("y", function (d) {
                    return y1(d.values[0].value / 2);
                })
                .attr("dy", ".35em")
                .text(function (d) {
                    return "Group " + d.key;
                });

            group.selectAll("rect")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("rect")
                .style("fill", function (d) {
                    return _this.color(d.group);
                })
                .attr("x", function (d) {
                    return x(d.date);
                })
                .attr("y", function (d) {
                    return y1(d.value);
                })
                .attr("width", x.rangeBand())
                .attr("height", function (d) {
                    return y0.rangeBand() - y1(d.value);
                });

            group.filter(function (d, i) {
                return !i;
            }).append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + y0.rangeBand() + ")")
                .call(xAxis);

            d3.selectAll("input[name='stacked_mode" + _this.id + "']").on("change", change);

            var timeout = setTimeout(function () {
                d3.select("input[name='stacked_mode" + _this.id + "'][value='stacked']").property("checked", true).each(change);
            }, _this.timeout);

			var text = svg.selectAll(".tick").selectAll("text");
			text.style("font-size", _this.text_fonsize);
			text.style("font-family", _this.text_fontfamily);
			text.style("fill", _this.text_color);
			svg.selectAll(".x.axis").selectAll('path').style("fill",   _this.axis_backcolor);
			svg.selectAll(".x.axis").selectAll('path').style("stroke", _this.axis_color);
			svg.selectAll('text.group-label').style("fill", _this.group_color);

            function change() {
                clearTimeout(timeout);
                if (this.value === "multiples") {
                    transitionMultiples();
                } else {
                    transitionStacked();
                }
            }

            function transitionMultiples() {
                var t = svg.transition().duration(_this.transition),
                    g = t.selectAll(".group").attr("transform", function (d) {
                        return "translate(0," + y0(d.key) + ")";
                    });
                g.selectAll("rect").attr("y", function (d) {
                    return y1(d.value);
                });
                g.select(".group-label").attr("y", function (d) {
                    return y1(d.values[0].value / 2);
                })
            }

            function transitionStacked() {
                var t = svg.transition().duration(_this.transition),
                    g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
                g.selectAll("rect").attr("y", function (d) {
                    return y1(d.value + d.valueOffset);
                });
                g.select(".group-label").attr("y", function (d) {
                    return y1(d.values[0].value / 2 + d.values[0].valueOffset);
                })
            }
        });
    };

    this.getFooter = function() {
        return (
			"<form><label><input type='radio' name='stacked_mode" + this.id + "' value='multiples' checked> Multiples</label>" +
            "<label><input type='radio' name='stacked_mode" + this.id + "' value='stacked'> Stacked</label></form>"
		);
    }

}

Stacked.prototype = Object.create(Graphic.prototype);
