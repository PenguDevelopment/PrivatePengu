const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
		if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');

		const embed = new EmbedBuilder()
			.setTitle('🏓 Pong!')
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms.`)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};