var data;
var d3;


d3.csv("vaccines.csv", function(dataset) {
  data = dataset;
  buildIt()
});

function buildIt () {
  
  var gap = 15
  var w = 600;
  var h = 400;
  var padding = 10;
  var barWidth = 1.12;

  var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
  var xScale = d3.scaleLinear()
    .domain([0, data.length])   
    .range([-gap, w]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(0);
    
  var yScale = d3.scaleLinear()
    .domain([0, 50])  
    .range([h,0])
   
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10)
    .tickFormat(function(d){return d + "%"});
  ;
  
  var group = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g');
  
  /* ===== BARS =====*/
  
  var bars = group
    .append("rect")
    .attr("x", function (d,i) {
      return i * xScale(barWidth) + padding/2; // spaced & scaled bar width
    })
    .attr("y", function (d) {
      return yScale(d.DataValueAlt) // scaled bar height
    })
    .attr("width", xScale(barWidth) - padding)
    .attr("height", function (d) {
      return h- yScale(d.DataValueAlt)
    })
    .attr("fill", function (d) {
      return setBarColors(d);
    });
  
  
  group.on("mouseover", function(d){
    d3.select(this)
      .select('rect')
      .transition().duration(200)
      .attr("fill", "#8B4513");
    d3.select(this)
      .selectAll('text.ctgry')
      .transition().duration(200)
      .attr('fill', '#fff');
  })
    
    .append("title")
    .text(function (d) {
        return d.StratificationCategory1;
  });
  
  group.on("mouseout", function(d,i){
    d3.select(this)
      .select('rect')
      .transition().duration(200)
      .attr("fill", function (d) {
        return setBarColors(d);
    });
     d3.select(this)
      .selectAll('text.ctgry')
      .transition().duration(200)
      .attr('fill', '#4c4534');
  })
  
  
  /* ===== PERCENT LABELS =====*/
  
  var percentLabels = group
    .append("text")
    .text(function (d) {
      return d.DataValueAlt + '%';
    })
    .attr("text-anchor", "middle")
    .attr("x", function (d,i) {
      return i * xScale(barWidth) + xScale(barWidth)/2;
    })
    .attr("y", function (d) {
      return yScale(d.DataValueAlt) + 50;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "18px")
    .attr("fill", "white")
    .attr("font-weight", "bold"); 
  
  /* ===== CATEGORY LABELS =====*/

  var ctgryLabels = group
    .append("text")
    .text(function (d) {
      return d.Stratification1;
    })
    .attr("text-anchor", "middle")
    .attr("x", function (d,i) {
      return i * xScale(barWidth) + xScale(barWidth)/2;
    })
    .attr("class","ctgry")
    .attr("y", h - 20 )
    .attr("font-family", "sans-serif")
    .attr("font-size", "13px")
    .attr("fill", "#4c4534")
    .attr("font-weight", "bold");
  
  
  /* ===== AXES =====*/
  
  svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + -gap + ", 0)")
    .call(yAxis);
  

  /* ===== BAR COLORS =====*/
  
  function setBarColors(d) {
    var colorName = ''
    if (d.StratificationCategory1 === "Gender") colorName = "#8cacc0"
    else if (d.StratificationCategory1 === "Race/Ethnicity") colorName = "#d5cb90" 
    else colorName = "#cd9898";
    return colorName;
  }
  
}