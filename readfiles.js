var pjson = require('./package.json');
var fs = require('fs');
var path = require('path');
var lwip = require('lwip');
var async = require('async');

// config
var resizeSmallX = 480;
var resizeSmallY = 320;
var prefixSmallImg = 'small/';

var resizeMediumX = 1024;
var resizeMediumY = 768;
var prefixMediumImg = 'medium/';

var removeImageTime =  60 * 60 * 1000 * 24 * 200;

// init others
var absOutputPath = __dirname + '/' + pjson.publicPath + '/' + pjson.imageoutPathrel + '/';
var files = fs.readdirSync(absOutputPath);
var images = [];
var imagesData = [];

for (var i = 0; i < files.length; i++) {
  if(path.extname(files[i]) === '.jpg' || path.extname(files[i]) === '.jpeg') {
      images.push(files[i]);
  }
};

// Resize function
function resizeImages (imagesData, size) {
  var prefix, resizeX, resizeY;

  switch (size) {
    case 'medium':
      prefix = prefixMediumImg
      resizeX = resizeMediumX;
      resizeY = resizeMediumY;
      break;
    default :
      prefix = prefixSmallImg;
      resizeX = resizeSmallX;
      resizeY = resizeSmallY;
      break;
  }
  async.eachSeries(imagesData, function(item, cb) {
    var outputPath = absOutputPath + prefix + item.name + item.extension;
    var imgPath = __dirname + '/' + pjson.publicPath + '/' + item.big;

    fs.readFile(imgPath, function(err, buffer) {
      lwip.open(buffer, 'jpg', function(err, img){
        if(err) {
          console.log(err);
          return;
        }

        img.batch()
          .resize(resizeX,resizeY)
          .writeFile(outputPath, function(err){
             cb();
          });
      });
    });
  });
}

function deleteImages(image) {
  fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.small);
  fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.medium);
  fs.unlink(__dirname + '/' + pjson.publicPath + '/' + image.big);
}

function checkIsBigOld(image) {
  var date = new Date();
  var now = date.getTime();
  return (now - image.time) > removeImageTime;
}


// loop through images and get  iamge data together
function readImages() {
  for (var i = 0; i < images.length; i++) {
    var curImg = images[i];
    var extension = path.extname(curImg);
    var name = curImg.replace(extension, '');
    var image = {};

    // stupid mac creates fucking random images
    if(curImg.substring(0,2) === '._') {
      continue;
    }

    image = {
      name : name,
      extension : extension,
      big : '/' + pjson.imageoutPathrel + '/' + curImg,
      medium : '/' + pjson.imageoutPathrel + '/' + prefixMediumImg + name + extension,
      small : '/' + pjson.imageoutPathrel + '/' + prefixSmallImg + name + extension,
      time : fs.statSync(absOutputPath + curImg).mtime.getTime()
    }

    if(checkIsBigOld(image)) {
      deleteImage(image);
    } else {
      imagesData.push(image);
    }


  };
}

readImages();
resizeImages(imagesData, 'medium');
resizeImages(imagesData, 'small');

fs.writeFile(__dirname + '/' + pjson.publicPath + '/data.json', JSON.stringify(imagesData, null, 2) , 'utf-8');

