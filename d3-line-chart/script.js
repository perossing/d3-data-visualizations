let data;
let d3 = window.d3;
let w = 800, h = 400, padding = 20;
let svg = d3.select('.chart').append('svg').attr('width', w).attr('height', h);
let clipDivide = 0.62 * w;  // proportion for widths of clip paths to contain shading of upper lines

function dateConverter(d) {
    let dateString = (d.YYYYMM)
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let date = new Date(year, month - 1)
    return date;
}

function typeConverter(d) {
    return {
        date: dateConverter(d),
        nuclear: parseFloat(d.nuclear),
        renewable: parseFloat(d.renewable)
    }
}

d3.csv('energy_month.csv', typeConverter, function (dataset) {
    data = dataset;
    buildLineChart(clipDivide)
})

function buildLineChart(clipDivide) {

    /* ==== X & Y SCALES ===== */

    let xScale = d3.scaleTime()
        .domain([d3.min(data, function (d) {
                return d.date
            }),
            d3.max(data, function (d) {
                return d.date
            })
        ])
        .rangeRound([padding, w - padding]);

    let yScale = d3.scaleLinear()
        .domain([0, 1])
        .rangeRound([h - padding, padding])
        .nice();

    /* ==== LINES w transition ===== */

    let wipe = svg.append('clipPath')
        .attr('id', 'chart-area')
        .append('rect')
        .attr('x', padding)
        .attr('y', padding)
        .attr('width', 0)
        .attr('height', h - padding * 2)
        .transition()
        .duration(1000)
        .attr('width', w - padding * 2)

    let nuclearLine = d3.line()
        .x(function (d) {
            return xScale(d.date)
        })
        .y(function (d) {
            return yScale(d.nuclear)
        });

    let renewableLine = d3.line()
        .x(function (d) {
            return xScale(d.date)
        })
        .y(function (d) {
            return yScale(d.renewable)
        })

    svg.append('path')
        .datum(data)
        .attr('class', 'line nuclear')
        .attr('d', nuclearLine)
        .attr('clip-path', 'url(#chart-area)');

    svg.append('path')
        .datum(data)
        .attr('class', 'line renewable')
        .attr('d', renewableLine)
        .attr('clip-path', 'url(#chart-area)');

    /* ==== AREAS w shading ===== */

    let nuclearArea = d3.area()
        .x(function (d) {
            return xScale(d.date);
        })
        .y0(function (d) {
            return yScale(d.renewable);
        })
        .y1(function (d) {
            return yScale(d.nuclear);
        });

    let renewableArea = d3.area()
        .x(function (d) {
            return xScale(d.date);
        })
        .y0(function (d) {
            return yScale(d.nuclear);
        })
        .y1(function (d) {
            return yScale(d.renewable);
        });

    let nuclearGradient = svg.append('defs').append('linearGradient')
        .attr('id', 'nuclear-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
    nuclearGradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', '#ff4d4d')
        .style('stop-opacity', 1);
    nuclearGradient.append('stop')
        .attr('offset', '80%')
        .style('stop-color', '#fff')
        .style('stop-opacity', 1)

    let renewableGradient = svg.append('defs').append('linearGradient')
        .attr('id', 'renewable-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
    renewableGradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', '#868613')
        .style('stop-opacity', 1);
    renewableGradient.append('stop')
        .attr('offset', '37%')
        .style('stop-color', '#fff')
        .style('stop-opacity', 1);

    svg.append('clipPath')
        .attr('id', 'nuclear-clip')
        .append('rect')
        .attr('x', padding)
        .attr('y', padding)
        .attr('width', clipDivide)
        .attr('height', h - padding * 2)

    svg.append('clipPath')
        .attr('id', 'renewable-clip')
        .append('rect')
        .attr('x', clipDivide + padding)
        .attr('y', padding)
        .attr('width', w - clipDivide - padding * 2)
        .attr('height', h - padding * 2)

    svg.append('path')
        .datum(data)
        .attr('class', 'renewableArea')
        .attr('d', renewableArea)
        .attr('clip-path', 'url(#renewable-clip)')
        .attr('fill', 'url(#renewable-gradient)')
        .attr('opacity', 0)
        .transition()
        .duration(1200)
        .attr('opacity', 0.60)

    svg.append('path')
        .datum(data)
        .attr('class', 'nuclearArea')
        .attr('d', renewableArea)
        .attr('clip-path', 'url(#nuclear-clip)')
        .attr('fill', 'url(#nuclear-gradient)')
        .attr('opacity', 0)
        .transition()
        .duration(1200)
        .attr('opacity', 0.60)


    /* ==== AXES ===== */

    let labelScale = d3.scaleLinear()
        .domain([2000, 2017])
        .rangeRound([padding, w - padding]);

    let xAxis = d3.axisBottom()
        .scale(labelScale)
        .ticks(15)
        .tickFormat(d3.format('d'));

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let gridLines = d3.axisTop()
        .scale(labelScale)
        .ticks(15)
        .tickSize(h - padding * 2)
        .tickFormat('');

    svg.append('g')
        .attr('class', 'yearLines')
        .attr('transform', 'translate(0,' + (h - padding) + ')')
        .call(gridLines);

    svg.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0,' + (h - padding) + ')')
        .style('font-size', '13px')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'axis y')
        .attr('transform', 'translate(' + padding + ',0)')
        .style('font-size', '13px')
        .call(yAxis);

    svg.selectAll('.axis.x text')
        .attr('text-anchor', 'left')
        .attr('x', 23);

    /* ===== TOOLTIPS ===== */

    let leftSide = svg.append('rect')
        .attr('id', 'left-side')
        .attr('x', padding)
        .attr('y', 100)
        .attr('width', clipDivide - 5)
        .attr('height', 125)
        // .attr('stroke', 'gray')
        .attr('fill', 'white')
        .attr('opacity', 0)

    let rightSide = svg.append('rect')
        .attr('id', 'right-side')
        .attr('x', clipDivide + padding)
        .attr('y', 50)
        .attr('width', w - clipDivide - padding * 2)
        .attr('height', 125)
        // .attr('stroke', 'gray')
        .attr('fill', 'white')
        .attr('opacity', 0);

    d3.select('#left-side')
        .on('mouseover', function (d) {
            d3.select('.container')
                .append('p')
                .attr('class', 'tooltip1')
                .text('Consumption of nuclear energy has exceeded renewable since 1988')
                .style('opacity', 0)
                .transition()
                .duration(350)
                .style('opacity', 1)
        })
        .on('mouseout', function (d) {
            d3.select('.tooltip1')
                .transition()
                .duration(300)
                .style('opacity', 0)
                .remove();
        });

    d3.select('#right-side')
        .on('mouseover', function (d) {
            d3.select('.container')
                .append('p')
                .attr('class', 'tooltip2')
                .text('Consumption of renewable energy has grown faster than nuclear since 2001, exceeding nuclear consumption in 2011')
                .attr('text-anchor', 'right')
                .attr('x', 225)
                .attr('y', 255)
                .style('opacity', 0)
                .transition()
                .duration(350)
                .style('opacity', 1)
        })
        .on('mouseout', function (d) {
            d3.select('.tooltip2')
                .transition()
                .duration(300)
                .style('opacity', 0)
                .remove();
        });
  
  
  /* ===== LEGEND LABELS ===== */
  
  svg.append('text')
    .text('nuclear consumption')
    .attr('fill', '#ff4d4d')
    .attr('x', 45)
    .attr('y', 85)
    .attr('font-size', 14);
  
  svg.append('text')
    .text('renewable consumption')
    .attr('fill', '#868613')
    .attr('x', 40)
    .attr('y', 280)
    .attr('font-size', 14);

}



/* ===== BUTTON CLICK: CHANGE DATA ===== */

d3.select('#yearBtn').on('click', function () {
    d3.csv('energy_year.csv', typeConverter, function (dataset) {
        data = dataset;

        svg.selectAll('clipPath')
            .remove();
        svg.selectAll('path')
            .remove();
        svg.selectAll('g')
            .remove();
        svg.selectAll('rect')
            .remove();
      
        clipDivide = 0.635 * w;
        buildLineChart(clipDivide);

    })
})

d3.select('#monthBtn').on('click', function () {
    d3.csv('energy_month.csv', typeConverter, function (dataset) {
        data = dataset;

        svg.selectAll('clipPath')
            .remove();
        svg.selectAll('path')
            .remove();
        svg.selectAll('g')
            .remove();
        svg.selectAll('rect')
            .remove();
                
        clipDivide = 0.62 * w;
        buildLineChart(clipDivide)

    })
})