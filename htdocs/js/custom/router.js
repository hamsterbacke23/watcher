var tsModules = tsModules || {};

tsModules.Router = (function () {

  var standardRange = 60 * 24 * 3600 * 1000;
  var standardTime = new Date().getTime();

  return {

    getDataFromHashUrl : function() {
      var hash = location.hash.replace('#', '');
      var parts = hash.split('/');
      var rangeTime  = parts[1] ? parts[1] : standardRange;
      var startTime = parts[0] ? parts[0] : standardTime;

      return {
        startTime: startTime,
        rangeTime: rangeTime
      };
    },

    setNewHashUrl : function(startTimeNew, rangeTimeNew, toString) {
      var hash = location.hash.replace('#', '');
      var parts = hash.split('/');
      var rangeTime = standardRange;
      var startTime = standardTime;

      if(parts[0]) {
        if(!startTimeNew) {
          startTime = parts[0];
        } else {
          startTime = startTimeNew;
        }
      }
      if(parts[1]) {
        if(!rangeTimeNew) {
          rangeTime = parts[1];
        } else {
          rangeTime = rangeTimeNew;
        }
      }

      hash = '#' + startTime + '/' + rangeTime;
      if(!toString) {
        window.location.hash = hash;
      } else {
        return hash;
      }
    }
  };

})();
