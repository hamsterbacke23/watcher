var tsModules = tsModules || {};

tsModules.Render = (function () {

  return {

    init: function () {
      var jqxhr = $.ajax({
        url: '/data.json',
        dataType : 'json',
        cache : false,
        success : function (data) {
          var latest = data[data.length - 1];
          $('img.preview').attr('src', latest.medium.uri);
          $('img.big').attr('src', latest.big.uri);
          tsModules.Zoom.init();

          // get time
          var date = new Date(latest.medium.time);
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();
          var seconds = "0" + date.getSeconds();
          var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          $('.time').text(formattedTime);
        }
      });

    }
  }
})();
