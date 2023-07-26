const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const linkSchema = require( '../../modals/links-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send something.')
        .addSubcommand(subcommand => subcommand
            .setName('link')
            .setDescription('Send your finished link dispenser to a channel.')
            .addStringOption(option => option.setName('link-name').setDescription('The name of the link dispenser.').setRequired(true))
            .addChannelOption(option => option.setName('channel').setDescription('The channel to send the link dispenser to.').setRequired(true).addChannelTypes(ChannelType.GuildText))
        ).addSubcommand(subcommand => subcommand
            .setName('panel')
            .setDescription('Send your finished panel to a channel. (make sure you have already added your roles with /add-roles)')
            .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
            .addChannelOption(option => option.setName('channel').setDescription('The channel to send the panel to.').setRequired(true).addChannelTypes(ChannelType.GuildText))
        ),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply('I need the `Manage Messages` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.AddReactions)) return interaction.reply('I need the `Add Reactions` permission to run this command.');

        let subcommand = interaction.options.getSubcommand();

        if (subcommand === 'link') {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const linkName = interaction.options.getString('link-name');
            const channel = interaction.options.getChannel('channel');
            const guild = interaction.guild.id;
            // find link
            const link = await linkSchema.findOne({ guildID: guild });
            if (!link) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You have no link dispensers in your server.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            let targetlink;
            for(let i = 0; i< link.links.length; i++) {
                if(link.links[i].linkName === linkName) {
                    targetlink = link.links[i];
                    break;
                }
            }
            if(!targetlink) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The link dispenser \`${linkName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
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

            await channel.send({ embeds: [linkEmbed], components: [linkRow] }).catch(
                () => {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ` I do not have permission to send messages in ${channel}.`)
                        .setColor(Colors.error);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            ) ;

            const embed = new EmbedBuilder()
                .setTitle('Success!')
                .setDescription(`Sent the link dispenser \`${linkName}\` to ${channel}.`)
                .setColor(randomColor);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (subcommand === 'panel') {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            // check if have permission
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const panelName = interaction.options.getString('panel-name');
            const channel = interaction.options.getChannel('channel');
            const guild = interaction.guild.id;
            // find panel
            const panel = await selfroles.findOne({ guildID: guild });
            if (!panel) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You have no panels in your server.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            let targetPanel;
            for(let i = 0; i< panel.panels.length; i++) {
                if(panel.panels[i].panelName === panelName) {
                    targetPanel = panel.panels[i];
                    break;
                }
            }
            if(!targetPanel) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The panel \`${panelName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            // send panel
            const panelEmbed = new EmbedBuilder()
                .setTitle(targetPanel.panelName)
                .setDescription(targetPanel.panelDescription)
                .setColor(randomColor);
            for (const field of targetPanel.fields) {
                panelEmbed.addFields({ name: field.fieldName, value: field.fieldValue });
            }
            const message = await channel.send({ embeds: [panelEmbed] });
            for (const role of targetPanel.roles) {
                await message.react(role.emoji).catch(
                    () => {
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.error + ` I do not have permission to react in ${channel} or the emoji is invalid.`)
                            .setColor(Colors.error);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                );
            }
            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` Sent the panel \`${panelName}\` to ${channel}.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

