const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');
const achivment = require( '../achivment-schema.js');
const linkSchema = require( '../links-schema.js');
const { Emojis, Colors } = require('../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletes something you want')
        .addSubcommand(subcommand =>
            subcommand
                .setName('panel')
                .setDescription('Deletes a panel')
                .addStringOption(option =>
                    option.setName('panel')
                        .setDescription('The panel you want to delete')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('achievement')
                .setDescription('Deletes an achievement')
                .addStringOption(option =>
                    option.setName('achievement')
                        .setDescription('The achievement you want to delete')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('link')
                .setDescription('Deletes a link dispenser')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('The link dispenser you want to delete')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You do not have permission to use this command. (Requires `ADMINISTRATOR`)', ephemeral: true });
        }
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'panel') {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const panelName = interaction.options.getString('panel');
            const guild = interaction.guild.id;
            // find panel and delete it
            const panel = await selfroles.findOne({ guildID: guild});
            if (!panel) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` This guild does not have any panels configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }
            let targetPanel;
            for(let i = 0; i< panel.panels.length; i++) {
                if(panel.panels[i].panelName === panelName) {
                    targetPanel = panel.panels[i];
                    break;
                }
            }
            if(!targetPanel) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` This panel does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }
            await selfroles.updateOne({
                guild,
                'panels.panelName': panelName
            }, {
                $pull: {
                    'panels': {
                        panelName: panelName
                    }
                }
            })
            const successEmbed = new EmbedBuilder()
                //.setTitle('Success!')
                .setDescription(Emojis.success + ` Deleted the panel \`${panelName}\`.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === 'achievement') {
            const achivmentName = interaction.options.getString('achievement');
            const guild = interaction.guild.id;
            // find achivment and delete it
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const achievement = await achivment.findOne({ guild });
            if (!achievement) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` This guild has no achievements configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }
            let targetAchievement;
            for(let i = 0; i< achievement.achievements.length; i++) {
                if(achievement.achievements[i].name === achivmentName) {
                    targetAchievement = achievement.achievements[i];
                    break;
                }
            }
            if(!targetAchievement) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` The achievement \`${achivmentName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }

            await achivment.updateOne({
                guild,
                'achievements.name': achivmentName
            }, {
                $pull: {
                    'achievements': {
                        name: achivmentName
                    }
                }
            })

            const successEmbed = new EmbedBuilder()
                //.setTitle('Success!')
                .setDescription(Emojis.success + ` The achievement \`${achivmentName}\` was deleted.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === "link") {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'You do not have permission to use this command. (Requires `ADMINISTRATOR`)', ephemeral: true });
            }
            // var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const linkName = interaction.options.getString('link');
            const guild = interaction.guild.id;
            // find panel and delete it
            const link = await linkSchema.findOne({ guildID: guild});
            if (!link) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` This guild has no link dispensers configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }
            let targetLink;
            for(let i = 0; i < link.links.length; i++) {
                if(link.links[i].linkName === linkName) {
                    targetLink = link.links[i];
                    break;
                }
            }
            if(!targetLink) {
                const errorEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ` The link dispenser \`${linkName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed] });
            }
            await selfroles.updateOne({
                guild,
                'links.linkName': linkName
            }, {
                $pull: {
                    'links': {
                        linkName: linkName
                    }
                }
            })
            const successEmbed = new EmbedBuilder()
                //.setTitle('Success!')
                .setDescription(Emojis.success + ` Deleted the \`${linkName}\` link dispenser.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        }
    }
}
