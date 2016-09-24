var config = require('../config/token.json');
var token = false;
if (process.env.token) {
    token = process.env.token;
} else if(typeof(config.token) != 'undefined') {
    token = config.token;
}
if(!token) {
    console.log('Error: Specify token in environment or in ./config/token.json');
    process.exit(1);
}

var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: token,
   retry: Infinity
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});


//controller.hears(["\?","^pattern$"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
controller.hears(["\\?"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	controller.storage.users.get(message.user, function(err,user) {
		var username;
		if(!user) {
			bot.api.users.info({user:message.user},function(err,response) {
				username = response.user.name;
				user = {
					id : message.user,
					name : username
				}
				controller.storage.users.save(user, function(err,id ) {});
				reply(bot,message, username);
		        });
		} else {
			username = user.name;
			reply(bot,message,username);
		}
	});


});

function reply(bot,message, username) {
	if(message.text.search("\\?") != -1) { // && username.search(/tamara/i) != -1 ) {
		bot.reply(message, "Meni je to OK");
	}
//console.log(message);
//	  bot.reply(message,'You used a keyword!' + username);
}

module.exports = {
  bot: bot
};

