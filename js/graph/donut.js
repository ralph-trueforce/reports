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
	this.base = Graphic;
	this.base(width, height); //call super constructor.
	//Graphic.call(width, height);

    /**
     * Draw member function
     *
     * @param tag_id
     */
    this.draw = function(tag_id) {

        var radius = Math.min(this.width, this.height) / 2;
        var color = d3.scale.category20();
        var pie = d3.layout.pie()
			.value(function(d) {
				return d.count;
			})
			.sort(null);
        var arc = d3.svg.arc()
			.innerRadius(radius - 10)
			.outerRadius(radius - 70);

        var legendRectSize = 18;
        var legendSpacing = 4;

        //Creates svg canvas
        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

		d3.json("data/donut.json", function(error, dataset) {
			if (error) throw error;

			var path = svg.selectAll("path")
				.data(pie(dataset))
				.enter().append("path")
				.attr("fill", function (d, i) {
					return color(d.data.label);
				})
				.attr("d", arc);
			path.append("text")
				.attr("transform", function (d) {
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("text-anchor", "middle")
				.text(function (d) {
					return d.value / 1000;
				});
			var legend = svg.selectAll('.legend')
				.data(color.domain())
				.enter()
				.append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) {
					var height = legendRectSize + legendSpacing;
					var offset =  height * color.domain().length / 2;
					var horz = -2 * legendRectSize;
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
				.text(function(d) { return d; });
		});
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-home\"></span> See also <a href=\"https://www.domo.com\">https://www.domo.com</a>";
    }
}

Donut.prototype = Object.create(Graphic.prototype);
