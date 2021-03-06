/**
 * Created by raeioul on 12/19/16.
 */

/**
 * Class Map
 *
 * @param width
 * @param height
 * @constructor
 */
function Map(width, height) {
    this.base = Cartesian;
    this.base(width, height, arguments); //call super constructor.
    // this.name = arguments.callee.name.toLowerCase();

    //TODO: Should be a private function
    this.process = function (tag_id) {

        var _this = this;

        var width = this.width - this.margin.left - this.margin.right,
            height = this.height - this.margin.top - this.margin.bottom;

// D3 Projection

        var midw = width/2;
        var midh = height/2;

        var projection = d3.geo.albersUsa()
            .translate([midw, midh])    // translate to center of screen
            .scale([1000]);          // scale things down so see entire US

// Define path generator
        var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
        var color = d3.scale.linear()
            .range(this.colors);

        var legendText = ["500+", "400+", "300+", "100+", "0-99"];

//Create SVG element and append map to the SVG
        var svg = d3.select(tag_id)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

		d3.select(tag_id).style("background-color", this.background_color);

// Append Div for tooltip to SVG
        var div = d3.select(tag_id)
            .append("div")
            .style("position", _this.tooltip.position)
            .style("text-align", _this.tooltip.textAlign)
            .style("width", _this.tooltip.width)
            .style("height",  _this.tooltip.height)
            .style("padding", _this.tooltip.padding)
            .style("font-family", _this.tooltip.fontFamily)
            .style("font-size", _this.tooltip.fontSize)
            .style("background", _this.tooltip.background)
            .style("border", _this.tooltip.border)
            .style("border-radius", _this.tooltip.borderRadius)
            .style("pointer-events", _this.tooltip.pointerEvents)
            .style("opacity", _this.tooltip.opacity);

// Load in my states data!


        var datum = function (data) {
            color.domain([0, 1, 2, 3, 4]); // setting the range of the input data

// Load GeoJSON data and merge with states data
            d3.json("data/us-states.json", function (json) {
                localStorage[_this.source] = JSON.stringify(json);
// Loop through each state data value in the .json file
                for (var i = 0; i < data.length; i++) {

                    // Grab State Name
                    var dataState = data[i].state;
// Grab data value
                    var dataValue = data[i].visited;

                    // Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonState = json.features[j].properties.name;

                        if (dataState == jsonState) {

                            // Copy the data value into the JSON
                            json.features[j].properties.visited = dataValue;

                            // Stop looking through the JSON
                            break;
                        }
                    }
                }


// Bind the data to the SVG and create one path per GeoJSON feature
                svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "#fff")
                    .style("stroke-width", "1")
                    .style("fill", function (d) {

                        // Get data value
                        var value = d.properties.visited;
                        if (value) {
                            //If value exists…
                            return color(value);
                        } else {
                            //If value is undefined…
                            return "rgb(213,222,217)";
                        }
                    })
                    //Tooltip added to NAME each state
                    .on("mouseover", function (d) {

                        d3.select(this).style("opacity", .3); //Map fade


                        div.transition()
                            .duration(200)
                            .style("opacity", .7);

//
                        div.text(d.properties.name)
                            .style("left", (d3.event.layerX) + "px")
                            .style("top", (d3.event.layerY - 28) + "px");
                    })

                    // fade out tooltip on mouse out
                    .on("mouseout", function (d) {

                        d3.select(this).style("opacity", 1);

                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });


// Map the cities I have lived in!
//                 d3.json("data/cities-lived.json", function (data) {
//
//                     var pro = projection;
//
//                     svg.selectAll("circle")
//                         .data(data)
//                         .enter()
//                         .append("circle")
//                         .attr("cx", function (d) {
//                             return projection([d.lon, d.lat])[0];
//                         })
//                         .attr("cy", function (d) {
//                             return projection([d.lon, d.lat])[1];
//                         })
//                         .attr("r", function (d) {
//                             return Math.sqrt(d.years) * 4;
//                         })
//                         .style("fill", "rgb(217,91,67)")
//                         .style("opacity", 0.85)
//
//                         // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
//                         // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
//                         .on("mouseover", function (d) {
//                             div.transition()
//                                 .duration(200)
//                                 .style("opacity", .7);
//
//                             div.text(d.place)
//                                 .style("left", (d3.event.layerX) + "px")
//                                 .style("top", (d3.event.layerY - 28) + "px");
//                         })
//
//                         // fade out tooltip on mouse out
//                         .on("mouseout", function (d) {
//                             div.transition()
//                                 .duration(500)
//                                 .style("opacity", 0);
//                         });
//                 });

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
                var legend = svg.append("svg")
                // .attr("class", "legend")

                    .attr("width", 250)
                    .attr("height", 200)
                    .style("left", (width - 80) + "px")
                    .style("top", midh + "px" )
                    .style("position", "absolute")

                    .selectAll("g")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                var text = legend.append("text");


                text.data(legendText)
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px")
                    .text(function (d) {
                        return d;
                    });
                //Add it to fix the bug when Heigth and Width are almost the same
                if (width == 235){

                    legend.attr("transform",(function (d, i) {
                        return "translate(200," + i * 20 + ")";
                    }));

                    text.style("font-size","8px");
                }
            });
        };



        var map = d3.json("data/stateslived.json", datum);

        // A listener to resize the map
        var xwidth;
        var xheight;

        if (xwidth != width || xheight != height) {
            resize();
            xwidth = width;
            xheight = height;
        }

        //resize function to make the map responsive with a range of pixels
        function resize() {

            var mapratio= parseInt(d3.select(tag_id).style('width'));

                if (width > 8*height) {
                    mapratio = width /5;
                } else if (width > 6*height) {
                    mapratio = width /4;
                       } else if(width>4*height){
                            mapratio = width /3;
                              } else if(width> 2*height){
                                    mapratio = width/2;
                                     } else if(width >= height){
                                            mapratio = width;
                                            }

            projection.scale([mapratio]).translate([width/2,height/2]);
        }


    }
}

Map.prototype = Object.create(Cartesian.prototype);



