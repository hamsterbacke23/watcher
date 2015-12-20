var express = require('express'),
     app = express(),
     model = require('./model');

app.get('/api/latest', function (req, res) {
  model.getLatestOnePromise()
    .then(function (data) {
      res.send(data);
    });
});

app.get('/api/all', function (req, res) {
  model.getAllPromise()
    .then(function (data) {
      res.send(data);
    });
});


app.use(express.static('htdocs'));

var server = app.listen(8081, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Weather app listening at http://%s:%s', host, port);
});
