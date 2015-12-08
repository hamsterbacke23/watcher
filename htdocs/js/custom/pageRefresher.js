var tsModules = tsModules || {};

tsModules.PageRefresher = (function () {

  return {

    init: function () {
      document.addEventListener('webkitvisibilitychange', function(evt) {
        var isVisible = !this['hidden'];
        if (isVisible) {
          window.location.reload(true);
        }
      });

      var time = new Date().getTime();
      $(document.body).bind("mousemove keypress", function(e) {
          time = new Date().getTime();
      });

      function refresh() {
          if(new Date().getTime() - time >= (60000 * 30))
              window.location.reload(true);
          else
              setTimeout(refresh, 10000);
      }

      setTimeout(refresh, 10000);
    }
  }

})();
