var tsModules = tsModules || {};

tsModules.Zoom = (function () {

  return {

    init: function () {
      var $zoomElements = $('a.enlargeme');
      $zoomElements.each(function () {

        var $this = $(this);
        var src = $this.find('img').attr('src');

        var fileName = src.replace('\/medium', '');
        console.log(fileName);
        $this.zoom({
          url: fileName,
          on : 'grab'
        });
      });

    }
  }
})();
