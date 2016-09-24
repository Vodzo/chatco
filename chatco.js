var bot = require('./lib/bot.js')
var server = require('./lib/server.js');

server.app.post('/message', function(req, res) {
  bot.bot.api.channels.create({name:"test"}, function(err, res) {
    console.log(res);
  });
});

