var pjson = require('../package.json');
var fs = require('fs');
var path = require('path');
var lwip = require('lwip');
var async = require('async');

var incomingFolder = '/new';
var absOutputPath = path.resolve(__dirname + '/../' + pjson.publicPath + '/' + pjson.imageoutPathrel);

// Resize function
function resizeImages (images, size, x, y, alldone) {

  async.eachSeries(images, function(image, cb) {
    if(size === 'big' || image.substring(0,2) === '._' || !x || !y) {
      cb();
      return;
    }
    var inputPath = absOutputPath + incomingFolder + '/' + image;
    var outputPath = absOutputPath + '/' + size + '/' + image;

    console.log('in', inputPath);
    console.log(' => out', outputPath);

    fs.readFile(inputPath, function(err, buffer) {
      lwip.open(buffer, 'jpg', function(err, img){
        if(err) {
          console.log(err);
          return;
        }

        img.batch()
          .resize(x,y)
          .writeFile(outputPath, function(err){
             cb();
          });
      });
    });
  }, alldone);

}

function go (cb) {
  var files = fs.readdirSync(absOutputPath + incomingFolder);
  var images = [];

  for (var i = 0; i < files.length; i++) {
    if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
        images.push(files[i]);
    }
  };

  if(images.length == 0) {
    console.log('No new images');
    return;
  }

  async.each(pjson.resizeSizes, function(size, cb) {
      var x = size.x;
      var y = size.y;
      var sizeKey = size.key;
      resizeImages(images, sizeKey, x, y, cb);
    },
    function(err) {
      if(err) {
        console.log(err);
        return;
      }
      // move originals
      var prefix = 'big';
      async.each(images, function(image) {
        fs.rename(
          absOutputPath + incomingFolder + '/' + image,
          absOutputPath + '/' + prefix + '/' + image
        );
      });
    });
}

go();








