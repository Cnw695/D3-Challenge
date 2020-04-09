// // @TODO: YOUR CODE HERE!
// var data = d3.csv("data.csv")
// console.log(data);
var svgWidth = 960;
var svgHeight=500;

var margin ={
    t: 20, 
    r: 40, 
    b: 60, 
    l: 100
};

var width = svgWidth-margin.l-margin.r;
var height = svgHeight-margin.t-margin.b;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.l}, ${margin.t})`);

d3.csv("data.csv").then(function(healthData) {
    healthData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty; 
        //data.abbr = +data.abbr;
    });
    var xLinearScale = d3.scaleLinear()
        .domain([3, d3.max(healthData, d => d.healthcare)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("Circle")//or text?
        .data(healthData)
        .enter()
        //.append(function(d) {d => d.abbr})
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        //.text(d => d.abbr)
        //.style("fill", "white",  d => d.abbr)
        //.style("fill", function(d) { return state(cValue(d));}) 
        .attr("opacity", "0.5");

    chartGroup.selectAll(null)
        .data(healthData)
        .enter()
        .append("text")
        .text(function(d){
            return d.abbr;
        })
        .attr("x", function(d){
        return xLinearScale(d.healthcare);
        })
        .attr("y", function(d){
            return yLinearScale(d.poverty)
        })
    
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    var tooltip = d3.tip()
        .attr("class", "tooltip")
        .offset([0,0])
        .html(function(d){
            return (`${d.abbr}`)
        });

    chartGroup.call(tooltip);

    circlesGroup.on("click", function(data){
        tooltip.show(data, this);
    })
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.l + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.t + 30})`)
        .attr("class", "axisText")
        .text("Healthcare");
}).catch(function(error) {
    console.log(error);
});







