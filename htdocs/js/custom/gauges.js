var tsModules = tsModules || {};

tsModules.Gauges = (function () {

    var wrapperSelector = '.gaugewrapper';
    var tempSelector = '.temperature .meta';
    var humidSelector = '.humidity .meta';
    var maxTemp = 25;
    var minTemp = 19;
    var maxHumid = 65;
    var minHumid = 25;
    var tempDelta = maxTemp - minTemp;
    var humidDelta = maxHumid - minHumid;
    var metaEndpoint = '/api/latest';

    return {
      init: function () {
        var self = this;
        $.ajax({
          url : metaEndpoint,
          dataType : 'json',
          cache : false,
          success : function (data) {
            var latest = data[data.length - 1];
            $(tempSelector).html(latest.temperature);
            $(humidSelector).html(latest.humidity);
            self.setGauges();
          }
        });
      },

      calcDegrees : function (value, minimum, delta) {
        // substract mintemparature for calculation
        var calcValue = value - minimum;
        // calculate the percentage of the delta
        var percentage = calcValue / delta;
        // calculate degrees, 100% is 90
        return 180 - (percentage * 90);
      },

      setGauges : function () {
        var self = this;
        var $gauges = $('.gauge');

        $gauges.each(function() {
          var $this = $(this);
          var $meter = $this.find('.meter');
          var $wrapper = $this.closest(wrapperSelector);
          var $meta = $wrapper.find('.meta');
          var degrees, temperature, humidity;

          if ($wrapper.hasClass('temperature')) {
            temperature = parseFloat($meta.text(), 10);
            degrees = self.calcDegrees(temperature, minTemp, tempDelta);
          }

          if ($wrapper.hasClass('humidity')) {
            humidity = parseFloat($meta.text(), 10);
            degrees = self.calcDegrees(humidity, minHumid, humidDelta);
          }

          $meter.css({
            'transform' : 'rotate(' + degrees + 'deg)'
          });

        });
      }

    };

})();
