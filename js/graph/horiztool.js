/**
 * Class Horiztool
 *
 * @param width
 * @param height
 * @constructor
 */

function Horiztool(width, height) {

    this.base = Cartesian;
    this.base(width, height); //call super constructor.
    this.name = arguments.callee.name.toLowerCase();

    //TODO: Should be a private function
    this.process = function (tag_id) {

        var _this = this;

        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;


        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1);

        var x = d3.scale.linear()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10, "%");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var color = d3.scale.category20c();

        var svg = d3.select(tag_id).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        d3.select(tag_id).style("background-color", this.config.background_color);

        d3.json("data/datax.json", function (error, data) {
            x.domain([0, d3.max(data, function (d) {
                return d.frequency;
            })]);
            y.domain(data.map(function (d) {
                return d.letter;
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .attr("font-size", _this.config.fontSize)
                .attr("font-family", _this.config.fontType)
                .call(xAxis)
                .append("text")
                .attr("transform", "rotate(0)")
                .attr("y", 6)
                .attr("dy", "1.91em")
                .style("text-anchor", "start")
                .style("font-size", _this.config.fontSize)
                .text("Frequency");

            svg.append("g")
                .attr("class", "y axis")
                .attr("font-size", _this.config.fontSize)
                .attr("font-family", _this.config.fontType)
                .call(yAxis);

            svg.select(".y.axis path")
                .attr("display", "none");

            svg.select(".axis path")
                .style("fill", "none")
                .style("stroke", "black")
                .style("shape-rendering", "crispEdges");

            var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar");

            bars.attr("y", function (d) {
                return y(d.letter);
            })
                .attr("height", y.rangeBand())
                .attr("x", 0)//function(d) {
                //return x(d.frequency);
                //})
                .attr("width", function (d) {
                    return x(d.frequency);
                })
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("id", function (d, i) {
                    return i;
                })
                .on("mouseover", function () {
                    d3.select(this)
                        .attr("fill", _this.config.barfillColor);
                })
                .on("mouseout", function (d, i) {
                    d3.select(this).attr("fill", function () {
                        return "" + color(this.id) + "";
                    });
                });

            bars.append("title")
                .text(function (d) {
                    return d.letter + ":" + Math.round(d.frequency * 100) + "%";
                });

        });

        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
    }
}

Horiztool.prototype = Object.create(Cartesian.prototype);