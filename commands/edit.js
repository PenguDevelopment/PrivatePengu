const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const selfroles = require('../modals/selfroles-schema.js');
const { Emojis, Colors } = require('../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edit something.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('panel')
                .setDescription('Edit your panel.')
                .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
            return;
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'panel') {
            const panelName = interaction.options.getString('panel-name');
            const guild = interaction.guild.id;

            const panel = await selfroles.findOne({ guildID: guild });

            if (!panel) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The panel \`${panelName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const targetPanels = panel.panels.filter(p => p.panelName.toLowerCase() === panelName.toLowerCase());

            if (targetPanels.length === 0) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The panel \`${panelName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            
            const targetPanel = targetPanels[0];
            console.log(targetPanels);
            
            if(!targetPanel) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The panel \`${panelName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Editing panel \`${panelName}\``)
                .setDescription('What do you want to edit? \n\n' + Emojis.message + ' *Send a message containing your selection, or say `cancel`.*')
                .addFields(
                    { name: 'Name', value: 'Change the name of the panel.', inline: true },
                    { name: 'Description', value: 'Change the description of the panel.', inline: true },
                    { name: 'Color', value: 'Change the color of the panel.', inline: true },
                    { name: 'Field', value: 'Change a field in the panel.', inline: true },
                )
                .setColor(Colors.awaiting);
            await interaction.reply({ embeds: [embed] });

            const filter = m => m.author.id === interaction.user.id;
            const collector = await await interaction.channel.createMessageCollector({ filter, time: 60000 });
            try {
            collector.on('collect', async (m) => {
                if (m.content === 'cancel') {
                    await collector.stop();
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.success + ` Cancelled the command.`)
                        .setColor(Colors.success);
                    return await interaction.followUp({ embeds: [embed] });
                }
                if (m.content === 'name') {
                    // new collector
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.loading + ` What do you want to change the name to? (Send \`cancel\` to cancel.)`)
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                    await collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'cancel') {
                            await collector2.stop();
                            const embed = new EmbedBuilder()
                                .setDescription(Emojis.success + ` Cancelled the command.`)
                                .setColor(Colors.success);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // change name
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelName': m.content } });
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.success + ` Successfully changed the name to \`${m.content}\``)
                            .setColor(Colors.success);
                        await collector2.stop()
                        return await interaction.followUp({ embeds: [embed] });
                    });
                }
                if (m.content === 'description') {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.awaiting + ` What do you want to change the description to? (Send \`cancel\` to cancel.)`)
                        .setColor(Colors.success);
                    await interaction.followUp({ embeds: [embed] });

                    const collector2 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                    await collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'cancel') {
                            await collector2.stop();
                            const embed = new EmbedBuilder()
                                .setDescription(Emojis.success + ` Cancelled the command.`)
                                .setColor(Colors.success);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelDescription': m.content } });
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.success + ` Successfully changed the description to \`${m.content}\``)
                            .setColor(Colors.success);
                            await collector2.stop();
                        return await interaction.followUp({ embeds: [embed] });
                    });
                }
                if (m.content === 'color') {
                    // new collector
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.awaiting + ` What do you want to change the color to? (Send \`cancel\` to cancel.)`)
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                    await collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'stop') {
                            await collector2.stop();
                            const embed = new EmbedBuilder()
                                .setDescription(Emojis.success + ` Cancelled the command.`)
                                .setColor(Colors.success);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // change color
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelColor': m.content } });
                        await collector2.stop()
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.success + ` Successfully changed the color to \`${m.content}\``)
                            .setColor(Colors.success);
                        return await interaction.followUp({ embeds: [embed] });
                    });
                }
                if (m.content === 'field') {
                    // we need the id
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.awaiting + ` What field do you want to edit? (Send \`cancel\` to cancel.)`)
                        .setColor(Colors.awaiting);
                    // there is no field.id so your going to have to loop over from 0 plus fields.length is not defined
                    for (let i = 0; i < targetPanel.fields.length; i++) {
                        const field = targetPanel.fields[i];
                        embed.addFields(
                            { name: `Field`, value: `\`${i}\``},
                            { name: `Name`, value: `\`${field.fieldName}\``},
                            { name: `Description`, value: `\`${field.fieldValue}\``},
                            { name: `Inline`, value: `\`${field.inline}\``},
                            );
                    }
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                    await collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'cancel') {
                            await collector2.stop();
                            const embed = new EmbedBuilder()
                                .setDescription(Emojis.success + ` Cancelled the command.`)
                                .setColor(Colors.success);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // check if its a number
                        if (isNaN(m.content)) {
                            return;
                        }
                        // check if its a valid number
                        if (m.content > targetPanel.fields.length) {
                            return;
                        }

                        const id = m.content;
                        // new collector
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.awaiting + ` What do you want to change the field to? (Send \`cancel\` to cancel.)`)
                            .setColor(Colors.awaiting);
                        await interaction.followUp({ embeds: [embed] });
                        // collector
                        const collector3 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                        await collector2.stop();
                        collector3.on('collect', async (m) => {
                            // stop
                            if (m.content === 'cancel') {
                                await collector3.stop();
                                const embed = new EmbedBuilder()
                                    .setDescription(Emojis.success + ` Cancelled the command.`)
                                    .setColor(Colors.success);
                                return await interaction.followUp({ embeds: [embed] });
                            }
                            // name
                            if (m.content === 'name') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setDescription(Emojis.awaiting + ` What do you want to change the name to? (Send \`cancel\` to cancel.)`)
                                    .setColor(Colors.awaiting);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                                await collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'cancel') {
                                        await collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setDescription(Emojis.success + ` Cancelled the command.`)
                                            .setColor(Colors.success);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.fieldName`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setDescription(Emojis.success + ` Successfully changed the name to \`${m.content}\``)
                                        .setColor(Colors.success);
                                    await collector4.stop()
                                    return await interaction.followUp({ embeds: [embed] });
                                });
                            }
                            // description
                            if (m.content === 'description') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setDescription(Emojis.awaiting + ` What do you want to change the description to? (Send \`cancel\` to cancel.)`)
                                    .setColor(Colors.awaiting);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                                await collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'cancel') {
                                        await collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setDescription(Emojis.success + ` Cancelled the command.`)
                                            .setColor(Colors.success);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    // change description
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.fieldValue`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setDescription(Emojis.success + ` Successfully changed the description to \`${m.content}\``)
                                        .setColor(Colors.success);
                                    await collector4.stop()
                                    return await interaction.followUp({ embeds: [embed] });
                                });
                            }
                            if (m.content === 'inline') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setDescription(Emojis.awaiting + ` What do you want to change the inline to? (Send \`cancel\` to cancel.)`)
                                    .setColor(Colors.awaiting);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = await interaction.channel.createMessageCollector({ filter, time: 60000 });
                                await collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'cancel') {
                                        await collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setDescription(Emojis.success + ` Cancelled the command.`)
                                            .setColor(Colors.success);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    // check if its a boolean
                                    if (m.content !== 'true' && m.content !== 'false') {
                                        return;
                                    }
                                    // change inline
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.inline`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setDescription(Emojis.success + ` Successfully changed the inline to \`${m.content}\``)
                                        .setColor(Colors.success);
                                    await collector4.stop()
                                    return await interaction.followUp({ embeds: [embed] });
                                });
                            }
                            // stop
                            if (m.content === 'cancel') {
                                await collector3.stop();
                                const embed = new EmbedBuilder()
                                    .setDescription(Emojis.success + ` Cancelled the command.`)
                                    .setColor(Colors.success);
                                return await interaction.followUp({ embeds: [embed] });
                            }
                        });
                    });
                }
        });
    } catch (err) {
        const embed = new EmbedBuilder()
            .setDescription(Emojis.error + ` An error occurred while running the command: \`${err.message}\` \n Report this to pengudev server!`)
            .setColor(Colors.error);
        return await interaction.followUp({ embeds: [embed] }).catch(() => {});
        }
    }
    }
}