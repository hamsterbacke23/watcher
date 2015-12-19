var pjson = require('../package.json'),
  path = require('path');

var basePath = path.resolve(__dirname + '/../');
var scriptPath = path.resolve(basePath + '/app/scripts');
var publicPath = path.resolve(basePath + pjson.publicPath);
var imagesOutPublicPath = pjson.imageoutPathrel;
var imagesOutPath = path.resolve(basePath + pjson.publicPath + '/' + imagesOutPublicPath);

module.exports.paths = {
  basePath : basePath,
  scriptPath : scriptPath,
  imagesOutPath : imagesOutPath,
  imagesOutPublicPath : imagesOutPublicPath,
  publicPath : publicPath
};