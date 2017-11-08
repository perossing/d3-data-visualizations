var data;
var d3;

d3.csv('age-income.csv', function(dataset) {
  data = dataset;
  buildPlot();
});

/* ===== BUILD PLOT FUNCTION ===== */

function buildPlot() {
  var w = 600;
  var h = 500;
  var padding = 10;

  var key = function(d) {
    return d.key;
  };
  var newDataPoint = '';

  var svgFrame = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  /* ===== scales and axes ===== */

  var xScale = d3.scaleLinear()
    .domain([0,d3.max(data, function(d){return d.age;})])
    .rangeRound([padding, w - padding])
    .nice();

  var yScale = d3.scaleLinear()
    .domain([0,d3.max(data, function(d){return d.income;})])
    .rangeRound([h - padding, padding])
    .nice();

  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(6);

  var dollarFormat = d3.format('$,.2r');

  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(9)
    .tickFormat(dollarFormat);

  /* ===== dots ===== */

  var dots = svgFrame.selectAll('circle').data(data, key)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(d.age);
    })
    .attr('cy', function(d) {
      return yScale(d.income);
    })
    .attr('r', 10)
    .attr('fill', 'steelblue');

  appendAxes();
  removeDot();

  function addNewDot() {
    dots = svgFrame.selectAll('circle').data(data, key);

    updateScales();

    dots.enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(d.age);
      })
      .attr('cy', function(d) {
        return yScale(d.income);
      })
      .attr('class', 'userDot')
      .attr('r', 10)
      .attr('fill', 'darkblue')
      .attr('opacity', 0)
      .transition()
      .duration(200)
      .attr('r', 15)
      .attr('opacity', 1)
      .transition()
      .duration(500)
      .attr('r', 10)
      .attr('fill', 'steelblue');

    dots.merge(dots)
      .transition()
      .duration(500)
      .attr('cx', function(d) {
        return xScale(d.age);
      })
      .attr('cy', function(d) {
        return yScale(d.income);
      })

    dots = d3.selectAll('.userDot');
    
    removeDot()
  }

  /* ===== remove dots ===== */

  function removeDot() {
    dots.on('click', function(d) {
      
    data.splice(data.indexOf(d), 1);
  
    updateScales();
      
    d3.selectAll('circle')
      .transition()
      .duration(500)
      .attr('cx', function(d) {
        return xScale(d.age);
      })
      .attr('cy', function(d) {
        return yScale(d.income);
      })
      
      d3.selectAll('circle')
      .data(data, key)
      .exit()
      .transition()
      .duration(500)
      .attr('r', 2)
      .attr('fill', 'gray')
      .remove();    
    })  
    
  }

  /* ===== apend/update axes ===== */

  function appendAxes() {
    svgFrame.append('g')
      .attr('class', 'x_axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .style('font-size', '14px')
      .call(xAxis);

    svgFrame.append('g')
      .attr('class', 'y_axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .style('font-size', '12px')
      .call(yAxis);
  }

  function updateScales() {
    xScale
      .domain([0,d3.max(data, function(d) {return parseFloat(d.age);})])
      .nice();
    yScale
      .domain([0,d3.max(data, function(d) {return parseFloat(d.income);})])
      .nice();

    svgFrame.select('.x_axis')
      .transition()
      .duration(500)
      .call(xAxis);

    svgFrame.select('.y_axis')
      .transition()
      .duration(500)
      .call(yAxis);
  }

  /* ===== inputs and buttons ===== */

  var ageInput = d3.select('.uiPanel')
    .append('input')
    .attr('id', 'inputAge')
    .attr('placeholder', 'enter age');

  var incomeInput = d3.select('.uiPanel')
    .append('input')
    .attr('id', 'inputIncome')
    .attr('placeholder', 'enter income');

  var button_newDot = d3.select('.uiPanel')
    .append('button')
    .attr('id', 'update')
    .text('add dot');

  var button_showNew = d3.select('.uiPanel')
    .append('button')
    .attr('id', 'highlight')
    .text('show new dots');

  /* ===== new data button (ON CLICK) ===== */

  d3.select('#update').on('click', function() {
    if (
      document.getElementById('inputAge').value === '' &&
      document.getElementById('inputIncome').value === ''
    )
      return;

    var newKey =
      data.length === 0 ? 1 : parseFloat(data[data.length - 1].key) + 1;

    newDataPoint = {
      key: newKey,
      age: document.getElementById('inputAge').value,
      income: document.getElementById('inputIncome').value
    };

    data.push(newDataPoint);

    addNewDot();

    document.getElementById('inputAge').value = '';
    document.getElementById('inputIncome').value = '';
    newDataPoint = '';
  });

  /* ===== highlight new dots (ON CLICK) ===== */

  d3.select('#highlight').on('click', function() {
    d3.selectAll('.userDot')
      .transition()
      .duration(450)
      .ease(d3.easeSin)
      .attr('fill', 'tomato')
      .attr('r', 13)
      .transition()
      .duration(750)
      .ease(d3.easeBackIn)
      .attr('r', 10)
      .attr('fill', 'steelblue');
  });
}
