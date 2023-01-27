const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const selfroles = require('../selfroles-schema.js');
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
        // get panel name and subcommand
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'panel') {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            // get the panel name (how this is going to work is basicly the bot will send a message with all the fields and then you can edit them)
            const panelName = interaction.options.getString('panel-name');
            // find panel
            const guild = interaction.guild;
            const panel = await selfroles.findOne({ guild });
            if (!panel) {
                return await interaction.reply({ content: `No panels exist for this server.`, ephemeral: true });
            }
            let targetPanel;
            for(let i = 0; i< panel.panels.length; i++) {
                if(panel.panels[i].panelName === panelName) {
                    targetPanel = panel.panels[i];
                    break;
                }
            }
            if(!targetPanel) {
                return await interaction.reply({ content: `The panel \`${panelName}\` does not exist.`, ephemeral: true });
            }
            const embed = new EmbedBuilder()
                .setTitle(`Editing panel \`${panelName}\``)
                .setDescription(`What do you want to edit? (Send \`name\`, \`description\`, \`color\`, \`field\`, or \`stop\` to stop.)`)
                .setColor(randomColor);
            await interaction.reply({ embeds: [embed] });

            // basicly what I want is that the bot will wait for the user to send the id then edit the field with that id
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            collector.on('collect', async (m) => {
                if (m.content === 'stop') {
                    collector.stop();
                    const embed = new EmbedBuilder()
                        .setTitle(`STOP!!!!`)
                        .setDescription(`Stopped editing panel \`${panelName}\``)
                        .setColor(randomColor);
                    return await interaction.followUp({ embeds: [embed] });
                }
                if (m.content === 'name') {
                    // new collector
                    const embed = new EmbedBuilder()
                        .setTitle(`Editing panel \`${panelName}\``)
                        .setDescription(`What do you want to change the name to? (Send \`stop\` to stop.)`)
                        .setColor(randomColor);
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'stop') {
                            collector2.stop();
                            const embed = new EmbedBuilder()
                                .setTitle(`STOP!!!!`)
                                .setDescription(`Stopped editing panel \`${panelName}\``)
                                .setColor(randomColor);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // change name
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelName': m.content } });
                        const embed = new EmbedBuilder()
                            .setTitle(`Edited panel \`${panelName}\``)
                            .setDescription(`Changed the name to \`${m.content}\``)
                            .setColor(randomColor);
                        return await interaction.followUp({ embeds: [embed] }) && collector2.stop();
                    });
                }
                if (m.content === 'description') {
                    // new collector
                    const embed = new EmbedBuilder()
                        .setTitle(`Editing panel \`${panelName}\``)
                        .setDescription(`What do you want to change the description to? (Send \`stop\` to stop.)`)
                        .setColor(randomColor);
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'stop') {
                            collector2.stop();
                            const embed = new EmbedBuilder()
                                .setTitle(`STOP!!!!`)
                                .setDescription(`Stopped editing panel \`${panelName}\``)
                                .setColor(randomColor);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // change description
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelDescription': m.content } });
                        const embed = new EmbedBuilder()
                            .setTitle(`Edited panel \`${panelName}\``)
                            .setDescription(`Changed the description to \`${m.content}\``)
                            .setColor(randomColor);
                        return await interaction.followUp({ embeds: [embed] }) && collector2.stop();
                    });
                }
                if (m.content === 'color') {
                    // new collector
                    const embed = new EmbedBuilder()
                        .setTitle(`Editing panel \`${panelName}\``)
                        .setDescription(`What do you want to change the color to? (Send \`stop\` to stop.)`)
                        .setColor(randomColor);
                    await interaction.followUp({ embeds: [embed] });
                    // collector
                    const collector2 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    collector.stop();
                    collector2.on('collect', async (m) => {
                        if (m.content === 'stop') {
                            collector2.stop();
                            const embed = new EmbedBuilder()
                                .setTitle(`STOP!!!!`)
                                .setDescription(`Stopped editing panel \`${panelName}\``)
                                .setColor(randomColor);
                            return await interaction.followUp({ embeds: [embed] });
                        }
                        // change color
                        await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { 'panels.$.panelColor': m.content } });
                        const embed = new EmbedBuilder()
                            .setTitle(`Edited panel \`${panelName}\``)
                            .setDescription(`Changed the color to \`${m.content}\``)
                            .setColor(randomColor);
                        return await interaction.followUp({ embeds: [embed] }) && collector2.stop();
                    });
                }
                if (m.content === 'field') {
                    // we need the id
                    const embed = new EmbedBuilder()
                        .setTitle(`Editing panel \`${panelName}\``)
                        .setDescription(`What field do you want to edit? (Send id or \`stop\` to stop.)`)
                        .setColor(randomColor);
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
                    const collector2 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    collector.stop();
                    collector2.on('collect', async (m) => {
                        // stop
                        if (m.content === 'stop') {
                            collector2.stop();
                            const embed = new EmbedBuilder()
                                .setTitle(`STOP!!!!`)
                                .setDescription(`Stopped editing panel \`${panelName}\``)
                                .setColor(randomColor);
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
                        // get the field
                        const field = targetPanel.fields[m.content];
                        const id = m.content;
                        // new collector
                        const embed = new EmbedBuilder()
                            .setTitle(`Editing panel \`${panelName}\``)
                            .setDescription(`What do you want to change? (Send \`name\`, \`description\`, \`inline\` or \`stop\` to stop.)`)
                            .setColor(randomColor);
                        await interaction.followUp({ embeds: [embed] });
                        // collector
                        const collector3 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                        collector2.stop();
                        collector3.on('collect', async (m) => {
                            // stop
                            if (m.content === 'stop') {
                                collector3.stop();
                                const embed = new EmbedBuilder()
                                    .setTitle(`STOP!!!!`)
                                    .setDescription(`Stopped editing panel \`${panelName}\``)
                                    .setColor(randomColor);
                                return await interaction.followUp({ embeds: [embed] });
                            }
                            // name
                            if (m.content === 'name') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setTitle(`Editing panel \`${panelName}\``)
                                    .setDescription(`What do you want to change the name to? (Send \`stop\` to stop.)`)
                                    .setColor(randomColor);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'stop') {
                                        collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setTitle(`STOP!!!!`)
                                            .setDescription(`Stopped editing panel \`${panelName}\``)
                                            .setColor(randomColor);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.fieldName`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Edited panel \`${panelName}\``)
                                        .setDescription(`Changed the name to \`${m.content}\``)
                                        .setColor(randomColor);
                                    return await interaction.followUp({ embeds: [embed] }) && collector4.stop();
                                });
                            }
                            // description
                            if (m.content === 'description') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setTitle(`Editing panel \`${panelName}\``)
                                    .setDescription(`What do you want to change the description to? (Send \`stop\` to stop.)`)
                                    .setColor(randomColor);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'stop') {
                                        collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setTitle(`STOP!!!!`)
                                            .setDescription(`Stopped editing panel \`${panelName}\``)
                                            .setColor(randomColor);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    // change description
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.fieldValue`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Edited panel \`${panelName}\``)
                                        .setDescription(`Changed the description to \`${m.content}\``)
                                        .setColor(randomColor);
                                    return await interaction.followUp({ embeds: [embed] }) && collector4.stop();
                                });
                            }
                            if (m.content === 'inline') {
                                // new collector
                                const embed = new EmbedBuilder()
                                    .setTitle(`Editing panel \`${panelName}\``)
                                    .setDescription(`What do you want to change the inline to? (true/false, Send \`stop\` to stop.))`)
                                    .setColor(randomColor);
                                await interaction.followUp({ embeds: [embed] });
                                // collector
                                const collector4 = interaction.channel.createMessageCollector({ filter, time: 60000 });
                                collector3.stop();
                                collector4.on('collect', async (m) => {
                                    // stop
                                    if (m.content === 'stop') {
                                        collector4.stop();
                                        const embed = new EmbedBuilder()
                                            .setTitle(`STOP!!!!`)
                                            .setDescription(`Stopped editing panel \`${panelName}\``)
                                            .setColor(randomColor);
                                        return await interaction.followUp({ embeds: [embed] });
                                    }
                                    // check if its a boolean
                                    if (m.content !== 'true' && m.content !== 'false') {
                                        return;
                                    }
                                    // change inline
                                    await selfroles.updateOne({ guild, 'panels.panelName': panelName }, { $set: { [`panels.$.fields.${id}.inline`]: m.content } });
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Edited panel \`${panelName}\``)
                                        .setDescription(`Changed the inline to \`${m.content}\``)
                                        .setColor(randomColor);
                                    return await interaction.followUp({ embeds: [embed] }) && collector4.stop();
                                });
                            }
                            // stop
                            if (m.content === 'stop') {
                                collector3.stop();
                                const embed = new EmbedBuilder()
                                    .setTitle(`STOP!!!!`)
                                    .setDescription(`Stopped editing panel \`${panelName}\``)
                                    .setColor(randomColor);
                                return await interaction.followUp({ embeds: [embed] });
                            }
                        });
                    });
                }
        });
    }
    }
}