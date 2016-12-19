/**
 * Created by ralph on 11/18/16.
 */

/**
 * Donut class
 *
 * @param width
 * @param height
 * @constructor
 */
function Donut(width, height) {
	this.base = Round;
	this.base(width, height, arguments); //call super constructor.
	//this.name = arguments.callee.name.toLowerCase();
	//this.source = 'data/donut.json';

    /**
     * Process member function
     *
     * @param tag_id
     */
    this.process = function(tag_id) {

		var _this = this;

        var pie = d3.layout.pie()
			.value(function(d) {
				return d.value;
			})
			.sort(null);

        var arc = d3.svg.arc()
			.innerRadius(this.radius - this.inner_radius)
			.outerRadius(this.radius - this.outer_radius);

		var arcOver = d3.svg.arc()
			.innerRadius(this.radius - this.inner_radius + 10)
			.outerRadius(this.radius - this.outer_radius + 10);

        //Creates svg canvas
        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

		d3.select(tag_id).style("background-color", this.background_color);

		var tooltip_config = this.tooltip;
		var tooltip = d3.select(tag_id).append("div")
			.attr("id",        tooltip_config.name + this.id)
			.style("position", tooltip_config.position)
			.style("width",    tooltip_config.width)
			.style("height",   tooltip_config.height)
			.style("padding",  tooltip_config.padding)
			.style("background-color", tooltip_config.background_color)
			.style("border",   tooltip_config.border)
			.attr("class",     tooltip_config.classname)
			.style("display",  tooltip_config.display)
			.style("opacity",  tooltip_config.opacity);

		var p_config = tooltip_config.paragraph;
		var tooltipP = tooltip.append("p")
			.style("margin",      p_config.margin)
			.style("font-family", p_config.font_family)
			.style("font-size",   p_config.font_size)
			.style("line-height", p_config.line_height);

		var span_config = p_config.span;
		tooltipP.append("span")
			.attr("id", span_config.id)
			.style("color", span_config.color);

		d3.json(this.source, function(error, dataset) {
			dataset = _this.preData(error, dataset);

			var path = svg.selectAll("path")
				.data(pie(dataset))
				.enter()
				.append("path")
				.attr("fill", function (d, i) {
                    return _this.color(d.data.process);
				})
				.attr("d", arc);

			path.append("text")
				.attr("transform", function (d) {
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("text-anchor", "middle")
				.text(function (d) {
					return d.value / 10;
				});

			var config_slice = _this.slice;
			path.on("mouseover", function (d) {
					d3.select(this).transition()
						.duration(config_slice.mouseover.duration)
						.attr("d", arcOver);

					tooltip.style("left", d3.event.layerX + "px")
						.style("top",  d3.event.layerY + "px")
						.style("display", config_slice.mouseover.elements[0].style.display)
						.select(config_slice.mouseover.elements[1].id)
						.html("<p>Asset: " + d.data.process + "<br/> Count: " + d.data.value + "</p>");//TODO: needs you know what
				})
				.on("mouseout", function (d) {
					d3.select(this).transition()
						.duration(config_slice.mouseout.duration)
						.attr("d", arc);

					tooltip.style("display", config_slice.mouseout.elements[0].style.display);
				});


			var legend = svg.selectAll('.legend')
				.data(_this.color.domain())
				.enter()
				.append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) {
					var height = _this.legendRectSize + _this.legendSpacing;
					var offset =  height * _this.color.domain().length / 2;
					var horz = -2 * _this.legendRectSize;
					var vert = i * height - offset;
					return 'translate(' + horz + ',' + vert + ')';
				});

			legend.append('rect')
				.attr('width', _this.legendRectSize)
				.attr('height', _this.legendRectSize)
				.style('fill', _this.color)
				.style('stroke', _this.color);

			legend.append('text')
				.attr('x', _this.legendRectSize + _this.legendSpacing)
				.attr('y', _this.legendRectSize - _this.legendSpacing)
				.text(function(d) { return d; });
		});
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-home\"></span> See also <a href=\"https://www.domo.com\">https://www.domo.com</a>";
    }
}

Donut.prototype = Object.create(Round.prototype);
