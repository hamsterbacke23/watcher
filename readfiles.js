var pjson = require('../package.json');
var fs = require('fs');
var path = require('path');
var async = require('async');


var removeImageTime =  60 * 60 * 1000 * 24 * 200;

// init others
var absOutputPath = __dirname + '/' + pjson.publicPath + '/' + pjson.imageoutPathrel + '/medium';


// function deleteImages(image) {
//   fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.small);
//   fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.medium);
//   fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.big);
// }

// function checkIsOld(image) {
//   var date = new Date();
//   var now = date.getTime();
//   return (now - image.time) > removeImageTime;
// }


// loop through images and get  iamge data together
function readImages() {
  var files = fs.readdirSync(absOutputPath);
  var images = [];

  for (var i = 0; i < files.length; i++) {
    if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
        images.push(files[i]);
    }
  };


  for (var i = 0; i < images.length; i++) {
    var curImg = images[i];
    var image = {};
    var sizeKey;
    var stat;
    var tmpData = {};

    // stupid mac creates fucking random images
    if(curImg.substring(0,2) === '._') {
      continue;
    }

    for (var i = 0; i < pjson.resizeSizes.length; i++) {
      sizeKey = pjson.resizeSizes[i].key;
      stat = fs.statSync(absOutputPath + '/' + sizeKey + '/' + curImg);
      if (stat.isFile) {
        tmpData.sizeKey = stat;
      };
    };

    if(tmpData) {
      image.push(tmpData);
    }

  };
}

readImages();

fs.writeFile(__dirname + '/' + pjson.publicPath + '/data.json', JSON.stringify(imagesData, null, 2) , 'utf-8');
