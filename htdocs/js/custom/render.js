var tsModules = tsModules || {};

tsModules.Render = (function () {
  var endpoint = '/api/one/';

  return {

    setHashChangeListener : function () {
      var self = this;
      window.addEventListener('hashchange', function () {
        self.getData();
      }, false);
      self.getData();
    },

    init: function () {
      this.setHashChangeListener();
      $('.container').append($('<div class="emptypreview"></div>'));
    },

    getData: function (startTime, rangeTime) {
      var self = this;

      var data = tsModules.Router.getDataFromHashUrl();
      var apiurl = endpoint + data.startTime + '/' + data.rangeTime;

      var jqxhr = $.ajax({
        url: apiurl,
        dataType : 'json',
        cache : false,
        success : function (data) {
          var latest = data[data.length - 1];

          // crappy fallback when no images are available
          $('img.preview').attr('style', '');
          if(!latest || !latest.images || !latest.images.medium || !latest.images.big) {
            latest = latest ? latest : {};
            latest.images = {};
            latest.images.medium = latest.images.big = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            $('img.preview').css({
              width: '100%',
              height: '40vh'
            });
          }

          $('img.preview').attr('src', latest.images.medium);
          $('img.big').attr('src', latest.images.big);

          tsModules.Zoom.init();

          // get time
          var date = new Date(latest.timestamp);
          var locale = 'en-us';
          var month = date.toLocaleString(locale, { month: 'short'});
          var day =  date.toLocaleString(locale, { day: 'numeric'});
          var hours = date.getHours();
          var minutes = '0' + date.getMinutes();
          var seconds = '0' + date.getSeconds();
          var formattedTime = day + '. ' + month + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          $('.time').text(formattedTime);
        }
      });

    }
  };
})();
