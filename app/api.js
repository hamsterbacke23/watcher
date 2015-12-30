var express = require('express'),
     app = express(),
     model = require('./model');

app.get('/api/one/:timestamp/:range?', function (req, res) {
  if(req.params.timestamp === 'latest') {
    model.getLatestEntryPromise(req.params.timestamp)
      .then(function (data) {
        res.send(data);
      });
  } else {
    model.getSinglePromise(req.params.timestamp)
      .then(function (data) {
        res.send(data);
      });
  }
});

app.get('/api/:timestamp/:range?', function (req, res) {
  if(req.params.range) {
    model.getAllInRangePromise(req.params.timestamp, req.params.range)
      .then(function (data) {
        res.send(data);
      });
  } else {
    model.getSincePromise(req.params.timestamp)
      .then(function (data) {
        res.send(data);
      });
  }

});


app.use(express.static('htdocs'));

var server = app.listen(8081, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Weather app listening at http://%s:%s', host, port);
});
