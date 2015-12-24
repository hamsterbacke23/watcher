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
  scriptPath: config.paths.scriptPath
};

function getMakePicturePromise(resolve, reject) {
  var deferred = Q.defer();

  pythonShell.run('makePicture.py', pyOptions, function (err, results) {
    if(err) {
      deferred.reject('Error: ', err);
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

function getClimatePromise(picData) {
  var deferred = Q.defer();
  var pyOptionsCustom = pyOptions;

  pyOptionsCustom.args = [config.pkg.sensorType, config.pkg.sensorGpio];
  pythonShell.run('getTemp.py', pyOptionsCustom, function (err, data) {
    if(err) {
      deferred.reject(err);
    }
    deferred.resolve(data);
  });

  return deferred.promise;
}

function attachClimateInfoToImage(climateInfo, picData) {
  // if no image then just create an array with data
  if(!picData || !picData.length) {
    return [{
      temperature : climateInfo[0].temperature,
      humidity : climateInfo[0].humidity
    }];
  }
  for (var i = 0; i < picData.length; i++) {
    picData[i].temperature = climateInfo[0].temperature;
    picData[i].humidity = climateInfo[0].humidity;
  }
  return picData;
}

getMakePicturePromise()
  .then(function (data) {
      console.log(data);
  })
  .then(function () {
    return getResizePicturePromise();
  })
  .then(function (picData) {
    return getClimatePromise()
      .then(function (result) {
        return attachClimateInfoToImage(result, picData);
      });
  })
  .then(function(data) {
    if(!data || !data.length) {
      return;
    }

    var startTime = new Date().getTime();
    return model.getAllInRange(startTime, config.pkg.dataPointTimeIntervall)
      .then(function (result) {
        // only create entry if no result found
        if(result && result.length) {
          return 'No entry created';
        }
        return model.getCreatePromise(data[0]); //TODO: create for all data
      });
  })
  .then(function(data) {
    if (data) {
      console.log('DB entry: ', data);
    }
  })
  .catch(function (err) {
    console.log('Error: ', err);
  })
  .done(function () {
    console.log('ended');
    process.exit();
  });
