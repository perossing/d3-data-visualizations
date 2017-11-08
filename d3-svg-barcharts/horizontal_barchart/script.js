var d3;
var data = 'PortlandBudgetExp2016.csv';


d3.csv(data, function(dataset) {
  data = dataset;
  buildChart();
});

function buildChart() {
  
  /* ===== SET UP CHART =====*/
  
  var w = 650;
  var barSpacing = 65;
  var barThickness = 55;
  var vertPadding = 15;
  var h = (barSpacing) * data.length + vertPadding;
  
  var svg = d3.select('.container')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
  
  var xScale = d3.scaleLinear()
    .domain([0, 350])
    .range([0,w]);
  
  var yScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([h,0]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    
  var yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(0);
  
  var group = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g');
  
  
  /* ===== BARS =====*/ 

  var bars = group
    .append('rect')
    .attr('y', function(d, i) {
      return i * (barSpacing) + vertPadding
    })
    /* bar width is set in opening animation */
    // .attr('width', function(d) {
    //   return xScale(d.Budget);
    // })
    .attr('height', function(d) {
      return h - yScale(barThickness/barSpacing);
    })
    .attr('fill', function (d,i) {
      return setBarColors(d,i);
    });  
  
  /* ===== AXES =====*/
  
  svg.append('g')
    .style('font', '16px arial')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

   /* ===== BAR TEXT =====*/
  
  var textLabels = group
    .append('text')
    .text(function (d) {
      return d.Area;
    })
    .attr('text-anchor', 'start')
    .attr('x', function(d) {
      return xScale(d.Budget * 0.1) + 20;
    })
    .attr('y', function(d, i) {
      return i * (barSpacing) + vertPadding + (barSpacing /2);
    })
    .attr('font-family', 'arial, sans-serif')
    .attr('font-size', '18px')
    .attr('fill', '#333')
    .attr('opacity', 0)
    .transition().duration(2000)
    .attr('opacity', 1)
  
  
   /* ===== HOVER EFFECTS =====*/  

  group.on('mouseover', function(d){
    d3.select(this)
      .select('rect')
      .transition().duration(250)
      .style('fill', '#ff8a65');      
  })
    .append('title')
    .text(function (d) {
        return d.Budget + ' million';
  })
  
  group.on('mouseout', function(d, i){
      d3.select(this)
      .select('rect')
      .transition().duration(400)
      .style('fill', function(d,i){
        return setBarColors(d);
    });
  })
  
/* ===== ANIMATION =====*/    
  
  bars
    .transition().duration(1000) 
    .attr('width', function(d) {
        return xScale(d.Budget);
      }); 
}

/* ===== BAR COLORS =====*/ 

function setBarColors (d,i) {
    var colors = ['#64b5f6','#4dd0e1','#4fc3f7','#4db6ac','#0283AF','#7EBC89','#00187B'];
    return colors[i];
};
