/**
 * Created by raeioul on 11/22/16.
 */


function Funel(width, height) {
    this.prototype = new Graphic(width, height);


    this.draw = function (tag_id) {

        var width = this.prototype.width -20,
            height = this.prototype.height,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(["#255aee", "#3a6fff", "#4f84ff", "rgb(101,154,302)", "rgb(122,175,323)", "rgb(144,197,345)", "rgb(165,218,366)"]);

        var svg = d3.select(tag_id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")

        d3.tsv("data/datas.tsv", function (error, data) {
            var funnel = d3.funnel()
                .size([width, height])
                .mouth([100, 100])
                .value(function (d) {
                    return d.value;
                });

            var line = d3.svg.line()
                .interpolate('linear-closed')
                .x(function (d, i) {
                    return d.x;
                })
                .y(function (d, i) {
                    return d.y;
                });

            var g = svg.selectAll(".funnel-group")
                .data(funnel(data))
                .enter().append("g")
                .attr("class", "funnel-group");

            g.append("path")
                .attr("d", function (d) {
                    return line(d.coordinates);
                })
                .style("fill", function (d) {
                    return color(d.sales_process);
                });

            g.append("text")
                .attr({
                    "y": function (d, i) {
                        if (d.coordinates.length === 4) {
                            return (((d.coordinates[0].y - d.coordinates[1].y) / 2) + d.coordinates[1].y) + 5;
                        } else {
                            return (d.coordinates[0].y + d.coordinates[1].y) / 2 + 10;
                        }
                    },
                    "x": function (d, i) {
                        return width / 2;
                    }
                })
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.sales_process;
                });

            d3.select("body").append("table")
                .attr({
                    "id": "footer",
                    "width": width + "px"
                })

            d3.select("body #footer").append("tr")
                .attr({
                    "class": "PykCharts-credits",
                    "id": "credit-datasource"
                })
                .append("td")
                .style("text-align", "left");
        });
    };

    this.getFooter = function() {
        return "";
    }
}