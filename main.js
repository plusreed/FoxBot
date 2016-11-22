var vorpal = require('vorpal')();
var Discord = require('discord.js');
var config = require('./config.json');
var colors = require('colors');

var PlaceHolderStrings = ["placeholder", "abc", "asdf"]; // unused atm, will be used later
var BotOnline = config.EnableBotOnStart; // UGLYYYYYYY
var fox = new Discord.Client();

// Various checks
if (config.EnableBotOnStart === false) {
  console.log("You have configured your bot to not start on execution of this script.");
  console.log("Start your bot by typing 'start' at the CLI.");
}

function Log(logmsg) {
  vorpal.log(logmsg);
}

function attachToGui(foxGui) {
  // WIP
}

require('events').EventEmitter.defaultMaxListeners = Infinity


// CLI variables
var verString = "Fox CLI, version 0.1.1\nFox CLI is the command line interface for managing your Discord bot."; // If you would like to change the text that is said when you run "ver" in console, this is the place!
var delimiter = config.delimiter; // Customize your CLI the way you want it!

// CLI commands (wip)
vorpal
  .command('start', 'Starts the Discord bot')
  .action(function(args, callback) {
    // Sanity checks
    if (config.token == "abc") { // TODO: Make this check PlaceHolderStrings to see if the string is a valid token
      this.log("There is a placeholder string in place of your token. Please correct this.".yellow);
      this.log("Can't continue, going back to CLI...");
      callback();
    } else if (BotOnline == true) { // can this be replaced with a nicer solution?
      this.log("Your bot is already online, silly!");
      callback();
    } else {
      // this.log("working on this");
      this.log("Token check passed! Please wait...".green);
      fox.loginWithToken(config.token);
      var BotOnline = true // EUGH
      fox.on('ready', () => { fox.setPlayingGame(config.default_game); });
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
vorpal.find('exit').remove();
vorpal
  .command('exit', 'Exit CLI') // Replacement exit command.
  .action(function(args, callback) {
    this.log("Logging out of the bot...");
    fox.logout(function(error) {
      this.log("Couldn't log out.");
    });
    var BotOnline = false;
    this.log("Exiting CLI...");
    process.exit();
  });

vorpal
  .command('set', 'Set various variables of the bot')
  .option('-g, --game <string>', 'The game your bot will play')
  .option('-sg, --streamgame',  'The name of the stream your bot will stream')
  .types({
    string: ['g', 'game']
  })
  .action(function(args, callback) {
    if (args.options.game != null) {
      fox.setPlayingGame(args.options.game, function(error) {
        this.log("couldn't set game");
        callback();
      });
    } else if (args.options.streamgame != null) {
      fox.setStreaming(args.options.streamgame, config.streamurl, 1);
    }
    callback();
  });

vorpal
  .command('say', 'Say string in channel')
  .action(function(args, callback) {
    // wip
  })

// Set CLI delimiter and do .show();
vorpal
  .delimiter (delimiter)
  .show();

// Actual Discord bot commands

// Message polling (This'll be less ugly later)
fox.on("message", function(message) {
  if (config.PollForMessages == true) {
    Log(message.author.id + ": " + message.content);
  } else {
    Log("Message polling is disabled in config.json.");
    var MsgPollShown = true;
    return;
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "ping") {
    fox.reply(message, "pong");
    Log("^ping sent by uid " + message.author.id);
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "ownertest") {
    if (message.author.id == config.owner_id) {
      fox.reply(message, "You're an owner! (Your ID matches with the one currently set in config.json)");
      Log("^ownertest sent by uid " + message.author.id + ", found in config.json");
    } else {
      fox.reply(message, "I couldn't find you in config.json :(");
      Log("^ownertest sent by uid " + message.author.id + ", failed to find in config.json");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "info") {
    fox.reply(message, "Hi, I'm the new **Fox**. I'm a bot written in **Node.js** using **discord.js**.\nI'm currently **" + config.ver + "** and my prefix is **" + config.prefix + "**. Fox CLI is currently at v0.1.1.\nIf you need help with this bot, contact Reed#0681, the creator.");
    Log("^info sent by uid " + message.author.id);
    // fox.reply(message, "Hi, I'm the new Fox. **formatting asdf** _italics asdf_ \n newlines!");
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "git") {
    fox.reply(message, "You can see my (WIP) source code at https://github.com/plusreed/NodeBot");
    Log("^git sent by uid " + message.author.id);
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "die") {
    if (message.author.id != config.owner_id) {
      fox.reply(message, "I'm a robot! I'm immortal! You can't kill me!");
      Log("^die sent by uid " + message.author.id + ", failed as uid doesn't match owner_id in config.json");
    } else {
      // Apparently discord.js will log out before sending a reply. Sucks.
      // fox.reply(message, "Logging out of Discord (to start me again, please start me via the CLI)");
      fox.logout(function(error) {
        // Welp looks like I'm going to be disgraced by the worst message ever
        var BotOnline = true;
        fox.reply(message, "owo whats this"); // Please help me
      });
      var BotOnline = false; // since fox.logout() should not ever fail, this'll do
      Log("^die sent by uid " + message.author.id + ", Discord bot offline");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "set") {
    if (message.author.id == config.owner_id) {
      fox.reply(message, "You cannot change the config.json from Discord for safety reasons. Please use the CLI.");
      Log("^set sent by uid " + message.author.id);
    } else {
      fox.reply(message, "**You do not have permission to run this command.**");
      Log("^set sent by uid " + message.author.id + ", failed as uid doesn't match owner_id in config.json");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "blacklist") {
    if (config.blacklist == null) {
      fox.reply(message, "I couldn't find a `blacklist` entry in config.json. Please contact the bot owner to correct this.");
      Log("^blacklist sent by uid " + message.author.id + ", blacklist was not found in config.json");
    } else {
      fox.reply(message, "I found the blacklist! I'll be able to list who is in the blacklist soon:tm:");
      Log("^blacklist sent by uid " + message.author.id);
    }
  }
});

// !!! INCOMING !!! UGLY COMMAND
fox.on("message", function(message) {
  if (message.content == config.prefix + "echo") {
    fox.reply(message.content.substring(0,6));
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "goidle") {
    if (message.author.id == config.owner_id) {
      fox.setStatusIdle();
      vorpal.log("Fox's status is now Idle...".yellow);
    } else {
      fox.reply(message, "lol no");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "goonline") {
    if (message.author.id == config.owner_id) {
      fox.setStatusOnline();
      vorpal.log("Fox's status is now Online...".green);
    } else {
      fox.reply(message, "lol no");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "setgame") {
    if (message.author.id == config.owner_id) {
      fox.setPlayingGame(message.substring(0,8), function(error) {
        fox.reply(message, "I couldn't set the game due to an error :(");
      });
    } else {
      fox.reply(message, "lol no");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "stream") {
    if (message.author.id == config.owner_id) {
      fox.setStreaming(config.stream_name, config.streamurl, 1);
    } else {
      fox.reply(message, "owo whats this"); // help
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix +  "owo") {
    fox.reply(message, "Rawr x3 nuzzles how are you pounces on you you're so warm o3o notices you have a bulge o: someone's happy ;) nuzzles your necky wecky~ murr~ hehehe rubbies your bulgy wolgy you're so big :oooo rubbies more on your bulgy wolgy it doesn't stop growing ·///· kisses you and lickies your necky daddy likies (; nuzzles wuzzles I hope daddy really likes $: wiggles butt and squirms I want to see your big daddy meat~ wiggles butt I have a little itch o3o wags tail can you please get my itch~ puts paws on your chest nyea~ its a seven inch itch rubs your chest can you help me pwease squirms pwetty pwease sad face I need to be punished runs paws down your chest and bites lip like I need to be punished really good~ paws on your bulge as I lick my lips I'm getting thirsty. I can go for some milk unbuttons your pants as my eyes glow you smell so musky :v licks shaft mmmm~ so musky drools all over your cock your daddy meat I like fondles Mr. Fuzzy Balls hehe puts snout on balls and inhales deeply oh god im so hard~ licks balls punish me daddy~ nyea~ squirms more and wiggles butt I love your musky goodness bites lip please punish me licks lips nyea~ suckles on your tip so good licks pre of your cock salty goodness~ eyes role back and goes balls deep mmmm~ moans and suckles");
  }
});

fox.on("message", function(message) {
  if(message.content == config.prefix + "hi") {
    fox.reply(message, "Hi there! I'm **Fox**. I'm currently version **0.2**, and my prefix is " + config.prefix + ".");
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "serverconf") {
    if (message.author == message.server.owner) {
      fox.reply(message, "It seems you are the owner of this server. This command is a WIP and will take options soon.");
    } else if (message.server.owner == null) {
      // if message.server.owner returns null, it's being run inside of a PMChannel
      fox.reply(message, "You cannot run this inside of a PM channel.");
    } else {
      fox.reply("You aren't the owner of the server! Send this command from within your own server or get the server owner to run this command.");
    }
  }
});
/*
fox.on("message", function(message) {
  if (message.content == config.prefix + "queue") {
    // wip, need node-opus
    // Iterate over all channels
    for (var channel of message.channel.server.channels) {
      // If the channel is a voice channel, ...
        if (channel instanceof Discord.VoiceChannel) {
            // ... reply with the channel name and the ID ...
            fox.reply(message, channel.name + " - " + channel.id);
            // ... and join the channel
            fox.joinVoiceChannel(channel);
            // Afterwards, break the loop so the bot doesn't join any other voice
            // channels
            break;
        }
      }
    }
  });
*/
fox.on("message", function(message) {
  if (message.content == config.prefix + "joinchan") {
    var vc = message.author.voiceChannel;
    // preliminary checks
    if (vc == null) {
      fox.reply(message, "you aren't in a voice channel!");
    } else {
      fox.joinVoiceChannel(vc);
      fox.reply(message, "I joined " + vc.name + " (" + vc.id + ") successfully! Hello " + vc.name + "!");
    }
  }
});

fox.on("message", function(message) {
  if (message.content == config.prefix + "leavechan") {
    var vcInfo = message.author.voiceChannel;
    fox.leaveVoiceChannel(vcInfo);
    fox.reply(message, "Bye " + vcInfo.name + "! :wave:");
  }
});
