var d3
var data
var colorPalette = ['#8adaf5', '#ffbf80', '#e6d299', '#d2c0ac', '#96e9d4', '#c7e963', '#ffadad']

/* === SET DATA & CALL BUILD-CHART FUNCTIONS === */

var sortBy = 'numeric'

/* --  pie --  */
d3.json('data.json', function (dataset) {
  data = dataset.animals
  buildPieChart(sortBy)
})

/* -- stacked -- */
d3.json('data.json', function (dataset) {
  data = dataset.pets
  buildStackChart()
})

/* -- bar -- */
d3.json('data.json', function (dataset) {
  data = dataset.households
  buildBarChart()
})

/* ===== INPUT & ON-CLICK TO SORT & RESET PIE CHART ===== */

d3.select('input[value=\'number\']').property('checked', true)

var input = d3.selectAll('.sortChart')
  .on('change', sortChart)

var numberRadio = document.querySelector('#number')

function sortChart() {

  if (numberRadio.checked) {
    sortBy = 'numeric'
  } else {
    sortBy = 'alpha'
  }

  d3.json('data.json', function (dataset) {
    data = dataset.animals

    d3.selectAll('wedges')
      .attr('opacity', 1)
      .transition().duration(500)
      .attr('opacity', 0.75)

    d3.selectAll('pieLabels')
      .attr('opacity', 1)
      .transition().duration(500)
      .attr('opacity', 0.25)

    d3.selectAll('.pieChart').remove()
    d3.selectAll('.pieInfo').remove()
    d3.selectAll('.piePlaceHolder').remove()
    buildPieChart(sortBy)
  })
}

function sortAlpha() {
  var sortedPie = d3.pie()
    .value(function (d) {
      return d.value
    })
    .sort(function (a, b) {
      return d3.ascending(a.name, b.name)
    })

  return sortedPie
}

function sortNumeric() {
  var sortedPie = d3.pie()
    .value(function (d) {
      return d.value
    })
    .sort(function (a, b) {
      return d3.ascending(a.value, b.value)
    })

  return sortedPie
}


/* **************** PIE CHART **************** */

function buildPieChart(sortBy) {

  var pieW = 500
  var pieH = 500

  var pieSVG = d3.select('.pieContainer').append('svg').attr('class', 'pieChart').attr('width', pieW).attr('height', pieH)

  var outerRadius = pieW / 2
  var innerRadius = outerRadius * 0.4

  var sum = d3.sum(data, function (d) {
    return d.value
  })

  var pie

  if (sortBy === 'alpha') {
    pie = sortAlpha()
  } else {
    pie = sortNumeric()
  }

  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(.04)
    .padRadius(100)
    .cornerRadius(4)

  var wedges = pieSVG.selectAll('g.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'wedges')
    .attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')')

  wedges.append('path')
    .attr('fill', function (d, i) {
      return colorPalette[i]
    })
    .attr('d', arc)
    .attr('opacity', 0.75)
    .transition().duration(500)
    .attr('opacity', 1)

  /* ===== PIE CHART INFO ===== */

  var info = d3.select('.pieContainer')
    .append('p')
    .attr('class', 'info pieInfo')
    .text('Of ' + sum.toFixed(2) + ' million pets ...')

  /* ===== PIE TOOLTIPS ===== */

  var group = d3.selectAll('.wedges')

  var toolTip = d3.select('.pieContainer').append('div').attr('class', 'toolTip pieTip')
  var tipPlaceholder = d3.select('.pieContainer').append('div').attr('class', 'placeHolder piePlaceHolder').text('move mouse over circle wedges')

  group
    .on('mouseover', function (d) {
      tipPlaceholder
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0)

      toolTip.style('display', 'inline-block')
        .text(((d.value / sum) * 100).toFixed(1) + '% are ' + d.data.name)
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1)
    })

  group
    .on('mouseout', function (d) {
      toolTip.style('display', 'none')
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0)

      tipPlaceholder
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1)
    })

  /* ===== ARC LABELS ===== */

  var labelArc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius + outerRadius / 1.85)

  var pieLabels = wedges.append('text')
    .attr('transform', function (d) {
      var placement
      if (d.data.value / sum <= 0.10) {
        var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI
        placement = 'translate(' + labelArc.centroid(d)[0] + ',' + labelArc.centroid(d)[1] + ') rotate(-90) rotate(' + (midAngle * 180 / Math.PI) + ')'
      } else {
        placement = 'translate(' + arc.centroid(d) + ')'
      }
      return placement
    })
    .attr('dy', '0.35em')
    .text(function (d) {
      return d.data.name + ': ' + (d.value).toFixed(1)
    })
    .attr('text-anchor', function (d) {
      var anchor = d.endAngle < Math.PI ? 'end' : 'start'
      if (d.value / sum >= 0.10) {
        anchor = 'middle'
      }
      return anchor
    })
    .attr('d', arc)
    .attr('opacity', 0.25)
    .transition().duration(500)
    .delay(100)
    .attr('opacity', 1)
}


/* **************** STACK CHART **************** */

