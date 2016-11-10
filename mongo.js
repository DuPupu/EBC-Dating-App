
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://heroku_9c85x4j1:v4fqtsggd87bq3ntfbjnnopp9a@ds145667.mlab.com:45667/heroku_9c85x4j1');
  console.log("Connected correctly to server");

  // Insert a single document
  var json = {name:"DKSmith",gender:"m",avCode:"m001",where:"AC1"};
  var r = yield db.collection('inserts').insertOne(json);
  assert.equal(1, r.insertedCount);
  // Close connection
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});