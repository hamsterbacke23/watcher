var mongoose = require('mongoose'),
  dbConnection = require('./dbConnection'),
  Q = require('q');

dbConnection.connect();

var dataPointSchema = mongoose.Schema({
    timestamp: Number,
    images : {},
    temperature : Number,
    humidity: Number
});

var DataPoint = mongoose.model('DataPoint', dataPointSchema);

/**
 * Save function
 */
function getCreatePromise (data) {
  var deferred = Q.defer();

  var dp = new DataPoint(data);
  dp.save(function(err, dp) {
    if(err) {
      deferred.reject(err);
    }
    deferred.resolve(data);
  });

  return deferred.promise;
}

function getQueryRangePromise(start, end) {
  var deferred = Q.defer();

  DataPoint.find({
      timestamp : {
        '$gte': start,
        '$lte': end
      }
    })
    .exec(function (err, data) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve(data);
    });

    return deferred.promise;
}


/**
 * Gets all entries within range time
 * @param  int time in microseconds
 * @param  int rangeTime in microseconds
 * @return {promise} promise
 */
function getAllInRangePromise(toTime, timeRange) {
  toTime = +toTime;
  timeRange = +timeRange;
  var startDate = toTime ? toTime : new Date().getTime();
  startDate = startDate - timeRange;

  var endDate = toTime ? toTime : new Date().getTime();

  return getQueryRangePromise(startDate, endDate);
}

function getLatestEntryPromise() {
  var deferred = Q.defer();

  DataPoint.find()
    .sort({_id: -1})
    .limit(1)
    .exec(function (err, data) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve(data);
    });

    return deferred.promise;
}

function getSinglePromise(timestamp) {
  var deferred = Q.defer();

  DataPoint.find({
      timestamp : timestamp
    })
    .exec(function (err, data) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve(data);
    });

    return deferred.promise;
}

function getMinMaxPromise(toTime, endTime) {
  var deferred = Q.defer();
  var maxTemp, minTemp, maxHumid, minHumid, endDate, startDate;

  startDate = toTime ? toTime : new Date().getTime();
  endDate = endTime ? endTime : new Date().getTime();

  DataPoint.findOne({
    timestamp : {
      '$gte': startDate,
      '$lte': endDate
    }
  })
  .where({'temperature' : { '$exists' : true }})
  .sort({'temperature' : -1})
  .exec()
    .then(function(doc) {
      maxTemp = doc;
    })
    .then(function () {
      return DataPoint.findOne({
        timestamp : {
          '$gte': startDate,
          '$lte': endDate
        }
      })
      .where({'temperature' : { '$exists' : true }})
      .sort({'temperature' : 1})
      .exec();
    })
    .then(function(doc) {
      minTemp = doc;
    })
    .then(function () {
      return DataPoint.findOne({
        timestamp : {
          '$gte': startDate,
          '$lte': endDate
        }
      })
      .where({'humidity' : { '$exists' : true }})
      .sort({'humidity' : 1})
      .exec();
    })
    .then(function(doc) {
      minHumid = doc;
    })
    .then(function () {
      return DataPoint.findOne({
        timestamp : {
          '$gte': startDate,
          '$lte': endDate
        }
      })
      .where({'humidity' : { '$exists' : true }})
      .sort({'humidity' : -1})
      .exec();
    })
    .then(function(doc) {
      maxHumid = doc;
    })
    .then(function() {
      deferred.resolve({
        maxTemp: maxTemp,
        minTemp: minTemp,
        minHumid: minHumid,
        maxHumid: maxHumid
      });
    });

  return deferred.promise;
}


function getSincePromise(sinceTimestamp) {
  var deferred = Q.defer();

  if(!sinceTimestamp) {
    sinceTimestamp = 0;
  }
  DataPoint.find({
    'timestamp' : { $gt : sinceTimestamp }
  })
    .exec(function (err, data) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve(data);
    });

  return deferred.promise;
}


module.exports.getMinMaxPromise = getMinMaxPromise;
module.exports.getCreatePromise = getCreatePromise;
module.exports.getAllInRangePromise = getAllInRangePromise;
module.exports.getSinglePromise = getSinglePromise;
module.exports.getLatestEntryPromise = getLatestEntryPromise;
module.exports.getSincePromise = getSincePromise;
