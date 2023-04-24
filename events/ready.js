const { Events } = require('discord.js');
const chalk = require("chalk");
const rainbowSchema = require('../rainbow-schema.js');

const rainbow = new Array(12);

for (var i = 0; i < 12; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

    rainbow[i] = '#' + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / 12 * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

async function changeColor(guild, result) {
	if (!result) {
		return;
	}

	for (let i = 0; i < result.rainbowRoles.length; i++) {
		const duration = result.rainbowRoles[i].delay * 1000;
		const role = await guild.roles.cache.get(result.rainbowRoles[i].roleID).catch(() => {});
		if (!role) {
			continue;
		}

		let currentColor = role.color;
		currentColor = "#" + currentColor.toString(16);

		const currentIndex = rainbow.indexOf(currentColor);

		if (currentIndex === -1) {
			await role.setColor(rainbow[0]).catch(() => {});
		}
		else {
			await role.setColor(rainbow[currentIndex + 1]).catch(() => {});
		}

		setTimeout(() => {
			changeColor(guild, result);
		}
		, duration);

		return;
	}
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`${chalk.green("Ready! ✔")} Logged in as ${client.user.tag}`);
		const guilds = client.guilds.cache;
		for (const guild of guilds.values()) {
			await guild.members.fetch();
			const result = await rainbowSchema.findOne({ guildID: guild.id });
			if (!result) {
				continue;
			}
			changeColor(guild, result);
		}
	},
};