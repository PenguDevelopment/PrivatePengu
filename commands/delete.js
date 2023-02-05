const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');
const achivment = require( '../achivment-schema.js');

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
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'panel') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const panelName = interaction.options.getString('panel');
            const guild = interaction.guild;
            // find panel and delete it
            const panel = await selfroles.findOne({ guild, 'panels.panelName': panelName });
            if (!panel) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error!')
                    .setDescription(`That panel does not exist.`)
                    .setColor(randomColor);
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
                    .setTitle('Error!')
                    .setDescription(`The panel \`${panelName}\` does not exist.`)
                    .setColor(randomColor);
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
                .setTitle('Success!')
                .setDescription(`Deleted the panel \`${panelName}\`.`)
                .setColor(randomColor);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === 'achievement') {
            const achivmentName = interaction.options.getString('achievement');
            const guild = interaction.guild;
            // find achivment and delete it
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const achievement = await achivment.findOne({ guild });
            if (!achievement) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error!')
                    .setDescription(`No achievements exist for this server.`)
                    .setColor(randomColor);
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
                    .setTitle('Error!')
                    .setDescription(`The achievement \`${achivmentName}\` does not exist.`)
                    .setColor(randomColor);
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
                .setTitle('Success!')
                .setDescription(`Deleted the achievement \`${achivmentName}\`.`)
                .setColor(randomColor);
            await interaction.reply({ embeds: [successEmbed] });
        }
    }
}
