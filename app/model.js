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
      small: String,
      medium: String,
      big: String
    ],
    temperature : Number,
    humidity: Number
});

var DataPoint = mongoose.model('DataPoint', dataPointSchema);

var dp = new DataPoint({timestamp: 12341234 });

console.log(dp.timestamp); // 'Silence'


function create (data) {
  var dp = new DataPoint(data);

  db.update(function (err, dp) {
    if (err) {
      throw err;
    }
    return true;
  });
}

function retrieve(data) {

  DataPoint.find(function (err, datapoints) {
    if (err) {
      throw err;
    }

    console.log(datapoints);
  })
}

module.exports.create = create;
module.exports.retrieve = retrieve;
module.exports.update = update;
module.exports.delete = delete;
