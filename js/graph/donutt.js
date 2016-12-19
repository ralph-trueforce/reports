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
    //this.name = arguments.callee.name.toLowerCase();

    //TODO: Should be a private function
    this.process = function (tag_id) {

        var _this = this;

        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width - this.margin.left - this.margin.right)
            .attr("height", this.height - this.margin.top - this.margin.bottom)
            .attr("font-family", _this.fontType)
            .attr("position", "relative");

        svg.append("g")
            .attr("class", "slices")
            .attr("stroke-width", 2);
        svg.append("g")
            .attr("class", "labelName");
        svg.append("g")
            .attr("class", "labelValue")
            .attr("font-size", _this.fontSize)
            .attr("opacity", .5);
        svg.append("g")
            .attr("class", "lines")
            .style("opacity", .3)
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .style("fill", "none");

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

        var div = d3.select(tag_id).append("div")
            .attr("class", "toolTip")
            .style("font-family", "Helvetica Neue")
            .style("position", "absolute")
            .style("display", "none")
            .style("width", "auto")
            .style("height", "auto")
            .style("background", "none")
            .style("border", "none")
            .style("border-radius", "8px")
            .style("box-shadow", "-3px 3px 15px #888888")
            .style("color", "black")
            .style("font-size", "12px")
            .style("padding", "5px")
            .style("text-align", "center");

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var colorRange = d3.scale.category20();
        var color = d3.scale.ordinal()
            .range(colorRange.range());

        var data = d3.json("data/datasetTotal.json", function (data) {
            data = _this.preData(null, data);
            change(data);
        });

        d3.selectAll("input")
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
                    div.style("left", d3.event.layerX + 10 + "px");
                    div.style("top", d3.event.layerY - 25 + "px");
                    div.style("display", "inline-block");
                    div.html((d.data.label) + "<br>" + (d.data.value) + "%");
                });
            slice
                .on("mouseout", function (d) {
                    div.style("display", "none");
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
                .text(function (d) {
                    return d;
                });

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labelName").selectAll("text")
                .attr("font-family", _this.fontType)
                .attr("font-size", _this.fontSize)
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
        }
    };
    this.getFooter = function() {
        return "<label><input type='radio' name='dataset' id='dataset' value='total' checked> Total</label>"+
        "<label><input type='radio' name='dataset' id='dataset'' value='option1'> Option 1</label>"+
        "<label><input type='radio' name='dataset' id='dataset' value='option2'> Option 2</label>";
    }
}
Donutt.prototype = Object.create(Cartesian.prototype);

/*

</script>
</body>

<script>

var config ={
    "width" : 960,
    "height" : 500,
    "margin": {
        "top": 30,
        "right": 120,
        "bottom": 0,
        "left": 120
    },
    "fontSize" : "10px",
    "fontType": "Sans Serif"
};

datasetTotal = [
    {label: "Category 1", value: 19},
    {label: "Category 2", value: 5},
    {label: "Category 3", value: 13},
    {label: "Category 4", value: 17},
    {label: "Category 5", value: 19},
    {label: "Category 6", value: 27}
];

datasetOption1 = [
    {label: "Category 1", value: 22},
    {label: "Category 2", value: 33},
    {label: "Category 3", value: 4},
    {label: "Category 4", value: 15},
    {label: "Category 5", value: 36},
    {label: "Category 6", value: 0}
];

datasetOption2 = [
    {label: "Category 1", value: 10},
    {label: "Category 2", value: 20},
    {label: "Category 3", value: 30},
    {label: "Category 4", value: 5},
    {label: "Category 5", value: 12},
    {label: "Category 6", value: 23}
];

*/
