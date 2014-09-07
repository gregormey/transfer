var express = require('express')
, fs = require("fs")
, app = express();

app.get('/:file', function(req, res){
  var file = __dirname + "/downloads/" + req.params.file;
  fs.exists(file, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }
    res.download(file); // Set disposition and send it.
  });
});

app.listen(8888);
console.log('File Server listening port 8888');