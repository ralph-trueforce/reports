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
    this.prototype = new Graphic(width, height);

    /**
     * Draw member function
     *
     * @param tag_id
     */
    this.draw = function(tag_id) {
        var dataset = [{ label: 'Prospecting', count: 3}, { label: 'Quallification',count:26}, { label: 'Needs Analisys',count:8}, { label: 'Value Proposition',count:2}, { label: 'Vista',count:9}, { label: 'Dismiss',count:9}, { label: 'management',count:14}];

        var radius = Math.min(this.prototype.width, this.prototype.height) / 2;
        var color = d3.scale.category20();
        var pie = d3.layout.pie().value(function(d) { return d.count; }).sort(null);
        var arc = d3.svg.arc().innerRadius(radius - 10).outerRadius(radius - 70);
        var legendRectSize = 18;
        var legendSpacing = 4;
        //Creates svg canvas
        var svg = d3.select(tag_id)
            .append("svg")
            .attr("width", this.prototype.width)
            .attr("height", this.prototype.height)
            .append("g")
            .attr("transform", "translate(" + this.prototype.width / 2 + "," + this.prototype.height / 2 + ")");
        var path = svg.selectAll("path")
            .data(pie(dataset))
            .enter().append("path")
            .attr("fill", function (d, i) {
                return color(d.data.label);
            })
            .attr("d", arc);
        path.append("text")
            .attr("transform", function (d) {
                //console.log(d);
                //console.log(arc.centroid(d));
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
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-home\"></span> See also <a href=\"https://www.domo.com\">https://www.domo.com</a>";
    }
}