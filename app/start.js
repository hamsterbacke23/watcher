var path  = require('path'),
  spawn = require('child_process').spawn,
  resize = require('./resizeImages'),
  config = require('./config'),
  pjson = require('../package.json'),
  Q = require('q');


function getMakePicturePromise(resolve, reject) {
  var deferred = Q.defer();
  var pic = spawn('python', ['-u', config.paths.scriptPath + '/makePicture.py', '-f']);
  pic.stdout.on('data', function(data, err) {
    if(err) {
      deferred.reject(err);
    }
    deferred.resolve(data.toString());
  });
  return deferred.promise;
}

function getResizePicturePromise(resolve, reject) {
  var deferred = Q.defer();

  resize.go(function (troll) {
    console.log(troll);
    deferred.resolve(troll);
  });

  return deferred.promise;
}

function getTemperaturePromise(resolve, reject) {
  var deferred = Q.defer();
  var meta = spawn('python', ['-u', config.paths.scriptPath + '/getTemp.py', '2302', '4']);

  meta.stdout.on('data', function(data, err) {
    console.log(data);

    if(err) {
      deferred.reject(err);
    }
    deferred.resolve(data.toString());
  });
  return deferred.promise;
}

getMakePicturePromise()
  .then(function (data) {
      console.log(data);
  })
  .then(function () {
    return getResizePicturePromise();
  })
  .then(function (pic) {
    // console.log('pic', pic);
  })
  .then(function () {
    return getTemperaturePromise();
  })
  .then(function (data) {
    var json = JSON.parse(data);
    console.log(json.temperature);
    console.log(json.humidity);
  })
  .catch(function (err) {
    console.log(err);
  })
  .done(function () {
    console.log('ended');
  });
