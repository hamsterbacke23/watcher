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
function getAllInRange(time, rangeTime) {
  var start = time ? time : new Date().getTime();
  start = start - rangeTime;
  var end = time ? time : new Date().getTime();
  end = end + rangeTime;

  return getQueryRangePromise(start, end);
}

function getLatestOnePromise() {
  var deferred = Q.defer();

  DataPoint.find()
    .limit(1)
    .sort({_id: -1})
    .exec(function (err, data) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve(data);
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

/**
 * @param  {int}
 * @return {promise}
 */
function parseDayRangeFromTimestamp(timestamp) {

  var start = new Date(timestamp);
  start.setHours(0,0,0,0).getTime();
  var end = new Date(timestamp);
  end.setHours(23,59,59,999).getTime();

  return getQueryRangePromise(start, end);
}


module.exports.getCreatePromise = getCreatePromise;
module.exports.getAllInRange = getAllInRange;
module.exports.getLatestOnePromise = getLatestOnePromise;
module.exports.getSincePromise = getSincePromise;
