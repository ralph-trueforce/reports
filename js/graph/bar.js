
function Bar(width, height) {
    this.prototype = new Graphic(width, height);


    this.draw = function (tag_id) {
        var margin = { top: 20, right: 20, bottom: 70, left: 40 },
            width = this.prototype.width - margin.left - margin.right,
            height = this.prototype.height - margin.top - margin.bottom;


        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            ;

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/dataBar.csv", function (error, data) {

            data.forEach(function (d) {
                //d.date = parseDate(d.date);
                d.population = +d.population;
            });

            x.domain(data.map(function (d) { return d.age; }));
            y.domain([0, d3.max(data, function (d) { return d.population; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                ;

            svg.selectAll("bar")
                .data(data)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function (d) { return x(d.age); })
                .attr("width", x.rangeBand())
                .attr("y", function (d) { return y(d.population); })
                .attr("height", function (d) { return height - y(d.population); });

        });
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-book\"></span> Share <a href=\"#\">https://www.domo.com/connectors/excel</a>  <span class=\"glyphicon glyphicon-eye-open\"></span>";
    }
}