var bot = require('./lib/bot.js')
var server = require('./lib/server.js');

server.app.post('/message', function(req, res) {
  bot.bot.api.channels.create({name:"test"}, function(err, res) {
    
  });
});

bot.controller.configureSlackApp({
  port:3000,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['incoming-webhook','team:read','users:read','channels:write','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// set up web endpoints for oauth, receiving webhooks, etc.
bot.controller.createOauthEndpoints(server.app);




