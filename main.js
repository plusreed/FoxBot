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

vorpal
  .command('prefix', 'Prints the prefix currently being used')
  .action(function(args, callback) {
    this.log("The current prefix is: " + config.prefix);
    callback();
  });

// Set CLI delimiter and do .show();
vorpal
  .delimiter (delimiter)
  .show();

// Actual Discord bot commands

fox.on("message", function(message) {
  if (message.content == config.prefix + "ping") {
    fox.reply(message, "pong");
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "ownertest") {
    if (message.author.id == config.owner_id) {
      fox.reply(message, "You're an owner! (Your ID matches with the one currently set in config.json)");
    } else {
      fox.reply(message, "I couldn't find you in config.json :(");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "info") {
    fox.reply(message, "Hi, I'm the new **Fox**. I'm a bot written in **Node.js** using **discord.js**.\nI'm currently **" + config.ver + "** and my prefix is **" + config.prefix + "**. Fox CLI is currently at v0.1.\nI'll put all the commands in a separate command later please don't kill me");
    // fox.reply(message, "Hi, I'm the new Fox. **formatting asdf** _italics asdf_ \n newlines!");
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "git") {
    fox.reply(message, "Thanks for your interest in my source code! Unfortunately, it's not public at the moment.\nDon't worry though! All changes to me are pushed to a private GitHub repo, which will be made public when this bot is in a more complete state.");
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "die") {
    if (message.author.id != config.owner_id) {
      fox.reply(message, "I'm a robot! I'm immortal! You can't kill me!");
    } else {
      // Apparently discord.js will log out before sending a reply. Sucks.
      // fox.reply(message, "Logging out of Discord (to start me again, please start me via the CLI)");
      fox.logout(function(error) {
        // Welp looks like I'm going to be disgraced by the worst message ever
        var BotOnline = true;
        fox.reply(message, "owo whats this"); // Please help me
      });
      var BotOnline = false; // since fox.logout() should not ever fail, this'll do
    }
  }
});

/*
TODO:
- Add a command to turn off the bot (maintenance maybe?) -- DONE
- Allow config of variables from the CLI (discord# set client_id <client id>)
- Configure prefix in config.json
*/
