var mongoose   = require('mongoose');
var db_server  = process.env.DB_ENV || 'plumps';

mongoose.connection.on('connected', function(ref) {
  console.log('Connected to ' + db_server + ' DB!');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.error('Failed to connect to DB ' + db_server + ' on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});

var gracefulExit = function() {
  console.log('bla');
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

var connect = function () {
  return mongoose.connect('mongodb://localhost/' + db_server);
};


module.exports.connect = connect;
