var path  = require('path'),
  spawn = require('child_process').spawn,
  resize = require('./resizeImages'),
  config = require('./config'),
  // model = require('./model'),
  pjson = require('../package.json'),
  pythonShell = require('python-shell'),
  Q = require('q');

var pyOptions = {
  mode: 'json',
  pythonOptions: ['-u'],
  scriptPath: config.paths.scriptPath,
  args: ['-f']
};

function getMakePicturePromise(resolve, reject) {
  var deferred = Q.defer();

  pythonShell.run('makePicture.py', pyOptions, function (err, results) {
    if(err) {
      deferred.reject(err);
    }
    deferred.resolve(results);
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
  // var meta = spawn('python', ['-u', config.paths.scriptPath + '/getTemp.py', '2302', '4']);
  var pyOptionsCustom = pyOptions;
  pyOptionsCustom.args = ['2302', '4'];
  pythonShell.run('getTemp.py', pyOptionsCustom, function (err, data) {
    if(err) {
      deferred.reject(err);
    }

    for (var i = 0; i < picData.length; i++) {
      picData[i].temperature = data[0].temperature;
      picData[i].humidity = data[0].humidity;
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
    console.log(data);
    // model.create(data, function(err) {
    //   console.log(err);
    // });
    // return;
  })
  .then(function() {
    // model.queryRange(Date.now, function(data){
    //   console.log(data);
    // });

  })
  .catch(function (err) {
    console.log(err);
  })
  .done(function () {
    console.log('ended');
    return;
  });
