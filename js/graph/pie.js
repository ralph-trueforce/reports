/**
 * Class Pie
 *
 * @param width
 * @param height
 * @constructor
 */
function Pie(width, height) {
	this.base = Round;
	this.base(width, height, arguments); //call super constructor.
	//this.name = arguments.callee.name.toLowerCase();
	//this.source = 'data/pie.json';

	//TODO: Should be a private function
	this.process = function(tag_id) {

		var _this = this;

		var arc = d3.svg.arc()
			.outerRadius(this.radius - 10)
			.innerRadius(this.radius - this.radius);

		var labelArc = d3.svg.arc()
			.outerRadius(this.radius - 40)
			.innerRadius(this.radius - 40);

		var arcOver = d3.svg.arc()
			.outerRadius(this.radius + 5)
			.innerRadius(5);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function (d) {
				return d.value;
			});

		var svg = d3.select(tag_id).append("svg")
			.attr("width",  this.width)
			.attr("height", this.height)
			.append("g")
			.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

		d3.select(tag_id).style("background-color", this.background_color);

		//Tooltip needs to be refactor, must be as a lib for all the graphs
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

		//Json data input
		d3.json(this.source, function (error, data) {
			data = _this.preData(error, data);

			var config_slice = _this.slice;
			var g = svg.selectAll(".arc")
				.data(pie(data))
				.enter()
				.append("g")
				.attr("class", "arc")
				.on("mouseover", function (d) {
					d3.select(this).select("path").transition()
						.duration(config_slice.mouseover.duration)
						.attr("d", arcOver);

					d3.select(config_slice.mouseover.elements[0].id + _this.id)
						.style("left", d3.event.layerX + "px")
						.style("top",  d3.event.layerY + "px")
						.style("display", config_slice.mouseover.elements[0].style.display)
						.select(config_slice.mouseover.elements[1].id)
						.html("<p>Age: " + d.data.process + "<br/> Population: " + d.data.value + "</p>");//TODO: needs you know what
				})
				.on("mouseout", function (d) {
					d3.select(this).select("path").transition()
						.duration(config_slice.mouseout.duration)
						.attr("d", arc);

					d3.select(config_slice.mouseout.elements[0].id + _this.id)
						.style("display", config_slice.mouseout.elements[0].style.display);
				});

			g.append("path")
				.attr("d", arc)
				.style("fill", function (d) {
					return _this.color(d.data.process);
				});

			g.append("text")
				.attr("transform", function (d) {
					return "translate(" + labelArc.centroid(d) + ")";
				})
				.attr("dy", config_slice.text.dy)
				.style("font-family", config_slice.text.font_family)
				.style("font-size",   config_slice.text.font_size)
				.style("fill",        config_slice.text.font_color)
				.text(function (d) {
					return d.data.process;
				});
		});
	};

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-print\"></span> <a href=\"http://www.trueforce.com\">www.trueforce.com</a>";
    }
}

Pie.prototype = Object.create(Round.prototype);
