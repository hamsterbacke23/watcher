var tsModules = tsModules || {};

// load modules
$(function () {
  tsModules.PageRefresher.init();
  tsModules.Render.init();
  tsModules.Gauges.init();
  tsModules.Zoom.init();
  tsModules.Chart.init();
});

// redirect to latest entry
$(function () {
  var endpoint = '/api/one/latest';
  var data = tsModules.Router.getDataFromHashUrl();
  var hash = location.hash.replace('#', '');
  if(!hash) {
    $.ajax({
      url : endpoint,
      dataType : 'json',
      cache : false,
      success: function (data) {
        if(!data) {
          return;
        }
        window.location = window.location + '#' + data[0].timestamp;
      }
    });
  }

});
