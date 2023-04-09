const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' I do not have permission to use this command. (Requires `ADMINISTRATOR`)')
				.setColor(Colors.error);
			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}
		const embed = new EmbedBuilder()
			.setTitle('🏓 Pong!')
			.setDescription(`Latency is ${Date.now() - interaction.createdTimestamp}ms.`)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};