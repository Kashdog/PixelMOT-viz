var formatAsInteger = d3.format(",");

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#gradient_object1")
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

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#gradient_object2")
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
svg2.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(x))

// Build X scales and axis:
var y = d3.scaleBand()
.range([0, height ])
.domain(myVars)
.padding(0.01);
svg2.append("g")
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
var myColor = d3.scaleLinear()
.range(["white", "#69b3a2"])
.domain([-5,5])

var trackingColor = d3.scaleSequential()
  .domain([0, 2])
  .interpolator(d3.interpolateRainbow);

d3.json("/get_grid_data").then(function(data) {
    var data = data;
    console.log(data);
    render(data);
});

d3.json("/get_grid_data").then(function(data) {
    var data = data;
    console.log(data);
    render2(data);
});

d3.json("/get_tracking_data_1").then(function(data) {
    var data = data;
    const t = svg.transition()
        .duration(100);
    svg3.selectAll("rect")
        .data(data, d => (d.pixel+':'+d.time))
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
            axios.post('/hover', {
                time: d.time,
                pixel: d.pixel
            })
            .then(async function (response) {
                console.log(response);
                axios.get('/get_grid_data')
                .then((response) => {
                    console.log(response);
                    data = response.data;
                    render(data);
                });
            })
            .catch(function (error) {
            console.log(error);
            })
        })
});

d3.json("/get_tracking_data_2").then(function(data) {
    var data = data;
    const t = svg.transition()
        .duration(100);
    svg4.selectAll("rect")
        .data(data, d => (d.pixel+':'+d.time))
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
            axios.post('/hover', {
                time: d.time,
                pixel: d.pixel
            })
            .then(async function (response) {
                console.log(response);
                axios.get('/get_grid_data')
                .then((response) => {
                    console.log(response);
                    data = response.data;
                    render2(data);
                });
            })
            .catch(function (error) {
            console.log(error);
            })
        })
});


render = async function(data){
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
                .call(enter => enter.transition(t)),
            update => update
                .style("fill", function(d) { console.log("update"); return myColor(d.value)} )
                .call(update => update.transition(t)),
        )

}

render2 = async function(data){
    const t = svg2.transition()
        .duration(100);
    svg2.selectAll("rect")
        .data(data, d => (d.pixel+':'+d.time))
        .join(
            enter => enter.append("rect")
                .attr("x", function(d) { return x(d.pixel) })
                .attr("y", function(d) { return y(d.time) })
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", d =>  myColor(d.value))
                .call(enter => enter.transition(t)),
            update => update
                .style("fill", function(d) { console.log("update"); return myColor(d.value)} )
                .call(update => update.transition(t)),
        )

}


