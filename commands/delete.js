const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');
const achivment = require( '../achivment-schema.js');
const linkSchema = require( '../links-schema.js');
const { Emojis, Colors } = require('../statics.js');
const rainbowSchema = require('../rainbow-schema.js');

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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rainbow-role')
                .setDescription('Delete a rainbow role.')
                .addRoleOption(option => option.setName('role').setDescription('The role to delete from the rainbow roles.').setRequired(true))
        ),

    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return;
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(Emojis.error + ` You do not have permission to use this command. (Requires \`ADMINISTRATOR\`)`)
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'panel') {
            const panelName = interaction.options.getString('panel');
            const guild = interaction.guild.id;

            const panel = await selfroles.findOne({ guildID: guild});
            if (!panel) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` This guild does not have any panels configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                    .setDescription(Emojis.error + ` This panel does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                .setDescription(Emojis.success + ` Deleted the panel \`${panelName}\`.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === 'achievement') {
            const achivmentName = interaction.options.getString('achievement');
            const guild = interaction.guild.id;

            const achievement = await achivment.findOne({ guildID: guild });

            if (!achievement || !achievement.achievements.length > 0) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` This guild has no achievements configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                    .setDescription(Emojis.error + ` The achievement \`${achivmentName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                .setDescription(Emojis.success + ` The achievement \`${achivmentName}\` was deleted.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === "link") {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` You do not have permission to use this command. (Requires \`ADMINISTRATOR\`)`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            const linkName = interaction.options.getString('link');
            const guild = interaction.guild.id;
            const link = await linkSchema.findOne({ guildID: guild});

            if (!link) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` This guild has no link dispensers configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                    .setDescription(Emojis.error + ` The link dispenser \`${linkName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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
                .setDescription(Emojis.success + ` Deleted the \`${linkName}\` link dispenser.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === 'rainbow-role') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` You do not have permission to use this command. (Requires \`ADMINISTRATOR\`)`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const role = interaction.options.getRole('role');
            const rainbowRoles = await rainbowSchema.findOne({ guildID: interaction.guild.id });

            if (!rainbowRoles || !rainbowRoles.rainbowRoles.length > 0) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` This guild has no rainbow roles configured.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            
            let targetRole;

            for(let i = 0; i < rainbowRoles.rainbowRoles.length; i++) {
                if(rainbowRoles.rainbowRoles[i].roleID == role.id) {
                    targetRole = await rainbowRoles.rainbowRoles[i].roleID;
                    break;
                }
            }

            if(!targetRole) {
                const errorEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The role \`${role.name}\` is not a rainbow role.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            await rainbowSchema.updateOne({
                guildID: interaction.guild.id,
                'rainbowRoles.roleID': role.id
            }, {
                $pull: {
                    'rainbowRoles': {
                        roleID: role.id
                    }
                }
            })

            const successEmbed = new EmbedBuilder()
                .setDescription(Emojis.success + ` Deleted the \`${role.name}\` rainbow role.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        }
    }
}
