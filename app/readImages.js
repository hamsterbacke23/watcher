var pjson = require('../package.json');
var fs = require('fs');
var path = require('path');
var async = require('async');


var removeImageTime =  60 * 60 * 1000 * 24 * 200;

// init others
var absOutputPath = path.resolve(__dirname + '/../' + pjson.publicPath + '/' + pjson.imageoutPathrel);
var testPath =  absOutputPath + '/medium';


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
function readImages(dir) {
  var files = fs.readdirSync(dir);
  var images = [];

  for (var i = 0; i < files.length; i++) {
    if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
        images.push(files[i]);
    }
  };

  return images;
}

function getData(images) {
  var imagesData = [];

  for (var i = 0; i < images.length; i++) {
    var curImg = images[i];
    var image = {};
    var tmpData = {};
    var sizeKey;
    var stat;

    // stupid mac creates fucking random images
    if(curImg.substring(0,2) === '._') {
      continue;
    }

    for (var j = 0; j < pjson.resizeSizes.length; j++) {
      sizeKey = pjson.resizeSizes[j].key;
      try {
        tmpData[sizeKey] = {};
        tmpData[sizeKey]['time'] = fs.statSync(absOutputPath + '/' + sizeKey + '/' + curImg).mtime.getTime();
        tmpData[sizeKey]['uri'] =  pjson.publicPath + '/' + pjson.imageoutPathrel + '/' + sizeKey + '/' + curImg;

      } catch (e) {
        continue;
      };
    };

    if(tmpData) {
      tmpData.time = tmpData.medium.time;
      imagesData.push(tmpData);
    }
  };
  return imagesData;
}

var images = readImages(testPath);
var imagesData = getData(images);

fs.writeFile(__dirname + '/../' + pjson.publicPath + '/data.json', JSON.stringify(imagesData, null, 2) , 'utf-8');

