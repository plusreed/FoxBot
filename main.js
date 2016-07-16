var vorpal = require('vorpal')();
var Discord = require('discord.js');
var config = require('./config.json');
var fs = require('fs');
var colors = require('colors');

var PlaceHolderStrings = ["placeholder", "abc", "asdf"]; // unused atm, will be used later
var BotOnline = false; // UGLYYYYYYY
var fox = new Discord.Client();
/* Discord bot variables
var client_id = "",
    token = "",
    bot_id = "",
    default_game = "",
    EnableBotOnStart = false;
// End Discord bot variables */

// Various checks
if (config.EnableBotOnStart == false) {
  console.log("You have configured your bot to not start on execution of this script.");
  console.log("Start your bot by typing 'start' at the CLI.");
}
// useless check, legacy code
fs.stat('config.json', function(err, stat) {
  if(err == null) {
    // console.log("found config.json!");
  } else if(err.code == 'ENOENT') {
    // config.json doesn't exist, warn user
    console.log('WARNING!'.red);
    console.log('I am unable to find config.json...');
    console.log('Please check that config.json exists.');
  }
})
// CLI variables
var verString = "Fox CLI, version 0.1\nFox CLI is the command line interface for managing your Discord bot."; // If you would like to change the text that is said when you run "ver" in console, this is the place!
var delimiter = "discord#"; // Customize your CLI the way you want it!

// CLI commands (wip)
vorpal
  .command('start', 'Starts the Discord bot')
  .action(function(args, callback) {
    // Sanity checks
    if (config.token == "abc") { // TODO: Make this check PlaceHolderStrings to see if the string is a valid token
      this.log("There is a placeholder string in place of your token. Please correct this.".yellow);
      this.log("Can't continue, going back to CLI...");
      callback();
    } else if (BotOnline == true) {
      this.log("Your bot is already online, silly!");
      callback();
    } else {
      // this.log("working on this");
      this.log("Token check passed! Please wait...".green);
      // this.log("Currently at this time, you cannot shut off your bot after it is started. This functionality will be implemented later.".red);
      fox.loginWithToken(config.token);
      var BotOnline = true // EUGH
      callback();
    }
  });

vorpal
  .command('configlist', 'debug, lists config variables from config.json')
  .action(function(args, callback) {
    this.log("client_id: " + config.client_id);
    this.log("token: " + config.token);
    this.log("bot_id: " + config.bot_id);
    this.log("default_game: " + config.default_game);
    this.log("EnableBotOnStart: " + config.EnableBotOnStart);
    callback();
  });

vorpal
  .command('servers', 'List all the servers Fox is connected to')
  .action(function(args, callback) {
    this.log("This command is disabled.".red);
    // this.log(fox.servers);
    callback(); // Not using callback(); will result in the CLI hanging, NTS
  });

vorpal
  .command('stop', 'Stops the bot')
  .action(function(args, callback) {
    fox.logout(function (error) {
      this.log("There was a problem stopping the bot.".red);
    });
    var BotOnline = false; // Every time I write this line, I can't stop complaining about how ugly it is
    callback();
  });

vorpal
  .command('ver', 'Shows version of CLI')
  .action(function(args, callback) {
    this.log(verString);
    callback();
  });

// Set CLI delimiter and do .show();
vorpal
  .delimiter (delimiter)
  .show();

// Actual Discord bot commands

fox.on("message", function(message) {
  if (message.content == "ping") {
    fox.reply(message, "pong");
  }
});

fox.on("message", function(message) {
  if (message.content == "ownertest") {
    if (message.author.id == config.owner_id) {
      fox.reply(message, "You're an owner! (Your ID matches with the one in config.json)");
    } else {
      fox.reply(message, "I couldn't find you in config.json :(");
    }
  }
});

/*
TODO:
- Add a command to turn off the bot (maintenance maybe?) -- DONE
- Allow config of variables from the CLI (discord# set client_id <client id>)
*/
