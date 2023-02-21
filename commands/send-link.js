const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const linkSchema = require( '../links-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-link')
        .setDescription('Send your finished link dispenser to a channel.')
        .addStringOption(option => option.setName('link-name').setDescription('The name of the link dispenser.').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the link dispenser to.').setRequired(true)),
    async execute(interaction) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        // check if have permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const linkName = interaction.options.getString('link-name');
        const channel = interaction.options.getChannel('channel');
        const guild = interaction.guild.id;
        // find link
        const link = await linkSchema.findOne({ guildID: guild });
        if (!link) {
            return await interaction.reply({ content: `You have no link dispensers in your server.`, ephemeral: true });
        }
        let targetlink;
        for(let i = 0; i< link.links.length; i++) {
            if(link.links[i].linkName === linkName) {
                targetlink = link.links[i];
                break;
            }
        }
        if(!targetlink) {
            return await interaction.reply({ content: `The link dispenser \`${linkName}\` does not exist.`, ephemeral: true });
        }
        // send link
        const linkEmbed = new EmbedBuilder()
            .setTitle(targetlink.linkName)
            .setDescription(targetlink.linkDescription)
            .setColor(randomColor);
        const linkRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Link get!')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`get-link-${linkName}`)
            );
        const message = await channel.send({ embeds: [linkEmbed], components: [linkRow] });

        const embed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`Sent the link dispenser \`${linkName}\` to ${channel}.`)
            .setColor(randomColor);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

