var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient;
Server = require('mongodb').Server;

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {track: process.env.TWITTER_TRACK}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    var client = new MongoClient(new Server(process.env.MONGODB_SERVICE_SERVICE_HOST ,"27017", {
                                auto_reconnect: true
                            }, {
                                numberOfRetries: 10,
                                retryMilliseconds: 500
                            } ));
    client.open( function(err, client) {
       if (err){
          console.log(err);
       }
       else {
          var db = client.db("test");
          db.collection('records', function(err, collection) {
               collection.insert({'tweet': tweet.text}, {safe:true}, function(err, result) {
                  if (!err){
                     console.log(result);
                  }
                  else {
                     console.log(err);
 		  }
                });
             });
         }
       });
    });
  stream.on('error', function(error) {
    console.log("error getting tweets");
    console.log(error);
  });
});


