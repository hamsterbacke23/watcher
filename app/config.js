var pjson = require('../package.json'),
  path = require('path');

var basePath = path.resolve(__dirname + '/../');
var scriptPath = path.resolve(basePath + '/app/scripts');
var imagesOutPath = path.resolve(basePath + pjson.publicPath + '/' + pjson.imageoutPathrel);
var publicPath = path.resolve(basePath + pjson.publicPath);

module.exports.paths = {
  basePath : basePath,
  scriptPath : scriptPath,
  imagesOutPath : imagesOutPath,
  publicPath : publicPath
};
