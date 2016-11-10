
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

var express = require('express');
var app = express();

var text="";

var findDocuments = function(db, callback) {
  text="";
  // Get the documents collection
  var collection = db.collection('inserts');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
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

app.get('/getdb', function(request, response) {

    // Connection URL
    var url = 'mongodb://heroku_9c85x4j1:v4fqtsggd87bq3ntfbjnnopp9a@ds145667.mlab.com:45667/heroku_9c85x4j1';
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

        findDocuments(db, function(docs) {
          db.close();
          response.send(docs);
      });
    });
    
});


app.get('/setdb', function(request, response) {
  questr = request.url.replace('/setdb?',"");
  questr=JSON.parse('{"' + decodeURI(questr).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
  co(function*() {
    // Connection URL
    var db = yield MongoClient.connect('mongodb://heroku_9c85x4j1:v4fqtsggd87bq3ntfbjnnopp9a@ds145667.mlab.com:45667/heroku_9c85x4j1');
    console.log("Connected correctly to server");
    // Insert a single document
    var json = {name:questr.name.replace(/[+]/g," ")||"",gender:questr.gender||"",avCode:questr.avCode||"",where:questr.where||""};
    console.log(json);
    var r = yield db.collection('inserts').insertOne(json);
    assert.equal(1, r.insertedCount);
    // Close connection
    db.close();
    response.send("<script>window.location='pair.html';</script>");
  }).catch(function(err) {
    console.log(err.stack);
  });

});

app.get('/cleardb', function(request, response) {
  // Connection URL
    var url = 'mongodb://heroku_9c85x4j1:v4fqtsggd87bq3ntfbjnnopp9a@ds145667.mlab.com:45667/heroku_9c85x4j1';
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      db.collection('inserts').remove(); 
      response.send("Clear Collection `inserts` Done");
    });


});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


