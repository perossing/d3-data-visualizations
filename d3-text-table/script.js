var data;
var d3;
var dataFile = "sugars_Alcohol.json";

d3.json(dataFile, function(dataset) {
  data = dataset;
  buildIt();
});

function buildIt() {
  var beerCount = 0;
  var wineCount = 0;
  var otherCount = 0;
  var count = 0;

  d3
    .select("table")
    .selectAll("tr")
    .data(data.report.foods)
    .enter()
    .append("tr")
    .html(function(d) {
      var categoryClass = "";
      var categoryName = "";

      if (d.name.indexOf("beer") > -1) {
        count = beerCount++;
        categoryClass = "beerFormat";
        categoryName = "beers";
        return createTableRow();
      }

      if (d.name.indexOf("wine") > -1) {
        count = wineCount++;
        categoryClass = "wineFormat";
        categoryName = "wines";
        return createTableRow();
      } else {
        count = otherCount++;
        categoryClass = "otherFormat";
        categoryName = "other";
        return createTableRow();
      }

      function createTableRow() {
        var name = d.name.replace("Alcoholic beverage, ", "");
        var beverageName = name.charAt(0).toUpperCase() + name.slice(1);
        var sugarQty = d.nutrients[0].gm;
        var sugarClass = sugarRating(sugarQty);
        var categoryHeader = "";
        var openCol1Td = '<td class="firstColumn ' + categoryClass + '">';
        var openCol2Td =
          '<td class="' + sugarClass + " " + categoryClass + '">';

        if (count < 1) {
          categoryHeader =
            '<tr><td class="fullWidth ' +
            categoryClass +
            '">' +
            categoryName +
            "</td></tr>";
        }

        return (
          categoryHeader +
          openCol1Td +
          beverageName +
          "</td>" +
          openCol2Td +
          sugarQty +
          " gm</td>"
        );
      }

      function sugarRating(sugarQty) {
        var className = "";
        if (Number(sugarQty) > 6) {
          className = "highSugar";
        }
        return className;
      }
    });
}
