var tesseract = require('node-tesseract');
var multer = require('multer');
var express = require('express');
var app = express();
//var rotate = require('rotate-image');
var Imagemin = require('imagemin');
var apikey = 'AIzaSyAl2_VXl-axjtU_zGj-s8h1ShY3H3Le_14';
var googleTranslate = require('google-translate')(apikey);

var server = app.listen(8080, function(){
    console.log('Server Started');
});

var io = require('socket.io').listen(server, function(){
    console.log('Socket io Started');
});


var storage = multer.diskStorage({
    
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
    
  filename: function (req, file, cb) {
    cb(null, 'latestfile.jpg');
    
    console.log('Image Uploaded...');
    io.emit('status', 'Image Uploaded...');
      
//    io.emit('status', 'Rotating Image...');
//    console.log('Rotating Image...');
      
    //rotateImage(__dirname + '/uploads/latestfile.jpg', 1);
    
    io.emit('status', 'Compressing Image...');
    console.log('Compressing Image...');
      
    new Imagemin()
        .src(__dirname + '/uploads/*.{gif,jpg,png,svg}')
        .dest(__dirname + '/uploads/')
        .use(Imagemin.jpegtran({progressive: true}))
        .run(function (err, files) {
        
            console.log('Compression done, starting OCR');
            io.emit('status', 'Compression done, starting OCR');
        
            tesseract.process(__dirname + '/uploads/latestfile.jpg', options, function(err, inputtext) {
                
                if(err) {
                    console.error(err);
                } else {
                    
                    console.log('File OCR Done... translating');
                    io.emit('status', 'File OCR Done... translating');
                    
                    // put together word list
//                    wordlist = '';
//                    inputtextArray = inputtext.split(' ');
//                    for(i=0;i<=inputtextArray.length;i++){
//                        googleTranslate.translate(inputtextArray[i], 'en', function(err, translation) {
//                            translatedword = translation.translatedText;
//                            var line = inputtextArray[i]+' : '+translatedword;
//                            wordlist += line;  
//                        });
//                    }  
//                    
//                    console.log(wordlist);
//                    io.emit('status', wordlist);
                    
                    io.emit('status', 'OCR Output: '+inputtext);
                    
                    googleTranslate.translate(inputtext, 'en', function(err, translation) {
                      console.log(translation.translatedText);
                      io.emit('status', 'Translated Output: '+translation.translatedText);
                    });
                    
                }
            });
        });
      
  }
});


var upload = multer({ storage: storage }).single('imageFile');

io.on('connection', function(socket){
  console.log('a user connected');
});


var options = {
    l: 'deu',
    psm: 6,
    binary: '/usr/local/bin/tesseract'
};


app.get('/', function(req, res){
    res.sendfile("index.html");
});


app.post('/upload', function (req, res, next) {
  io.emit('status', 'Image Uploading...');
console.log('Image Uploading...');
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return
    }
  });
});







