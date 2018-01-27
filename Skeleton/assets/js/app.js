// Create a scatterplot of the data
// Data compares reported excellent health and population between 25 and 29

// create width and height of svg
var svgWidth = 700;
var svgHeight = 450;

// create the margins
var margin = { top: 20, right: 40, bottom: 100, left: 150};

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
d3.csv("./assets/data/dataexpanded.csv", function(err, demodata){
    if (err) throw err;

    demodata.forEach(function(data){
        data.id = +data.id;
        data.excellentHealth = +data.excellentHealth;
        data.poorHealth = +data.poorHealth;
        data.goodHealth = +data.goodHealth;
        data.youngPop = +data.youngPop;
        data.youngMen = +data.youngMen;
        data.youngWomen = +data.youngWomen;
    });

    // create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);
    
    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // These variables store the minimum and maximum values in a column in data.csv
    var xMin;
    var xMax;
    var yMax;

    // This function identifies the minimum and maximum values in a column in dataexpanded.csv
    // and assign them to xMin, xMax, and yMax variables, which will define the axis domain
    function findMinAndMax(dataColumnX, dataColumnY) {
        xMin = d3.min(demodata, function(data) {
        return +data[dataColumnX] * 0.8;
        });
        xMax = d3.max(demodata, function(data) {
        return +data[dataColumnX] * 1.1;
        });
        yMax = d3.max(demodata, function(data) {
        return +data[dataColumnY] * 1.1;
        });
    }

    // The default x-axis is 'excellentHealth'
    // The default y-axis is 'youngPop'
    // Another axis can be assigned to the variable during an onclick event.
    // This variable is key to the ability to change axis/data column
    var currentAxisLabelX = "excellentHealth";
    var currentAxisLabelY = "youngPop";

    // Call findMinAndMax() with 'excellentHealth' as default
    findMinAndMax(currentAxisLabelX, currentAxisLabelY);

    // scale the domain
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);

    // create the tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data){
            var stateName = data.state;
            //var exHealth = +data.excellentHealth;
            //var youthPop = +data.youngPop;
            var healthLabel = +data[currentAxisLabelX];
            var popLabel = +data[currentAxisLabelY];
            var healthString;
            var popString;

            // create the healthstring and popstring based on the demographics/survey response selected
            if (currentAxisLabelX === "excellentHealth"){
                healthString = "Excellent Health";
            }
            else if(currentAxisLabelX === "goodHealth"){
                healthString = "Good Health";
            }
            else {
                healthString = "Poor Health";
            };

            if (currentAxisLabelY === "youngPop"){
                popString = "Population 25-29";
            }
            else if (currentAxisLabelY === "youngMen"){
                popString = "Men 25-29";
            }
            else {
                popString = "Women 25-29";
            };

            return (stateName + "<br> % in "+ healthString + ": " + healthLabel + "<br> % of " + popString + ": " + popLabel);
        });
    
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(demodata)
        .enter().append("circle")
            .attr("cx", function(data, index) {
                console.log(data[currentAxisLabelX]);
                return xLinearScale(+data[currentAxisLabelX]);
            })
            .attr("cy", function(data, index) {
                return yLinearScale(+data[currentAxisLabelY]);
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

    // Append y-axis label, active by default
    chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text yactive")
    .attr("data-axis-name", "youngPop")
    .text("% of Population 25-29");

    // Append x-axis labels
    chart
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    // This x axis label is active by default
    .attr("class", "axis-text xactive")
    .attr("data-axis-name", "excellentHealth")
    .text("% of Population in Excellent Health");

    // inactive x axis labels
    chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
    // This axis label is inactive by default
    .attr("class", "axis-text xinactive")
    .attr("data-axis-name", "goodHealth")
    .text("% of Population in Good Health");

    chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 70) + ")"
    )
    // This axis label is inactive by default
    .attr("class", "axis-text xinactive2")
    .attr("data-axis-name", "poorHealth")
    .text("% of Population in Poor Health");


    // inactive y axis labels
    chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 65)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text yinactive")
    .attr("data-axis-name", "youngMen")
    .text("% of Men 25-29");

    chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 90)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text yinactive2")
    .attr("data-axis-name", "youngWomen")
    .text("% of Women 25-29");

    // -----------------------------------------------------------------------
    function xlabelChange(clickedAxis) {
        d3
          .selectAll(".axis-text")
          .filter(".xactive")
          // An alternative to .attr("class", <className>) method. Used to toggle classes.
          .classed("xactive", false)
          .classed("xinactive", true);
        clickedAxis.classed("xinactive", false).classed("xactive", true);
      }
      function xlabelChange2(clickedAxis) {
        d3
          .selectAll(".axis-text")
          .filter(".xactive")
          // An alternative to .attr("class", <className>) method. Used to toggle classes.
          .classed("xactive", false)
          .classed("xinactive2", true);
        clickedAxis.classed("xinactive2", false).classed("xactive", true);
      }
      function ylabelChange(clickedAxis) {
        d3
          .selectAll(".axis-text")
          .filter(".yactive")
          // An alternative to .attr("class", <className>) method. Used to toggle classes.
          .classed("yactive", false)
          .classed("yinactive", true);
        clickedAxis.classed("yinactive", false).classed("yactive", true);
      }
      function ylabelChange2(clickedAxis) {
        d3
          .selectAll(".axis-text")
          .filter(".yactive")
          // An alternative to .attr("class", <className>) method. Used to toggle classes.
          .classed("yactive", false)
          .classed("yinactive2", true);
        clickedAxis.classed("yinactive2", false).classed("yactive", true);
      }

      d3.selectAll(".axis-text").on("click", function() {
        // Assign a variable to current axis
        var clickedSelection = d3.select(this);
        // "true" or "false" based on whether the axis is currently selected
        var isClickedSelectionXInactive = clickedSelection.classed("xinactive");
        var isClickedSelectionXInactive2 = clickedSelection.classed("xinactive2");
        var isClickedSelectionYInactive = clickedSelection.classed("yinactive");
        var isClickedSelectionYInactive2 = clickedSelection.classed("yinactive2");
        // console.log("this axis is inactive", isClickedSelectionInactive)
        // Grab the data-attribute of the axis and assign it to a variable
        // e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
        var clickedAxis = clickedSelection.attr("data-axis-name");
        console.log("current axis: ", clickedAxis);
        // The onclick events below take place only if the x-axis is inactive
        // Clicking on an already active axis will therefore do nothing
        if (isClickedSelectionXInactive) {
          // Assign the clicked axis to the variable currentAxisLabelX
          currentAxisLabelX = clickedAxis;
          // Call findMinAndMax() to define the min and max domain values.
          findMinAndMax(currentAxisLabelX, currentAxisLabelY);
          // Set the domain for the x-axis
          xLinearScale.domain([xMin, xMax]);
          yLinearScale.domain([0, yMax]);
          // Create a transition effect for the x-axis
          svg
            .select(".x-axis")
            .transition()
            // .ease(d3.easeElastic)
            .duration(1800)
            .call(bottomAxis);
          // Select all circles to create a transition effect, then relocate its horizontal location
          // based on the new axis that was selected/clicked
          d3.selectAll("circle").each(function() {
            d3
              .select(this)
              .transition()
              // .ease(d3.easeBounce)
              .attr("cx", function(data) {
                return xLinearScale(+data[currentAxisLabelX]);
              })
              .duration(1800);
          });
          // Change the status of the axes. See above for more info on this function.
          xlabelChange(clickedSelection);
        }
        else if(isClickedSelectionXInactive2){
            // Assign the clicked axis to the variable currentAxisLabelX
            currentAxisLabelX = clickedAxis;
            // Call findMinAndMax() to define the min and max domain values.
            findMinAndMax(currentAxisLabelX, currentAxisLabelY);
            // Set the domain for the x-axis
            xLinearScale.domain([xMin, xMax]);
            yLinearScale.domain([0, yMax]);
            // Create a transition effect for the x-axis
            svg
                .select(".x-axis")
                .transition()
                // .ease(d3.easeElastic)
                .duration(1800)
                .call(bottomAxis);
            // Select all circles to create a transition effect, then relocate its horizontal location
            // based on the new axis that was selected/clicked
            d3.selectAll("circle").each(function() {
                d3
                .select(this)
                .transition()
                // .ease(d3.easeBounce)
                .attr("cx", function(data) {
                    return xLinearScale(+data[currentAxisLabelX]);
                })
                .duration(1800);
            });
            // Change the status of the axes. See above for more info on this function.
            xlabelChange2(clickedSelection);
        }
        else if (isClickedSelectionYInactive){
            // Assign the clicked axis to the variable currentAxisLabelX
            currentAxisLabelY = clickedAxis;
            // Call findMinAndMax() to define the min and max domain values.
            findMinAndMax(currentAxisLabelX, currentAxisLabelY);
            // Set the domain for the x-axis
            xLinearScale.domain([xMin, xMax]);
            yLinearScale.domain([0, yMax]);
            // Create a transition effect for the x-axis
            svg
                .select(".y-axis")
                .transition()
                // .ease(d3.easeElastic)
                .duration(1800)
                .call(leftAxis);
            // Select all circles to create a transition effect, then relocate its horizontal location
            // based on the new axis that was selected/clicked
            d3.selectAll("circle").each(function() {
                d3
                .select(this)
                .transition()
                // .ease(d3.easeBounce)
                .attr("cy", function(data) {
                    return yLinearScale(+data[currentAxisLabelY]);
                })
                .duration(1800);
            });
            // Change the status of the axes. See above for more info on this function.
            ylabelChange(clickedSelection);
        }
        else if(isClickedSelectionYInactive2){
            // Assign the clicked axis to the variable currentAxisLabelX
            currentAxisLabelY = clickedAxis;
            // Call findMinAndMax() to define the min and max domain values.
            findMinAndMax(currentAxisLabelX, currentAxisLabelY);
            // Set the domain for the x-axis
            xLinearScale.domain([xMin, xMax]);
            yLinearScale.domain([0, yMax]);
            // Create a transition effect for the x-axis
            svg
                .select(".y-axis")
                .transition()
                // .ease(d3.easeElastic)
                .duration(1800)
                .call(bottomAxis);
            // Select all circles to create a transition effect, then relocate its horizontal location
            // based on the new axis that was selected/clicked
            d3.selectAll("circle").each(function() {
                d3
                .select(this)
                .transition()
                // .ease(d3.easeBounce)
                .attr("cy", function(data) {
                    return yLinearScale(+data[currentAxisLabelY]);
                })
                .duration(1800);
            });
            // Change the status of the axes. See above for more info on this function.
            ylabelChange2(clickedSelection);
        }
      });
});

