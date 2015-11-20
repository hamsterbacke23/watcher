var pjson = require('./package.json');
var fs = require('fs');
var path = require('path');
var lwip = require('lwip');
var async = require('async');

var dir = __dirname + '/' + pjson.publicPath + '/' + pjson.imageoutPathrel + '/';
var files = fs.readdirSync(dir);
var prefixSmallImg = 'small/';

var images = [];
var imagesData = [];

for (var i = 0; i < files.length; i++) {
  if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
      images.push(files[i]);
  }
};

function resizeImages (imagesData) {
  async.eachSeries(imagesData, function(item, cb) {
    var outputPath = dir + prefixSmallImg + item.name + item.extension;
    var imgPath = __dirname + '/' + pjson.publicPath + '/' + item.big;

    fs.readFile(imgPath, function(err, buffer) {
      lwip.open(buffer, 'jpg', function(err, img){

        img.batch()
          .resize(1024,768)
          .writeFile(outputPath, function(err){
             cb();
          });
      });
    });
  });
}

for (var i = 0; i < images.length; i++) {
  var curImg = images[i];
  var extension = path.extname(curImg);
  var name = curImg.replace(extension, '');
  // stupid mac creates fucking random images
  if(curImg.substring(0,2) === '._') {
    continue;
  }
  imagesData.push({
    name : name,
    extension : extension,
    big : pjson.imageoutPathrel + '/' + curImg,
    small : pjson.imageoutPathrel + '/' + prefixSmallImg + name + extension,
    time : fs.statSync(dir + curImg).mtime.getTime()
  });

};

resizeImages(imagesData);

