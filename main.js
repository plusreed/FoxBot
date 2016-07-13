var vorpal = require('vorpal')();
var Discord = require('discord.js');
var config = require('./config.json');
var fs = require('fs');
var colors = require('colors');

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
var delimiter = "discord#"; // Customize your CLI the way you want it!

// CLI commands (wip)
/* vorpal
  .command('start', 'Starts the Discord bot')
  .action(function(args, callback) {
    // Sanity checks
    if token == "" {
      this.log("There is no bot token set.");
      this.log("Can't continue, going back to CLI...");
      callback();
    } else {
      this.log("working on this");
      callback();
    }
  });
*/

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

// Set CLI delimiter and do .show();
vorpal
  .delimiter (delimiter)
  .show();

/*
TODO:
- Add a command to turn off the bot (maintenance maybe?)
- Allow config of variables from the CLI (discord# set client_id <client id>)
*/
