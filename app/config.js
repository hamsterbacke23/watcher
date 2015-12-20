var pkg = require('../package.json'),
  path = require('path');

var basePath = path.resolve(__dirname + '/../');
var scriptPath = path.resolve(basePath + '/app/scripts');
var publicPath = path.resolve(basePath + pkg.publicPath);
var imagesOutPublicPath = pkg.imageoutPathrel;
var imagesOutPath = path.resolve(basePath + pkg.publicPath + '/' + imagesOutPublicPath);

module.exports.paths = {
  basePath : basePath,
  scriptPath : scriptPath,
  imagesOutPath : imagesOutPath,
  imagesOutPublicPath : imagesOutPublicPath,
  publicPath : publicPath,
};

module.exports.pkg = pkg;
