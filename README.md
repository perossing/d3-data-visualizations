# d3-data-visualizations

multiple projects using d3 for different types of data visualizations using a variety of public data in json and csv format.  Most use svg.


**SUMMARY OF PROJECTS:**
-----

## d3 data story:

Multiple chart types & data used with design (color, layout, type) to tell a story with data

view at https://d3-data-story.glitch.me/

*note: design is not responsive, best viewed on full-size monitor*


## d3 line chart:

timeline with two variables

- transitions, clip paths, and gradients
- buttons to show different data sets
- data from U.S. Energy Information Administration

view at https://d3-timeline-chart.glitch.me/


## d3 scatter plots:

### 1) Multivariate Scatter Plot

Using movie box-office data from boxofficemojo.com, this chart plots:

 - the number of movie tickets sold each year from 2000-2014 (y axis)

   *against*

- the number of major-release movies each year (x axis)

Average ticket price per year is indicated with a label next to each circle and is reflected in the size of the circles.

Axes labels and legend are added with html/css.

view at https://d3-scatterplot.glitch.me/


### 2) Interactive Scatter Plot

Data from random sample plotting age & income:

- users can add new data point
- users can highlight the data points they've added
- users can delete data points on click
- scales and axes adjust with new/deleted data points

view at https://d3-interactive-scatterplot.glitch.me/


## d3 svg barcharts:

[horizontal bar chart](https://d3-horizontal-bar-chart.glitch.me/)

[vertical bar chart](https://d3-svg-barchart.glitch.me/)


## Text-based table from json data:

- Special table rows are inserted as headings to separate categories, appearing only before the first item in each group.

- Table colors denote groups and high values.

- preview at https://d3-json-html.glitch.me

## d3 small multiples:

- Four bar charts built with one function from USDA data put into json format.
- Compares food imports to US from 2000 -2014
- charts drawn with svg
- svg tooltips on hover

view at https://d3-small-multiple-svg-json.glitch.me/


