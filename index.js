// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { Collection } = require('discord.js')
const selfroles = require('./selfroles-schema.js');
const chalk = require("chalk");
const mongoose = require('mongoose');
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions
] });

client.commands = new Collection();

client.on('ready', async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		keepAlive: true,
	});
	console.log(`${chalk.green("Success! ✔")} We are connected to the ${chalk.yellow("database")}!`);
});
client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot) return;
	const guild = reaction.message.guild;
	// find panel
	let panelName = reaction.message.embeds[0].title;
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
	const guild = reaction.message.guild;
	if (user.bot) return;
	// find panel
	let panelName = reaction.message.embeds[0].title;
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
const Leave = require('./events/leave.js');
Leave.init(client);
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

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

// Log in to Discord with your client's token
client.login(token);