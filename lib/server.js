var config = require('../config/server.json');
var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var ioServer = require('socket.io');
var bodyParser = require('body-parser');

var compress = require('compression');
app.use(compress()); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

if(config.ssl) {
    var privateKey  = fs.readFileSync(config.key, 'utf8');
    var certificate = fs.readFileSync(config.cert, 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var https = require('https').createServer(credentials, app);
}

if(config.ssl) {
    https.listen(config.https.port, function(){
      console.log('listening on *:' + config.https.port);
    });
}

http.listen(config.http.port, function() {
  console.log('listening on *:' + config.http.port);
});

/*
app.get('/', function(req, res){
 res.sendFile(__dirname + '/index.html');
});
*/

app.use(express.static(__dirname + '/../public'));

// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
// });

module.exports = {
  app: app
};

var io = new ioServer;
io.attach(http);
if(config.ssl) {
    io.attach(https);
}

io.on('connection', function(socket){
  socket.on('refresh', function(msg){
//console.log('refresh');
   socket.broadcast.emit('poll', true);
// io.emit('poll', 'poll');
//    io.emit('poll', msg);
  });
});
