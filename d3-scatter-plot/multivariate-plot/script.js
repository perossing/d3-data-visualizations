var d3;
var data = "movie-data.csv";
var w = 500;
var h = 500;

d3.csv(data, function(dataset) {
  data = dataset;
  buildIt();
});

function buildIt() { 
  
  var svg = d3
    .select(".container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  var minX = d3.min(data, function (d) {return d.NumMovies})
  var maxX = d3.max(data, function (d) {return d.NumMovies})
  var minY = d3.min(data, function (d) {return d.TicketsSold})
  var maxY = d3.max(data, function (d) {return d.TicketsSold})
  
  var xScale = d3
    .scaleLinear()
    .domain([minX, maxX])
    .range([0, w])
    .nice();

  var yScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([h, 0])
    .nice();  

  var x_axis = d3.axisBottom().scale(xScale);;
  var y_axis = d3.axisLeft().scale(yScale);

  
   /* ===== circles ===== */
  
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d.NumMovies);
      // return xPositioning(d);
    })
    .attr("cy", function(d) {
      return yScale(d.TicketsSold);
      // return yPositioning(d)
    })
    .attr("r", function(d) {
      return circleCenter(d) * 8;
    })
    .attr("fill", "#2962FF");
  
  /* ===== radii ===== */

  function circleCenter(d) {
    return Math.sqrt(d.AvgTicketPrice);
  }  

  /* ===== year labels ===== */

  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
      return d.Year;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
      return xScale(d.NumMovies);
    })
    .attr("y", function(d) {
      return yScale(d.TicketsSold) + 3;
    })
    .attr("font-size", "12")
    .attr("fill", "white");

  /* ===== average ticket prices labels ===== */

  svg
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
      return "$" + d.AvgTicketPrice;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
      return xScale(d.NumMovies) + circleCenter(d) * 9;
    })
    .attr("y", function(d) {
      return yScale(d.TicketsSold) - circleCenter(d) * 8;
    })
    .attr("font-size", "11")
    .attr("fill", "#546c78");
  
  
  /* ===== axes ===== */

  svg
    .append("g")
    .call(x_axis)
    .attr("transform", "translate(0," + h + ")");
  
  svg.append("g")
    .call(y_axis);  

}
