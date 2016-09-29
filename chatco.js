var bot = require('./lib/bot.js');
var server = require('./lib/server.js');

server.app.post('/message', function(req, res) {
	var name = req.body.message;

	for(var x in _bots) {
		_bots[x].channel_api.api.channels.create({name:name}, function(err, res) {
    });
	}
});

bot.controller.configureSlackApp({
  port:3000,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['incoming-webhook','team:read','users:read','channels:write','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

// set up web endpoints for oauth, receiving webhooks, etc.
bot.controller.createOauthEndpoints(server.app, function(err,req, res) {
	res.redirect('/');
});

var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

bot.controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    if (teams[t].bot) {
     var bot_global = bot;
      bot.controller.spawn({
      	'token': teams[t].bot.token,
      	'retry': Infinity
      }).startRTM(function(err, bot) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
          //throw new Error('Could not connect to Slack');
        } else {
        	bot.channel_api = bot_global.controller.spawn({
        		'token': teams[t].incoming_webhook.token
        	});
          	trackBot(bot);
        }
      });
    }
  }
});

server.app.use(function(req, res, next){
  res.status(404);

  // // respond with html page
  // if (req.accepts('html')) {
  //   res.render('404', { url: req.url });
  //   return;
  // }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});




