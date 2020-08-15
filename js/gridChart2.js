var formatAsInteger = d3.format(",");

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

black = function(d1, d2, pixel, time, hp){
    if (pixel == hp.pixel && time == hp.time) return "green"
    if (pixel == d1.pixel && d1.value == 1) return "black"
    if (pixel == d2.pixel && d2.value == 1) return "black"
    return "none"
}


graphs = {};

function draw(selector, draw, data, hovered_pixel){
    // append the svg object to the body of the page
    if(draw){
        var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Build X scales and axis:
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(.05);
        svg.append("g")
        //.attr("transform", "translate(0," + height + ")")
        .call(d3.axisTop(x))

        // Build X scales and axis:
        var y = d3.scaleBand()
        .range([0, height ])
        .domain(myVars)
        .padding(.05);
        svg.append("g")
        .call(d3.axisLeft(y));

        var graph = {svg: svg, x: x, y: y};
        graphs[selector] = graph;
    }
    else{
        var svg = graphs[selector].svg;
        var x = graphs[selector].x
        var y = graphs[selector].y
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
                    .style("padding", 4)
                    .style("stroke", d => black(tracker1[d.time-1], tracker2[d.time-1], d.pixel, d.time, hovered_pixel))
                    .style("stroke-width", 1.5)
                    .call(enter => enter.transition(t)),
                update => update
                    .style("fill", d => myColor(d.value) )
                    .style("opacity", 1)
                    .style("stroke", d =>  black(tracker1[d.time-1], tracker2[d.time-1], d.pixel, d.time, hovered_pixel))
                    .call(update => update.transition(t)),
            )
    
    }

    render(data, hovered_pixel);

}







tracker_width = 300 - margin.left - margin.right,
tracker_height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#tracking_object1")
.append("svg")
.attr("width", tracker_width + margin.left + margin.right)
.attr("height", tracker_height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

// Build X scales and axis:
var tracker_x = d3.scaleBand()
.range([ 0, tracker_width ])
.domain(myGroups)
.padding(0.01);
svg3.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(tracker_x))

// Build X scales and axis:
var tracker_y = d3.scaleBand()
.range([0, tracker_height ])
.domain(myVars)
.padding(0.01);
svg3.append("g")
.call(d3.axisLeft(tracker_y));

// append the svg object to the body of the page
var svg4 = d3.select("#tracking_object2")
.append("svg")
.attr("width", tracker_width + margin.left + margin.right)
.attr("height", tracker_height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];
var myVars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ];

// Build X scales and axis:
var tracker_x = d3.scaleBand()
.range([ 0, tracker_width ])
.domain(myGroups)
.padding(0.01);
svg4.append("g")
//.attr("transform", "translate(0," + height + ")")
.call(d3.axisTop(tracker_x))

// Build X scales and axis:
vartracker_y = d3.scaleBand()
.range([0, tracker_height ])
.domain(myVars)
.padding(0.01);
svg4.append("g")
.call(d3.axisLeft(tracker_y));

// Build color scale
/*var myColor = d3.scaleLinear()
.range(["white", "#69b3a2"])
.domain([-10,10])*/

var myColor = d3.scaleLinear()
  .domain([-3, 0, 3])
  .range(["blue", "white", "red"])

var trackingColor = d3.scaleSequential()
  .domain([0, 2])
  .interpolator(d3.interpolateRainbow);

var dataset1; 
var dataset2; 


var tracker1 = [];
var tracker2 = [];


$.getJSON("tracker_1.json", function(json) {
    for(var i = 0; i < json.length; i++){
        if (json[i].value == 1) tracker1.push(json[i]);
    }
});

$.getJSON("tracker_2.json", function(json) {
    for(var i = 0; i < json.length; i++){
        if (json[i].value == 1) tracker2.push(json[i]);
    }
});


track = async function (selector, graph_selector, object, tracker, svg){
    await d3.json(selector).then(function(data) {
        var data = data;
        const t = svg.transition()
            .duration(100);
        svg.selectAll("rect")
            .data(data, function (d) {
                return d.pixel+':'+d.time;
            })
            .join(
                enter => enter.append("rect")
                    .attr("x", function(d) { return tracker_x(d.pixel) })
                    .attr("y", function(d) { return tracker_y(d.time) })
                    .attr("width", tracker_x.bandwidth() )
                    .attr("height", tracker_y.bandwidth() )
                    .style("fill", d =>  trackingColor(d.value))
                    .call(enter => enter.transition(t)),
            )
            .on('mouseover', function (d, i) {
                console.log(d);
                if (object == 1){
                    for(var i = 0; i < graph_selector.length; i++){
                        draw(graph_selector[i], false, datasets1[i][(d.time - 1)* 28 + (d.pixel-1)], d);
                    }
                }
                else{
                    for(var i = 0; i < graph_selector.length; i++){
                        draw(graph_selector[i], false, datasets2[i][(d.time - 1)* 28 + (d.pixel-1)], d);
                    }
                }
                
            })
    });
    return tracker;
}

show_gradients = async function (selectors){
    track("tracker_1.json",selectors, 1, tracker1, svg3); 
    track("tracker_2.json",selectors, 2, tracker2, svg4);
    for(var i = 0; i < selectors.length; i++){
        draw(selectors[i], true, datasets1[i][0], {time: 1, pixel: 12, value: 1});
    }
}

get_data = async function(file){
    return d3.json(file).then(async function(data) {
        return data;  
    });
}
    
datasets1 = [];
datasets2 = [];

selectors = ["#no_noise","#noise1" ]
gradients1 = ["gradients_1.json", "noise1_gradients1.json"]
gradients2 = ["gradients_2.json", "noise1_gradients2.json"]

populate_datasets = async function(){
    for(var i = 0; i < selectors.length; i++){
        const dataset1 = await get_data(gradients1[i]);
        const dataset2 = await get_data(gradients2[i]);
        datasets1.push(dataset1);
        datasets2.push(dataset2);
    }
    return "Done";
}

populate_datasets().then(response =>{
    if(response){
        console.log(datasets1.length);
        show_gradients(selectors);
    }
    
});







