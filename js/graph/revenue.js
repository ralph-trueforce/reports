/**
 * Created by raeioul on 11/22/16.
 */

/**
 * Class Revenue
 *
 * @param width
 * @param height
 * @constructor
 */
function Revenue(width, height) {
	this.base = Cartesian;
	this.base(width, height, arguments); //call super constructor.

    /**
     * process function member
     * @param tag_id
     */
    this.process = function(tag_id) {
    	var _this = this;
        // Set the dimensions of the canvas / graph
        var w = this.width - this.margin.left - this.margin.right,
            h = this.height - this.margin.top - this.margin.bottom;

		//Set up stack method
        var stack = d3.layout.stack();
		d3.select(tag_id).style("background-color", this.background_color);

        d3.json(this.source, function (dataset) {
			dataset = _this.preData(null, dataset);

            //Data, stacked
            stack(dataset);

            //Set up scales
            var xScale = d3.time.scale()
                .domain([new Date(dataset[0][0].time), d3.time.day.offset(new Date(dataset[0][dataset[0].length - 1].time), 8)])
                .rangeRound([0, w - _this.padding.left - _this.padding.right]);

            var yScale = d3.scale.linear()
                .domain([0,
                    d3.max(dataset, function (d) {
                        return d3.max(d, function (d) {
                            return d.y0 + d.y;
                        });
                    })
                ])
                .range([h - _this.padding.bottom - _this.padding.top, 0]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(d3.time.days, 1);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10);

            //Easy colors accessible via a 10-step ordinal scale
            //var colors = d3.scale.category10();

            //Create SVG element
            var svg = d3.select(tag_id)
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            // Add a group for each row of data
            var groups = svg.selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("class", "rgroups")
                .attr("transform", "translate(" + _this.padding.left + "," + (h - _this.padding.bottom) + ")")
                .style("fill", function (d, i) {
                    return _this.color_hash[dataset.indexOf(d)][1];
                });

            // Add a rect for each data value
            var rects = groups.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("rect")
                .attr("width", 2)
                .style("fill-opacity", 1e-6);


            rects.transition()
                .duration(function (d, i) {
                    return _this.rects_transition_duration * i;
                })
                .ease("linear")
                .attr("x", function (d) {
                    return xScale(new Date(d.time));
                })
                .attr("y", function (d) {
                    return -(-yScale(d.y0) - yScale(d.y) + (h - _this.padding.top - _this.padding.bottom) * 2);
                })
                .attr("height", function (d) {
                    return -yScale(d.y) + (h - _this.padding.top - _this.padding.bottom);
                })
                .attr("width", 15)
                .style("fill-opacity", 1);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(40," + (h - _this.padding.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + _this.padding.left + "," + _this.padding.top + ")")
                .call(yAxis);

            // adding legend

            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("x", w - _this.padding.right - 65)
                .attr("y", 25)
                .attr("height", 100)
                .attr("width", 100);

            legend.selectAll("g").data(dataset)
                .enter()
                .append('g')
                .each(function (d, i) {
                    var g = d3.select(this);
                    g.append("rect")
                        .attr("x", w - _this.padding.right - 65)
                        .attr("y", i * 25 + 10)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", _this.color_hash[String(i)][1]);

                    g.append("text")
                        .attr("x", w - _this.padding.right - 50)
                        .attr("y", i * 25 + 20)
                        .attr("height", 30)
                        .attr("width", 100)
                        .style("fill", _this.color_hash[String(i)][1])
                        .text(_this.color_hash[String(i)][0]);
                });

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - 5)
                .attr("x", 0 - (h / 2))
                .attr("dy", "1em")
                .text("Number of Messages");

            svg.append("text")
                .attr("class", "xtext")
                .attr("x", w / 2 - _this.padding.left)
                .attr("y", h - 5)
                .attr("text-anchor", "middle")
                .text("Days");

            //On click, update with new data
            d3.selectAll(".mo" + _this.id).on("click", function () {

                var date = this.getAttribute("value");
                var str = "data/" + date + ".json";

                d3.json(str, function (dataset) {

					stack(dataset);

					xScale.domain([new Date(0, 0, 0, dataset[0][0].time, 0, 0, 0), new Date(0, 0, 0, dataset[0][dataset[0].length - 1].time, 0, 0, 0)])
						.rangeRound([0, w - _this.padding.left - _this.padding.right]);

					yScale.domain([0,
						d3.max(dataset, function (d) {
							return d3.max(d, function (d) {
								return d.y0 + d.y;
							});
						})
					])
						.range([h - _this.padding.bottom - _this.padding.top, 0]);

					xAxis.scale(xScale)
						.ticks(d3.time.hour, 2)
						.tickFormat(d3.time.format("%H"));

					yAxis.scale(yScale)
						.orient("left")
						.ticks(10);

					groups = svg.selectAll(".rgroups")
						.data(dataset);

					groups.enter().append("g")
						.attr("class", "rgroups")
						.attr("transform", "translate(" + _this.padding.left + "," + (h - _this.padding.bottom) + ")")
						.style("fill", function (d, i) {
							return color(i);
						});

					rect = groups.selectAll("rect")
						.data(function (d) {
							return d;
						});

					rect.enter()
						.append("rect")
						.attr("x", w)
						.attr("width", 1)
						.style("fill-opacity", 1e-6);

					rect.transition()
						.duration(_this.transition_duration)
						.ease("linear")
						.attr("x", function (d) {
							return xScale(new Date(0, 0, 0, d.time, 0, 0, 0));
						})
						.attr("y", function (d) {
							return -(-yScale(d.y0) - yScale(d.y) + (h - _this.padding.top - _this.padding.bottom) * 2);
						})
						.attr("height", function (d) {
							return -yScale(d.y) + (h - _this.padding.top - _this.padding.bottom);
						})
						.attr("width", 15)
						.style("fill-opacity", 1);

					rect.exit()
						.transition()
						.duration(_this.transition_duration)
						.ease("circle")
						.attr("x", w)
						.remove();

					groups.exit()
						.transition()
						.duration(_this.transition_duration)
						.ease("circle")
						.attr("x", w)
						.remove();


					svg.select(".x.axis")
						.transition()
						.duration(_this.transition_duration)
						.ease("circle")
						.call(xAxis);

					svg.select(".y.axis")
						.transition()
						.duration(_this.transition_duration)
						.ease("circle")
						.call(yAxis);

					svg.select(".xtext")
						.text("Hours");

					d3.select("widget-footer div.box-link div#revenue-text" + _this.id).html("Number of messages per hour on " + date + ".");

				});
			});

			var text = svg.selectAll("text");
			text.style("font-size", _this.text_fonsize);
			text.style("font-family", _this.text_fontfamily);
			text.style("fill", _this.text_color);
			svg.selectAll(".x.axis").selectAll('path').style("fill",   _this.axis_backcolor);
			svg.selectAll(".x.axis").selectAll('path').style("stroke", _this.axis_color);
			svg.selectAll(".y.axis").selectAll('path').style("fill",   _this.axis_backcolor);
			svg.selectAll(".y.axis").selectAll('path').style("stroke", _this.axis_color);
        });
    };

    this.getFooter = function() {

        return "<div id='revenue-text" + this.id + "' style='float: left; text-decoration: underline;'>Number of messages per day.</div>" +
			"<div class='btn-group pull-right dropup'>" +
            "<button type='button' class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>Messages per hour <span class='caret'></span></button>" +
			"<ul class='dropdown-menu' role='menu'>" +
            "<li><a class='mo" + this.id + "' value='2014-02-19' >2014-02-19</a></li>" +
			"<li><a class='mo" + this.id + "' value='2014-02-20' >2014-02-20</a></li>" +
            "<li><a class='mo" + this.id + "' value='2014-02-21' >2014-02-21</a></li>" +
			"<li><a class='mo" + this.id + "' value='2014-02-22' >2014-02-22</a></li>" +
            "<li><a class='mo" + this.id + "' value='2014-02-23' >2014-02-23</a></li>" +
			"</ul>" +
			"</div>";
    }
}

Revenue.prototype = Object.create(Cartesian.prototype);
