// Create a scatterplot of the data
// Data compares reported excellent health and population between 25 and 29

// create width and height of svg
var svgWidth = 600;
var svgHeight = 350;

// create the margins
var margin = { top: 20, right: 40, bottom: 60, left: 100};

// calculate the width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create the svg object
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// add tooltip
d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load the csv
d3.csv("./assets/data/data.csv", function(err, demodata){
    if (err) throw err;

    demodata.forEach(function(data){
        data.id = +data.id;
        data.excellentHealth = +data.excellentHealth;
        data.youngPop = +data.youngPop;
    });

    // create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);
    
    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // scale the domain
    xLinearScale.domain([13, d3.max(demodata, function(data){
        return +data.excellentHealth;
    })]);

    yLinearScale.domain([0, d3.max(demodata, function(data){
        return +data.youngPop * 1.2;
    })]);

    // create the tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data){
            var stateName = data.state;
            var exHealth = +data.excellentHealth;
            var youthPop = +data.youngPop;
            return (stateName + "<br> % in Excellent Health: " + exHealth + "<br> % of Population 25-29: " + youthPop);
        });
    
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(demodata)
        .enter().append("circle")
            .attr("cx", function(data, index) {
                console.log(data.excellentHealth);
                return xLinearScale(data.excellentHealth);
            })
            .attr("cy", function(data, index) {
                return yLinearScale(data.youngPop);
            })
            .attr("r", "15")
            .attr("fill", "lightblue")
            .on("mouseover", function(data){
                toolTip.show(data);
            })
            // on mouseout
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });
    
    chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

    chart.append("g")
            .call(leftAxis);

    chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.left + 40)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% of Population 25-29")

    // x axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("% of Population in Excellent Health");
});

