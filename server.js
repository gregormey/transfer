var express = require('express')
, fs = require("fs")
, swig = require('swig')
, http = require('http')
, formidable = require('formidable')
, util = require('util')
, fs = require('fs')
, app = express();

 // assign the swig engine to .html files
app.engine('html', swig.renderFile);


// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/upload', function(req,res){
  res.render('upload');
});


app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    form.uploadDir = __dirname + '/uploads';

    form
      .on('field', function(field, value) {
        console.log(field, value);
        fields.push([field, value]);
      })
      .on('file', function(field, file) {
        console.log(field, file);
        files.push([field, file]);
        if(file.name!=""){
          fs.rename(file.path, form.uploadDir + "/" + file.name);
        }else
        {
           res.render('upload',{"error":true,"msg":"No file selected"});
        }
      })
      .on('error', function(err) {
        console.log('-> error while upload');
        console.log(util.inspect(err));
        res.render('upload',{"error":true,"msg":"Error while upload"});
      })
      .on('end', function() {
        console.log('-> upload done');
        res.render('upload',{"success":true,"msg":"Upload successful"});
      });
    form.parse(req);
});



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