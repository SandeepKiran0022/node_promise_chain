const https = require('https');
const express = require('express');
const app = express();


app.get('/', function(req, res) {
	var id;
   var promise = new Promise(function(resolve, reject){
   https.get('https://public-api.wordpress.com/rest/v1.1/sites/discover.wordpress.com/posts/', (resp) => {
    var data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      posts= JSON.parse(data).posts;
      posts.sort(function(a,b){
        return a.date- b.date;
      });
      id= posts[parseInt(req.query.n)-1].author.id;

      res.status(200).send(posts[parseInt(req.query.n)-1].author);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
   return promise;
});

promise.then(function(resolve, reject){
    var max_tag;var id;
  https.get('https://public-api.wordpress.com/rest/v1.1/sites/discover.wordpress.com/posts/?author='+id, (resp) => {

    var data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      posts= JSON.parse(data).posts;
      posts.sort(function(a,b){
        return a- b;
      });
      data='';

      var big=-1;
      for(var i=0;i<posts.length;i++){
          data= data+ 'Post '+ i+ ' Tags:'+ '<br><br>';
          for(var key in posts[i].terms.post_tag){
              var count= posts[i].terms.post_tag[key].post_count;

              if(count>big){big=count; max_tag=key;}
              data= data+ key+ ', post_count= '+ count + '<br>';
            }
          data+='<br>'
      }
      res.status(200).send(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});
 

promise.then(function(resolve, reject){
  https.get('https://public-api.wordpress.com/rest/v1.1/sites/discover.wordpress.com/posts/?tag='+max_tag, (resp) => {
    var data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {

      var posts= JSON.parse(data).posts;
      posts.sort(function(a,b){
            return a.date- b.date;
          });

      data = 'MAX OCCURENCE TAG: '+max_tag+ '<br><br><br>'

      if(parseInt(posts[0].author.ID)!= id) {data= data+ 'Latest Post '+ ':<br><br>'+ JSON.stringify(posts[0]) + '<br><br><br>';}

      res.status(200).send(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

	});
});


app.listen(3000);
console.log('Listening on 3000');
