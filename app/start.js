var path  = require('path'),
  spawn = require('child_process').spawn,
  resize = require('./resizeImages'),
  config = require('./config'),
  model = require('./model'),
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

function getResizePicturePromise() {
  var deferred = Q.defer();

  resize.go(function (troll) {
    deferred.resolve(troll);
  });

  return deferred.promise;
}

function getTemperaturePromise(picData) {
  var deferred = Q.defer();
  var meta = spawn('python', ['-u', config.paths.scriptPath + '/getTemp.py', '2302', '4']);

  meta.stdout.on('data', function(data, err) {

    if(err) {
      deferred.reject(err);
    }
    console.log(data);
    var info = JSON.parse(data);
    for (var i = 0; i < picData.length; i++) {
      picData[i].temperature = info.temperature;
      picData[i].humidity = info.humidity;
    }
    deferred.resolve(picData);
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
  .then(function (picData) {
    return getTemperaturePromise(picData);
  })
  .then(function (data) {
    model.create(data, function(err) {
      console.log(err);
    });
    return;
  })
  .then(function() {
    model.queryRange(Date.now / 1000, function(data){
      console.log(data);
    });

  })
  .catch(function (err) {
    console.log(err);
  })
  .done(function () {
    console.log('ended');
    return;
  });
