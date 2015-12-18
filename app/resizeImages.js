var pjson = require('../package.json'),
  fs = require('fs'),
  path = require('path'),
  lwip = require('lwip'),
  config = require('./config'),
  async = require('async');

var incomingFolder = '/new';
var absOutputPath = config.paths.imagesOutPath;

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
          throw err;
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
  }

  if(!images.length) {
    console.log('No new images');
    return;
  }

  var done = function () {
    // move originals
    var prefix = 'big';
    async.eachSeries(images, function(image, itemcb) {
      fs.rename(
        absOutputPath + incomingFolder + '/' + image,
        absOutputPath + '/' + prefix + '/' + image,
        itemcb
      );
    }, function () {
      cb('kklkongk');
    });

  }

  async.eachSeries(pjson.resizeSizes, function(size, callback) {
      var x = size.x;
      var y = size.y;
      var sizeKey = size.key;
      resizeImages(images, sizeKey, x, y, callback);
    }, done);
}

module.exports.go = go;







