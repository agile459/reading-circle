if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
        visualise();
    });
}

var totalPages = 269;
var restPages = totalPages;

function visualise() {
  // the element to be filled in the HTML file
  const chartContainer = d3.select('#chart-container');

  // overall SVG dimensions
  const svgWidth = 720;
  const svgHeight = 400;

  // margins also accommodate dimensions of axes labels
  const margin = {top: 40, left: 40, bottom: 40, right: 40};

  // chart dimensions = overall dimensions minus margins
  const w = svgWidth - margin.left - margin.right;
  const h = svgHeight - margin.top - margin.bottom;

  // create the SVG
  const svg = chartContainer
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

  // create an SVG group to hold the chart contents
  const chart = svg.append('g')
      .attr('id', 'chart')
      .attr('transform', 'scale(1, 1) translate(' + margin.left + ',' + margin.top + ')')
      .attr('width', w)
      .attr('height', h);

  var x = d3.scaleTime()
      .rangeRound([0, w]);

  var y = d3.scaleLinear()
      .rangeRound([h, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.pages); });

  d3.csv("data_fc.csv", pageCount, function(error, data) {
    if (error) throw error;
    console.log("csv", data);
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, totalPages]);

    chart.append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x))
      .select(".domain");

    chart.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Pages");

    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.rest); })
      .attr("width", 15)
      .attr("height", function(d) { return h - y(d.rest); });

  });

}

function pageCount(d) {
  d.date = Date.parse(d.date);
  d.rest = d.pages;
  d.pages = +d.pages;
  restPages -= d.pages;
  d.pages = restPages;
  return d;
}
