
function Series(width, height) {
    this.prototype = new Graphic(width, height);


    this.draw = function (tag_id) {

        var margin = { top: 20, right: 80, bottom: 30, left: 50 },
            width = this.prototype.width - margin.left - margin.right,
            height = this.prototype.height - margin.top - margin.bottom;


        var parseDate = d3.time.format("%Y%m%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function (d) { return x(d.date); })
            .y(function (d) { //console.log(d); 
                return y(d.temp);
            });

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/dataSeries.csv", function (error, data) {


            color.domain(d3.keys(data[0]).filter(function (key) { return key == "city"; }));

            // first we need to corerce the data into the right formats

            data = data.map(function (d) {
                return {
                    city: d.city,
                    date: parseDate(d.date),
                    temp: +d.temp
                };
            });


            // then we need to nest the data on city since we want to only draw one
            // line per city
            data = d3.nest().key(function (d) { return d.city; }).entries(data);


            x.domain([d3.min(data, function (d) { return d3.min(d.values, function (d) { return d.date; }); }),
                d3.max(data, function (d) { return d3.max(d.values, function (d) { return d.date; }); })]);
            y.domain([0, d3.max(data, function (d) { return d3.max(d.values, function (d) { return d.temp; }); })]);


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var cities = svg.selectAll(".city")
                .data(data, function (d) { return d.key; })
                .enter().append("g")
                .attr("class", "city");

            cities.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line(d.values); })
                .style("stroke", function (d) { return color(d.key); });

        });
    };

    this.getFooter = function() {
        return "<span class=\"glyphicon glyphicon-envelope\"></span> Share with <a href=\"https://www.domo.com/connectors/excel\">https://www.domo.com/connectors/excel</a>";
    }
}