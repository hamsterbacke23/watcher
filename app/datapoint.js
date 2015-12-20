var path  = require('path'),
  spawn = require('child_process').spawn,
  resize = require('./resizeImages'),
  config = require('./config'),
  model = require('./model'),
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
  var pyOptionsCustom = pyOptions;

  pyOptionsCustom.args = [config.pkg.sensorType, config.pkg.sensorGpio];
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
  .then(function(data) {
    var date = new Date().getTime();
    return model.getAllInRange(date, (config.pkg.timeRange / 2) * 1000)
      .then(function (result) {
        // only create entry if no result found
        if(result && result.length) {
          return 'No entry created';
        }
        return model.getCreatePromise(data[0]); //TODO: create for all data
      })
  })
  .then(function(data) {
    console.log('then', data);
  })
  .catch(function (err) {
    console.log(err);
  })
  .done(function () {
    console.log('ended');
    process.exit();
  });
