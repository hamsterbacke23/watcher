var tsModules = tsModules || {};

tsModules.Render = (function () {

  return {

    init: function () {
      var jqxhr = $.ajax({
        url: '/api/latest',
        dataType : 'json',
        cache : false,
        success : function (data) {
          var latest = data[data.length - 1];
          $('img.preview').attr('src', latest.images.medium);
          $('img.big').attr('src', latest.images.big);
          tsModules.Zoom.init();

          // get time
          var date = new Date(latest.timestamp);
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();
          var seconds = "0" + date.getSeconds();
          var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          $('.time').text(formattedTime);
        }
      });

    }
  };
})();
