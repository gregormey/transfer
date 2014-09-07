var express = require('express')
, fs = require("fs")
, swig = require('swig')
, http = require('http')
, formidable = require('formidable')
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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = __dirname + '/uploads/'+ file_name + '.' + file_ext;
 
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.render('upload',
                            { "error":true}
                        );
                    } else {
                        res.status(200);
                        res.render('upload',
                            { "success":true}
                        );
                    }
                });
            });
        });
    });
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