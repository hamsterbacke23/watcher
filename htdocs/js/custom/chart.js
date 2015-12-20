var tsModules = tsModules || {};

tsModules.Chart = (function () {

  var endpoint = '/api/all';

  return {

    init: function () {
      var self = this;
      $.ajax({
        url : endpoint,
        dataType : 'json',
        cache : false,
        success : self.createChart
      });
    },

    createChart: function (data) {
      // var aspect = width / height,
      //     chart = d3.select('#chart');
      // d3.select(window)
      //   .on('resize', function() {
      //     var targetWidth = chart.node().getBoundingClientRect().width;
      //     chart.attr('width', targetWidth);
      //     chart.attr('height', targetWidth / aspect);
      //   });

      // Set the dimensions of the canvas / graph
      var margin = {top: 30, right: 50, bottom: 30, left: 50},
          width = 800 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y0 = d3.scale.linear().range([height, 0]);
      var y1 = d3.scale.linear().range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis().scale(x)
          .orient('bottom').ticks(5)
          .tickFormat(d3.time.format('%d-%b %Hh'));

      var yAxisLeft = d3.svg.axis().scale(y0)
          .orient('left').ticks(5);

      var yAxisRight = d3.svg.axis().scale(y1)
          .orient('right').ticks(5);

      // Define the line
      var valueline1 = d3.svg.line()
          .x(function(d) { return x(new Date(d.timestamp)); })
          .y(function(d) { return y0(d.humidity); });

      var valueline2 = d3.svg.line()
          .x(function(d) { return x(new Date(d.timestamp)); })
          .y(function(d) { return y1(d.temperature); });

      // Adds the svg canvas
      var svg = d3.select('#chart')
              // .attr('width', width + margin.left + margin.right)
              // .attr('height', height + margin.top + margin.bottom)
              .attr('viewBox', '0 0 '
                  + (width + margin.left + margin.right) +' '
                  + (height + margin.top + margin.bottom))
              .attr('preserveAspectRatio', 'xMidYMid meet')
          .append('g')
              .attr('transform',
                    'translate(' + margin.left + ',' + margin.top + ')');

      // Get the data
          data.forEach(function(d) {
              d.timestamp = new Date(d.timestamp);
              d.humidity = +d.humidity;
              d.temperature = d.temperature ? +d.temperature : 0;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.timestamp; }));
          y0.domain([0, d3.max(data, function(d) { return d.humidity; })]);
          y1.domain([0, d3.max(data, function(d) { return d.temperature; })]);

          svg.append("path")
                  .attr("d", valueline1(data));

          svg.append("path")
              .style("stroke", "red")
              .attr("d", valueline2(data));

          // Add the X Axis
          svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

          // Add the Z Axis
          svg.append('g')
              .attr('class', 'y1 axis')
              .attr("transform", "translate(" + width + " ,0)")
              .style("fill", "red")
              .call(yAxisRight);

          // Add the Y Axis
          svg.append('g')
              .attr('class', 'y0 axis')
              .call(yAxisLeft);

      }
    };
})();
