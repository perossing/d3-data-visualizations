var d3;
var data;

var pieW = 500;
var pieH = 500;
var stackW = 100;
var stackH = 490;
var barW = 300;
var barH = 400;

var outerRadius = pieW / 2;
var innerRadius = outerRadius * 0.4;

var colorPalette = ['#8adaf5', '#ffbf80', '#e6d299', '#d2c0ac', '#96e9d4', '#c7e963', '#ffadad']


var pieSVG = d3.select('.pieContainer').append('svg').attr('width', pieW).attr('height', pieH);
var stackSVG = d3.select('.stackContainer').append('svg').attr('width', stackW).attr('height', stackH);
var barSVG = d3.select('.barContainer').append('svg').attr('width', barW).attr('height', barH);


d3.json('data.json', function (dataset) {
  data = dataset.animals
  // resetSvg()      
  buildPieChart()
})

d3.json('data.json', function(dataset) {
  data = dataset.pets       
  // resetSvg()      
  buildStackChart()
})

d3.json('data.json', function(dataset) {
    data = dataset.households       
    // resetSvg()      
    buildBarChart()
})



d3.select('input[value=\'number\']').property('checked', true);

// var input = d3.selectAll('.sortChart')
//   .on('change', sortChart);

// var numberRadio = document.querySelector('#number')

// function sortChart() {
//   console.log(numberRadio.checked)

//   if (numberRadio.checked) {
//     //
//   } else {
//     //
//   }
//   resetSvg();
//   buildPieChart();
// }


function resetSvg() {
  pieSVG.selectAll('arcs').remove()
  pieSVG.selectAll('g').remove()
  pieSVG.selectAll('toolTip').remove()
  pieSVG.selectAll('tipPlaceholder').remove()
}


function buildPieChart() {

  var sum = d3.sum(data, function (d) {
    return d.value;
  });

  var pie = d3.pie()
    .value(function (d) {
      return d.value
    })
    // .sort(function (a, b) {
    //   return d3.ascending(a.name, b.name)})
    .sort(function (a, b) {
      return d3.ascending(a.value, b.value)
    })

  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(.04)
    .padRadius(100)
    .cornerRadius(4);

  var arcs = pieSVG.selectAll('g.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

  arcs.append('path')
    .attr('fill', function (d, i) {
      return colorPalette[i];
    })
    .attr('d', arc)

  /* ===== TOOLTIPS ===== */

  var toolTip = d3.select('body').append('div').attr('class', 'toolTip');

  var tipPlaceholder = d3.select('body').append('div').attr('class', 'placeHolder').text('hover over animal name')

  arcs
    .on('mouseover', function (d) {

      tipPlaceholder
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0);

      toolTip.style('display', 'inline-block')
        .text(((d.value / sum) * 100).toFixed(1) + '% are ' + d.data.name)
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1)
    });
  arcs
    .on('mouseout', function (d) {
      toolTip.style('display', 'none')
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0);

      tipPlaceholder
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1);
    });

  /* ===== LABELS ===== */

  var labelArc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius + outerRadius / 1.9);


  arcs.append('text')
    .attr('transform', function (d) {
      var placement;
      if (d.data.value / sum <= 0.10) {
        var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
        placement = 'translate(' + labelArc.centroid(d)[0] + ',' + labelArc.centroid(d)[1] + ') rotate(-90) rotate(' + (midAngle * 180 / Math.PI) + ')';
      } else {
        placement = 'translate(' + arc.centroid(d) + ')';
      }
      return placement;
    })
    .attr('dy', '0.35em')
    .text(function (d) {
      return d.data.name + ': ' + (d.value).toFixed(1);
    })
    .attr('text-anchor', function (d) {
      var anchor = d.endAngle < Math.PI ? 'end' : 'start';
      if (d.value / sum >= 0.10) {
        anchor = 'middle'
      };
      return anchor
    })


  var info = d3.select('body').selectAll('p')
    .append('p')
    .attr('class', 'info')
    .text('of ' + sum.toFixed(2) + ' million pets in U.S. households...')

}





function buildStackChart() {
  var barCumulator = 0;
  var labelCumulator = 0;

  // var stackPalette = ['#bbb', '#865b2d']
  var stackPalette = ['#bbb', '#6346b9']

  var xScale = d3.scaleBand()
    .domain([0, data.length])
    .range([0, stackW])
  
  var yScale = d3.scaleLinear()
    .domain([0, d3.sum(data, function (d) {return d.value})])
    .range([0, stackH])

   var group = stackSVG.selectAll('g')
    .data(data)
    .enter()
    .append('g');

  var bars = group
    .append('rect')
    .attr('x',25)
    .attr('y', function (d,i) {
      if (i === 0) last = 0
      else last = i - 1
      barCumulator = (barCumulator + data[last].value)
      return yScale(barCumulator - data[0].value)
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d,i) {
      return yScale(d.value);
    })
    .attr('fill', function (d, i) {
      return stackPalette[i];
    })  
   .attr('stroke', '#fff');   
   
   var percentLabels = group
    .append('text')
    .attr('class', 'stackLabels')
    .text(function (d) {
      return d.value;
    })
    .attr('text-anchor', 'middle')
    .attr('x', 50)
    .attr('y', function (d,i) {
      if (i === 0) last = 0
      else last = i - 1
      labelCumulator = (labelCumulator + data[last].value)
      return yScale(labelCumulator - data[0].value) + 30
    })
   
}


function buildBarChart() {
  var barPalette = ['#ccc', '#8adaf5', '#ffbf80', '#e6d299', '#d2c0ac', '#96e9d4', '#c7e963', '#ffadad']

  /* ===== SET UP CHART =====*/
  
  var barSpacing = 58;
  var barThickness = 58;
  
  var xScale = d3.scaleLinear()
    .domain([0, 61])
    .range([0,barW]);
  
  var yScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([barH,0]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    
  var yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(0);
  
  var group = barSVG.selectAll('g')
    .data(data)
    .enter()
    .append('g');
  
  
  /* ===== BARS =====*/ 

  var bars = group
    .append('rect')
    .attr('y', function(d, i) {
      // if (i===0) { barSpacing = 80; barThickness = 65}
      // else {  barSpacing = 62; barThickness = 58 }
      return i * (barSpacing)
    })
    /* bar width is set in opening animation */
    .attr('width', function(d) {
      return xScale(d.value);
    })
    .attr('height', function(d) {
      return barH - yScale(barThickness/barSpacing);
    })
    .attr('fill', function (d, i) {
      return barPalette[i];
    })


   /* ===== BAR TEXT =====*/
  
  var textLabels = group
    .append('text')
    .attr('class', 'barLabel')
    .text(function (d, i) {
      if (i===0) return d.name
      return d.name + ', '+ d.value;
    })
    .attr('text-anchor', 'start')
    .attr('x', function (d,i) {
      if (i===0) return 0
      return 25;
    })
    .attr('y', function(d, i) {
      return i * (barSpacing) + (barSpacing /2);
    });

    var sum = d3.sum(data, function (d) {
      return d.value;
    });

    // var info = d3.select('body').selectAll('p')
    // .append('p')
    // .attr('class', 'householdInfo')
    // .text('of ' + sum.toFixed(2) + ' million U.S,households with pets in ...')



}