const { Events } = require('discord.js');
const chalk = require("chalk");
// import dotenv
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${chalk.green("Ready! ✔")} Logged in as ${client.user.tag}`);
	},
};