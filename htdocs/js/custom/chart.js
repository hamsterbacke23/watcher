var tsModules = tsModules || {};

tsModules.Chart = (function () {

  var endpoint = '/api/';
  var rangeSelectSel = '[name="selectDayRange"]';

  return {

    init: function () {
      // this.setChart(0);
      this.initRangeSelect();
    },

    setChart: function (sinceTime) {
      var self = this;
      $.ajax({
        url : endpoint + sinceTime,
        dataType : 'json',
        cache : false,
        success : function (data) {
          if(!data) {
            return;
          }
          self.createChart(data, sinceTime);
        }
      });
    },

    setRangeSelectData : function ($el) {
      var days = parseInt($el.val(), 10);

      var d = new Date();
      this.setChart(d.setDate(d.getDate() + days));
    },

    initRangeSelect: function () {
      var self = this;
      var $select = $(rangeSelectSel);

      $select.on('change', function () {
        var $this = $(this);
        self.setRangeSelectData($this);
      });
      this.setRangeSelectData($select);

    },

    createChart: function (data, sinceTime) {
      var d3 = window.d3;
      // Get the data
      data.forEach(function(d) {
        d.date = d.timestamp ? new Date(d.timestamp) : null;
        d.humidity =  d.humidity ? +d.humidity : null;
        d.temperature = d.temperature ? +d.temperature : null;
      });
      // Set the dimensions of the canvas / graph
      var margin = {top: 20, right: 40, bottom: 20, left: 40},
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

      var yAxisRight = d3.svg.axis().scale(y0)
        .orient('right').ticks(5);

      var yAxisLeft = d3.svg.axis().scale(y1)
        .orient('left').ticks(5);

      // Define the line
      var valueline0 = d3.svg.line()
        .defined(function(d) { return d.humidity && d.date; })
        .x(function(d) { return x(new Date(d.date)); })
        .y(function(d) { return y0(d.humidity); });

      var valueline1 = d3.svg.line()
        .defined(function(d) { return d.temperature && d.date; })
        .x(function(d) { return x(new Date(d.date)); })
        .y(function(d) { return y1(d.temperature); });

      var area1 = d3.svg.area()
        .defined(valueline1.defined())
        .x(valueline1.x())
        .y1(valueline1.y())
        .y0(y1(0));

      var area0 = d3.svg.area()
        .defined(valueline0.defined())
        .x(valueline0.x())
        .y1(valueline0.y())
        .y0(y0(0));

      // Adds the svg canvas
      var svg = d3.select('#chart');
      svg.selectAll('svg > *').remove();

      svg = d3.select('#chart')
              .attr('viewBox', '0 0 '  +
                 (width + margin.left + margin.right) + ' ' +
                 (height + margin.top + margin.bottom))
              .attr('preserveAspectRatio', 'xMidYMid meet')
          .append('g')
              .attr('transform',
                    'translate(' + margin.left + ',' + margin.top + ')');

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y0.domain([
        d3.min(data, function(d) { return d.humidity; }),
        d3.max(data, function(d) { return d.humidity; })
      ]);
      y1.domain([
        d3.min(data, function(d) { return d.temperature; }),
        d3.max(data, function(d) { return d.temperature; })
      ]);

      svg.append('path')
        .attr('class', 'chartline temperature')
        .attr('d', valueline1(data));

      svg.append('path')
        .attr('class', 'chartline humidity')
        .attr('d', valueline0(data));


      // Add the X Axis
      svg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      // Add the Z Axis
      svg.append('g')
        .attr('class', 'y-axis-right y-axis axis')
        .attr('transform', 'translate(' + width + ' ,0)')
        .call(yAxisRight);

      // Add the Y Axis
      svg.append('g')
        .attr('class', 'y-axis-left y-axis axis')
        .call(yAxisLeft);

      // Area
      svg.append('path')
          .datum(data)
          .attr('class', 'area area-humidity')
          .attr('d', area0);

      svg.append('path')
          .datum(data)
          .attr('class', 'area area-temperature')
          .attr('d', area1);

      //points
      svg.selectAll('.bobble.bobble-temperature')
           .data(data)
         .enter().append('a')
           .attr('class', 'bobble bobble-temperature')
           .attr('xlink:href', function(d) {
              return endpoint + d.timestamp;
            })
             .append('circle')
             .attr('cx', valueline1.x())
             .attr('cy', valueline1.y())
             .attr('r', 3.5);

      svg.selectAll('.bobble.bobble-humidity')
           .data(data)
         .enter().append('a')
           .attr('class', 'bobble bobble-humidity')
           .attr('xlink:href', function(d) {
              return endpoint + d.timestamp;
            })
             .append('circle')
             .attr('cx', valueline0.x())
             .attr('cy', valueline0.y())
             .attr('r', 3.5);
    }
  };
})();
