var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   console.log('bla');
// });


var dataPointSchema = mongoose.Schema({
    timestamp: Number,
    images : [
      {
        small: String
      },
      {
        medium: String
      },
      {
        big: String
      }
    ],
    temperature : Number,
    humidity: Number
});

var DataPoint = mongoose.model('DataPoint', dataPointSchema);

/**
 * Save function
 */
function create (data, cb) {
  var dp = new DataPoint(data);
  dp.save(cb);
}

function parseRangeFromTimestamp(timestamp) {
  var start = new Date(timestamp);
  start.setHours(0,0,0,0);
  var end = new Date(timestamp);
  end.setHours(23,59,59,999);

  return {
    start: start,
    end: end
  };
}

function queryRange(timestamp, cb) {
  var ranges = parseRangeFromTimestamp(timestamp);
  if (!ranges) {
    return false;
  }

  DataPoint.find({
      timestamp : {
        $gt: ranges.start,
        $lt: ranges.end
      }
    })
    .exec(cb);

  return true;
}

module.exports.create = create;
module.exports.queryRange = queryRange;
