var data;
var d3;

d3.json("food_imports.json", function(dataset) {
  data = dataset;
  buildCharts();
});

function buildCharts() {
  var dataLength = Object.keys(data.Canada.imports).length;
  var w = 500;
  var h = w / 2;
  var padding = 25;
  var chart, xAxis, yAxis;

  /* ===== scales ===== */

  var xScale = d3
    .scaleBand()
    .domain(d3.range(dataLength))
    .rangeRound([padding, w - padding])
    .paddingInner(0.1)
    .paddingOuter(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([0, 225])
    .rangeRound([h - padding, padding])
    .nice();

  /* ===== CANADA ===== */

  var Canada = setupSVG();
  chart = setupChart(Canada, data.Canada.imports, 20);
  runChartFunctions("#FFC107", Canada, "Canada");

  /* ===== MEXICO ===== */

  var Mexico = setupSVG();
  chart = setupChart(Mexico, data.Mexico.imports, 20);
  runChartFunctions("#CDDC39", Mexico, "Mexico");

  /* ===== CHINA ===== */

  var China = setupSVG();
  chart = setupChart(China, data.China.imports, -5);
  runChartFunctions("#8BC34A", China, "China");

  /* ===== INDIA ===== */

  var India = setupSVG();
  chart = setupChart(India, data.India.imports, -5);
  runChartFunctions("#FF9800", India, "India");

  /* ===== SVG & chart setup ===== */

  function setupSVG() {
    var newSvg = d3
      .select(".container")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    return newSvg;
  }

  function setupChart(country, data, tooltipOffset) {
    var newChart = country
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .on("mouseover", function(d) {
        var xPosition = parseFloat(
          d3
            .select(this)
            .select("rect")
            .attr("x")
        );
        var yPosition = parseFloat(
          d3
            .select(this)
            .select("rect")
            .attr("y")
        );
        country
          .append("text")
          .attr("id", "tooltip")
          .text(function() {
            return "$" + d.dollars;
          })
          .attr("text-anchor", "start")
          .attr("x", xPosition)
          .attr("y", yPosition + tooltipOffset)
          .attr("font-family", "sans-serif")
          .attr("font-size", "14px")
          .attr("fill", "black");
      })
      .on("mouseout", function(d) {
        d3.select("#tooltip").remove();
      });
    return newChart;
  }

  /* ===== axes ===== */

  function makeXAxis() {
    var axis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues([])
      .tickSize(0)
      .tickPadding(10);
    return axis;
  }

  function makeYAxis() {
    var axis = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5);
    return axis;
  }

  function appendAxes(country) {
    country
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    country
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);
  }

  /* ===== bars & labels ===== */

  function makeBars(barColor) {
    var bars = chart
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("y", function(d) {
        return yScale(d.dollars);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return h - yScale(d.dollars) - padding;
      })
      .attr("fill", barColor);

    return bars;
  }

  function labelBars() {
    var barLabels = chart
      .append("text")
      .text(function(d) {
        return "'" + d.year.toString().slice(2);
      })
      .attr("text-anchor", "start")
      .attr("x", function(d, i) {
        return xScale(i) + 5;
      })
      .attr("y", h - 10)
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("fill", "#000");

    return barLabels;
  }

  function addTitle(country, countryName) {
    country
      .append("text")
      .attr("x", w / 8)
      .attr("y", h / 4)
      .text(countryName.toUpperCase())
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "#111");
  }

  function runChartFunctions(color, country, countryName) {
    makeBars(color);
    labelBars();
    xAxis = makeXAxis();
    yAxis = makeYAxis();
    appendAxes(country);
    addTitle(country, countryName);
  }
}
