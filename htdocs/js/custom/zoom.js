var tsModules = tsModules || {};

tsModules.Zoom = (function () {

  return {

    init: function () {
      var $zoomElements = $('a.enlargeme');
      $zoomElements.each(function () {

        var $this = $(this);
        var fileName = $this.find('img.big').attr('src');

        $this.zoom({
          url: fileName,
          on : 'grab'
        });
      });

    }
  };
})();
