var formatAsInteger = d3.format(",");

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#gradient_object")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.01);
svg.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(x))

// Build X scales and axis:
var y = d3.scaleBand()
.range([0, height ])
.domain(myVars)
.padding(0.01);
svg.append("g")
.call(d3.axisLeft(y));


// append the svg object to the body of the page
var svg3 = d3.select("#tracking_object1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.01);
svg3.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(x))

// Build X scales and axis:
var y = d3.scaleBand()
.range([0, height ])
.domain(myVars)
.padding(0.01);
svg3.append("g")
.call(d3.axisLeft(y));

// append the svg object to the body of the page
var svg4 = d3.select("#tracking_object2")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

// Build X scales and axis:
var x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.01);
svg4.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(x))

// Build X scales and axis:
var y = d3.scaleBand()
.range([0, height ])
.domain(myVars)
.padding(0.01);
svg4.append("g")
.call(d3.axisLeft(y));

// Build color scale
/*var myColor = d3.scaleLinear()
.range(["white", "#69b3a2"])
.domain([-10,10])*/

var myColor = d3.scaleLinear()
  .domain([-3, 0, 3])
  .range(["orange", "white", "green"])

var trackingColor = d3.scaleSequential()
  .domain([0, 2])
  .interpolator(d3.interpolateRainbow);

var dataset1; 
var dataset2; 


var tracker1 = [];
var tracker2 = [];

d3.json("tracker_1.json").then(function(data) {
    var data = data;
    const t = svg.transition()
        .duration(100);
    svg3.selectAll("rect")
        .data(data, function (d) {
            if (d.value == 1) tracker1.push(d);
            return d.pixel+':'+d.time;
        })
        .join(
            enter => enter.append("rect")
                .attr("x", function(d) { return x(d.pixel) })
                .attr("y", function(d) { return y(d.time) })
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", d =>  trackingColor(d.value))
                .call(enter => enter.transition(t)),
        )
        .on('mouseover', function (d, i) {
            console.log(d);
            render(dataset1[(d.time - 1)* 28 + (d.pixel-1)], d);
        })
});

d3.json("tracker_2.json").then(function(data) {
    var data = data;
    const t = svg.transition()
        .duration(100);
    svg4.selectAll("rect")
        .data(data, function (d) {
            if (d.value == 1) tracker2.push(d);
            return d.pixel+':'+d.time;
        })
        .join(
            enter => enter.append("rect")
                .attr("x", function(d) { return x(d.pixel) })
                .attr("y", function(d) { return y(d.time) })
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", d =>  trackingColor(d.value))
                .call(enter => enter.transition(t)),
        )
        .on('mouseover', function (d, i) {
            console.log(d);
            render(dataset2[(d.time - 1)* 28 + (d.pixel-1)], d);
        })
});

d3.json("gradients_1.json").then(function(data) {
    dataset1 = data;
    render(dataset1[0], {time: 1, pixel: 12, value: 1});
});

d3.json("gradients_2.json").then(function(data) {
    dataset2 = data;
});

black = function(d1, d2, pixel, time, hp){
    if (pixel == hp.pixel && time == hp.time) return "red"
    if (pixel == d1.pixel && d1.value == 1) return "black"
    if (pixel == d2.pixel && d2.value == 1) return "black"
    return "none"
}

render = async function(data, hovered_pixel){
    const t = svg.transition()
        .duration(100);
    svg.selectAll("rect")
        .data(data, d => (d.pixel+':'+d.time))
        .join(
            enter => enter.append("rect")
                .attr("x", function(d) { return x(d.pixel) })
                .attr("y", function(d) { return y(d.time) })
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", d =>  myColor(d.value))
                .style("opacity", 1)
                .style("stroke", d =>  black(tracker1[d.time-1], tracker2[d.time-1], d.pixel, d.time, hovered_pixel))
                .style("stroke-width", 2)
                .call(enter => enter.transition(t)),
            update => update
                .style("fill", function(d) { console.log("update"); return myColor(d.value)} )
                .style("opacity", 1)
                .style("stroke", d =>  black(tracker1[d.time-1], tracker2[d.time-1], d.pixel, d.time, hovered_pixel))
                .call(update => update.transition(t)),
        )

}


