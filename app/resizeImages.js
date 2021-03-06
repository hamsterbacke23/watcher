var fs = require('fs'),
  path = require('path'),
  lwip = require('lwip'),
  config = require('./config'),
  async = require('async');

var incomingFolder = '/new';
var absOutputPath = config.paths.imagesOutPath;
var publicOutputPath = config.paths.imagesOutPublicPath;


/**
 * Resizes a single image
 */
function resizeImage (image, size, x, y, recordResizeCb, resizeDoneCb) {

  var singleItem = {};

  if(image.substring(0,2) === '._' || !x || !y) {
    resizeDoneCb();
    return;
  }
  var inputPath = absOutputPath + incomingFolder + '/' + image;
  var outputPath = absOutputPath + '/' + size + '/' + image;

  console.log('in', inputPath);
  console.log(' => out', outputPath);
  singleItem.key = size;
  singleItem.path = publicOutputPath + '/' + size + '/' + image;

  fs.readFile(inputPath, function(err, buffer) {
    lwip.open(buffer, 'jpg', function(err, img){
      if(err) {
        throw err;
      }

      img.batch()
        .resize(x,y)
        .writeFile(outputPath, function(err){
           recordResizeCb(singleItem);
           resizeDoneCb();
           return;
        });
    });
  });

}

/**
 * Main function
 * @param  callback
 */
function go (cb) {

  var files = fs.readdirSync(absOutputPath + incomingFolder);
  var images = [];
  var timestamp;

  for (var i = 0; i < files.length; i++) {
    if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
        images.push(files[i]);
    }
  }
  if(!images.length) {
    cb();
    return;
  }

  /**
   * Callback for after we are done
   * with all images and all sizes
   */
  var resultImagesInfo = [];
  var done = function (err) {
    if(err) {
      throw err;
    }
    // delete originals
    async.each(images, function(image, itemcb) {
      fs.unlink(
        absOutputPath + incomingFolder + '/' + image,
        itemcb
      );
    }, function (err) {
      if(err) {
        throw err;
      }
      cb(resultImagesInfo);
      return;
    });
  };

  var resizedImageInfo = {};
  var recordResizeCb = function (item) {
    resizedImageInfo[item.key] = item.path;
  };

  async.each(images, function(image, imgCb) {
    timestamp = fs.statSync(absOutputPath + incomingFolder + '/' + image).mtime.getTime();

    async.each(config.pkg.resizeSizes, function(size, itemCb) {
        var x = size.x;
        var y = size.y;
        var sizeKey = size.key;
        resizeImage(image, sizeKey, x, y, recordResizeCb, itemCb);
      }, function (err) {
        // pack one image info into the array an reset
        resultImagesInfo.push({
          images : resizedImageInfo,
          timestamp : timestamp
        });
        resizedImageInfo = {};

        // we are done with this image
        imgCb();
      });

  }, done);

}

module.exports.go = go;







