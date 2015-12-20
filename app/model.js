var mongoose = require('mongoose'),
  dbConnection = require('./dbConnection'),
  Q = require('q');


dbConnection.connect();

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log('bla');
// });


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
  var DataPoint = mongoose.model('DataPoint', dataPointSchema);

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