function buildStackChart() {

  var stackW = 125
  var stackH = 490

  var stackSVG = d3.select('.stackContainer').append('svg').attr('width', stackW).attr('height', stackH)

  var sum = d3.sum(data, function (d) {
    return d.value
  })

  var barSum = 0
  var last;

  var stackPalette = ['#aaa', '#664db3']

  var xScale = d3.scaleBand()
    .domain([0, data.length])
    .range([0, stackW])

  var yScale = d3.scaleLinear()
    .domain([0, d3.sum(data, function (d) {
      return d.value
    })])
    .range([0, stackH])

  /* ===== STACK CHART BARS ===== */

  var group = stackSVG.selectAll('g')
    .data(data)
    .enter()
    .append('g')

  var bars = group
    .append('rect')
    .attr('class', 'bars')
    .attr('x', stackW * 0.4)
    .attr('y', function (d, i) {
      if (i === 0) last = 0
      else last = i - 1
      barSum = (barSum + data[last].value)
      return yScale(barSum - data[0].value)
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d, i) {
      return yScale(d.value)
    }, barSum = 0)
    .attr('fill', function (d, i) {
      return stackPalette[i]
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  /* ===== STACK CHART LABELS ===== */

  var percentLabels = group
    .append('text')
    .attr('class', 'stackLabels')
    .text(function (d) {
      return d.value
    })
    .attr('text-anchor', 'middle')
    .attr('x', stackW * 0.65)
    .attr('y', function (d, i) {
      if (i === 0) last = 0
      else last = i - 1
      barSum = (barSum + data[last].value)
      return yScale(barSum - data[0].value) + 50
    }, barSum = 0)
    .attr('font-size', 18)
    .attr('fill', '#fff')
    .attr('font-weight', '500')

  var barLabels = group.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', function (d, i) {
      if (i === 0) last = 0
      else last = i - 1
      barSum = (barSum + data[last].value)
      return -yScale(barSum - data[0].value) - 20
    }, barSum = 0)
    .attr('y', 30)
    .text(function (d) {
      return d.name
    })
    .attr('text-anchor', 'end')
    .attr('fill', function (d, i) {
      return stackPalette[i]
    })
    .attr('font-size', 18)
    .attr('font-weight', '500')

  /* ===== STACK CHART TOOLTIPS ===== */

  var toolTip = d3.select('.stackContainer').append('div').attr('class', 'stackTip')

  group
    .on('mouseover', function (d) {

      toolTip.style('display', 'inline-block')
        .text(((d.value / sum) * 100).toFixed(0) + '%')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px')
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 0.85)
    })
  group
    .on('mouseout', function (d) {
      toolTip.style('display', 'none')
        .style('opacity', 0.85)
        .transition()
        .duration(250)
        .style('opacity', 0)
    })

  /* ===== STACK CHART DATA in BAR CHART INFO ===== */

  var info = d3.select('.barContainer')
    .append('p')
    .attr('class', 'info barInfo')
    .text('Of ' + data[1].value.toFixed(1) + ' million households with pets ...')
}


/* **************** BAR CHART **************** */

function buildBarChart() {

  var barW = 325
  var barH = 330

  var barSVG = d3.select('.barContainer').append('svg').attr('width', barW).attr('height', barH)

  var barSpacing = barH / data.length
  var barThickness = barH / data.length - 3

  var xScale = d3.scaleLinear()
    .domain([0, 61])
    .range([0, barW])

  var yScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([barH, 0])

  var group = barSVG.selectAll('g')
    .data(data)
    .enter()
    .append('g')

  /* ===== HORIZONTAL BARS =====*/

  var bars = group
    .append('rect')
    .attr('class', 'bars')
    .attr('y', function (d, i) {
      return i * (barSpacing)
    })
    .attr('height', function (d) {
      return barH - yScale(barThickness / barSpacing)
    })
    .attr('fill', function (d, i) {
      return colorPalette[i]
    })
    .attr('rx', 3)
    .attr('ry', 3)
    // bar width is animated
    .transition().delay(400).duration(750)
    .attr('width', function (d) {
      return xScale(d.value)
    })

  /* ===== BAR LABELS =====*/

  var barText = group
    .append('text')
    .attr('class', 'barLabel')
    .text(function (d, i) {
      return d.name + ', ' + d.value
    })
    .attr('text-anchor', 'start')
    .attr('x', 25)
    .attr('y', function (d, i) {
      return i * (barSpacing)
    })
    .attr('dy', 24)
    .attr('opacity', 0)
    .transition().delay(500).duration(1000)
    .attr('opacity', 1)


  var sum = d3.sum(data, function (d) {
    return d.value
  })

  /* ===== BAR CHART TOOLTIPS ===== */

  var toolTip = d3.select('.barContainer').append('div').attr('class', 'toolTip barTip')
  var tipPlaceholder = d3.select('.barContainer').append('div').attr('class', 'placeHolder barPlaceHolder').text('move mouse over bars')

  group
    .on('mouseover', function (d) {
      tipPlaceholder
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0)

      toolTip.style('display', 'inline-block')
        .text(((d.value / sum) * 100).toFixed(1) + '% have ' + d.name)
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1)
    })
  group
    .on('mouseout', function (d) {
      toolTip.style('display', 'none')
        .style('opacity', 1)
        .transition()
        .duration(250)
        .style('opacity', 0)

      tipPlaceholder
        .style('opacity', 0)
        .transition()
        .duration(250)
        .style('opacity', 1)
    })

  /* ===== BAR CHART NOTE ===== */

  var info = d3.select('.barContainer')
    .append('p')
    .attr('class', 'info noteInfo')
    .text('numbers include households with more than one pet')

}