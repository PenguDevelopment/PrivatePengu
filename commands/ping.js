const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('🏓 Pong!')
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms.`)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};