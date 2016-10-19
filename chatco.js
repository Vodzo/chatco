var bot = require('./server/bot.js');
var server = require('./server/server.js');

server.app.post('/message', function(req, res) {
	var message = req.body.message;
  var userid = req.body.userid;
  var channel_name = 'chatco-' + userid;
	for(var x in _bots) {

    var message_channel = function(message, channel_id) {
      _bots[x].api.chat.postMessage({
          channel: channel_id,
          text: message
      });

      _bots[x].api.chat.postMessage({
          channel: _bots[x].default_channel_id,
          text: message,
          "attachments": [
              {
                  "text": "Choose action",
                  "fallback": "You are unable to choose action",
                  "callback_id": "handle_message",
                  "color": "#3AA3E3",
                  "attachment_type": "default",
                  "actions": [
                      {
                          "name": "ignore",
                          "text": "Ignore",
                          "type": "button",
                          "value": "ignore"
                      },
                      {
                          "name": "chat",
                          "text": "Chat",
                          "type": "button",
                          "value": "chat"
                      }
                  ]
              }
          ]
      });
    }

    _bots[x].channel_api.api.channels.list({}, function(err, res) {
      var channels = res.channels;
      var channel_exists = false;
      var channel_id = false;
      for(var y in channels) {
        if(channels[y].name == channel_name) {
          channel_exists = true;
          channel_id = channels[y].id;
          if(channels[y].is_archived) {
            _bots[x].channel_api.api.channels.unarchive({channel: channel_id});
          }
        }
      }

      if(!channel_exists) {
        _bots[x].channel_api.api.channels.create({name:channel_name}, function(err, res) {
          channel_id = res.channel.id;
          message_channel(message, channel_id);
        });    
      } else {
          message_channel(message, channel_id);
      }
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
          bot.default_channel_id = teams[t].incoming_webhook.channel_id
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




