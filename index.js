// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const { Collection, ActivityType } = require('discord.js')
const selfroles = require('./modals/selfroles-schema.js');
const chalk = require("chalk");
const mongoose = require('mongoose');
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.DirectMessages
 ], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

client.commands = new Collection();
client.subCommands = new Collection();

client.on('ready', async () => {
	mongoose.connect(process.env.MONGO_URI, {
		keepAlive: true,
	});
	console.log(`${chalk.green("Success! ✔")} We are connected to the ${chalk.yellow("database")}!`);
	client.user.setActivity('your commands', { type: ActivityType.Listening });
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	if (user.bot) return;
	const guild = reaction.message.guild;
	// check if the message is a panel
	if (!reaction.message.embeds[0]) {
		return;
	}
	if (!reaction.message.embeds[0].title) {
		return;
	}
	
	let panelName = reaction.message.embeds[0].title || "";
	const panel = await selfroles.findOne({ guild }); 
	
	if (!panel) {
		return;
	}
	let targetPanel;
	for(let i = 0; i< panel.panels.length; i++) {
		if(panel.panels[i].panelName === panelName) {
			targetPanel = panel.panels[i];
			break;
		}
	}
	if(!targetPanel) {
		return;
	}
	for (const role of targetPanel.roles) {
		if (role.emoji === reaction.emoji.name) {
			const guildMember = await guild.members.fetch(user.id);
			await guildMember.roles.add(`${role.roleID}`);
		}
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	const guild = reaction.message.guild;
	if (user.bot) return;
	// find panel
	let panelName = reaction.message.embeds[0].title || "";
	const panel = await selfroles.findOne({
		guild,
	});
	if (!panel) {
		return;
	}
	let targetPanel;
	for(let i = 0; i< panel.panels.length; i++) {
		if(panel.panels[i].panelName === panelName) {
			targetPanel = panel.panels[i];
			break;
		}
	}
	if(!targetPanel) {
		return;
	}
	for (const role of targetPanel.roles) {
		if (role.emoji === reaction.emoji.name) {
			const guildMember = await guild.members.fetch(user.id);
			await guildMember.roles.remove(`${role.roleID}`);
		}
	}
})

async function loadCommandsFromFolder(folderName) {
	await client.commands.clear();
	await client.subCommands.clear();
	const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folderName))
	  .filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
	  const filePath = path.join(__dirname, 'commands', folderName, file);
	  const command = require(filePath);

	  if (command.subCommand) { 
		client.subCommands.set(command.subCommand, command)
	  } else {
		if ('data' in command && !command.subCommand || 'execute' in command && !command.subCommand) {
			client.commands.set(command.data.name, command);
		} else if (!command.subCommand) {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	  }
	}
}

loadCommandsFromFolder('economy');
loadCommandsFromFolder('moderation');
  
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with the client's token
client.login(token);