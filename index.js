var express = require('express');
var app = express();

var text="";

var findDocuments = function(db, callback) {
  text="";
  // Get the documents collection
  var collection = db.collection('demo');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    text=String(docs);
    callback(docs);
  });
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/db', function(request, response) {
  var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://heroku_9c85x4j1:v4fqtsggd87bq3ntfbjnnopp9a@ds145667.mlab.com:45667/heroku_9c85x4j1';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    findDocuments(db, function() {
      db.close();
      response.send(text);

    });
  });
});
  

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


