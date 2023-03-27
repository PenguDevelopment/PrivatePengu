const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const achivment = require( '../achivment-schema.js');
const { Emojis, EmojiIds, Colors } = require("../statics.js")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-requirement')
    .setDescription('Add a requirement to an achievement.')
    .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true)),
    async execute(interaction) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    // check if have permission
    const guild = interaction.guild.id;
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const noPermEmbed = new EmbedBuilder()
            //.setTitle('Error!')
            .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
            .setColor(Colors.error);
        return await interaction.reply({ embeds: [noPermEmbed] });
    }
    const name = interaction.options.getString('name');
    const achievement = await achivment.findOne({
        guildID: guild,
        "achievements.name": name
      });
      if (!achievement) {
        const noAchievementEmbed = new EmbedBuilder()
            //.setTitle('Error!')
            .setDescription(Emojis.error + ` The achievement \`${name}\` does not exist.`)
            .setColor(Colors.error);
        return await interaction.reply({ embeds: [noAchievementEmbed] });
    }
    const startEmbed = new EmbedBuilder()
        .setTitle('Add Requirement')
        .setDescription('What type of requirement would you like to add? \n\n' + Emojis.message + ' *Send a message containing your selection, or say `cancel`.*')
        .addFields(
            { name: 'Messages', value: 'This adds a message requirement to the achievement. This requirement requires the user to have a specific number of messages sent in the server.' },
            { name: 'Voice', value: 'This adds a voice requirement to the achievement. This requirement requires the user to have a specific number of minutes spent in voice channels in the server.' },
            { name: 'Reactions', value: 'This adds a reaction requirement to the achievement. This requirement requires the user to have a specific number of reactions added to messages in the server.' },
            { name: 'Roles', value: 'This adds a role requirement to the achievement. This requirement requires the user to have a specific role in the server.' },
            { name: 'RoleNumber', value: 'This adds a role number requirement to the achievement. This requirement requires the user to have a specific number of roles in the server.' },
            { name: 'Boosts', value: 'This adds a boost requirement to the achievement. This requirement requires the user to have a specific number of boosts in the server.' },
            { name: 'Invites', value: 'This adds an invite requirement to the achievement. This requirement requires the user to have a specific number of invites in the server.' },
        )
        .setColor(Colors.awaiting);
    await interaction.reply({ embeds: [startEmbed] });
    let type;
    let amount;
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
    collector.on('collect', async (m) => {
        if (m.author.bot) return;
        let c = m.content.toLowerCase();
        
        if (c === 'messages') {
            collector.stop();
            // check if messages requirement already exists
            const messagesRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'messages'
            });

            if (messagesRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    // .setTitle('Error!')
                    .setDescription(Emojis.error + ' The messages requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }
            type = 'messages';
            const messagesEmbed = new EmbedBuilder()
                // .setTitle('Add Requirement')
                .setDescription(`How many messages does the user need to send?\n\n*${Emojis.message} Send a message containing your selection, or say \`cancel\`.*`)
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [messagesEmbed] });
            const messagesCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            messagesCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        // .setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Cancelled the command.')
                        .setColor(Colors.success);
                    collector.stop();
                    messagesCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        //.setTitle('Error!')
                        .setDescription(Emojis.error + ' Your reply must be a number.')
                        .setColor(Colors.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };

                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    //.setTitle('Success!')
                    .setDescription(Emojis.success + ` Added the \`${type}\` requirement with an amount of \`${amount}\` to the \`${name}\` achievement.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                messagesCollector.stop();
            });
        } else if (c === 'voice') {
            collector.stop();
            // check if voice requirment already exists
            const voiceRequirment = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'voice'
            });
            if (voiceRequirment) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    // .setTitle('Error!')
                    .setDescription(Emojis.error + ' The voice requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }
            type = 'voice';
            const voiceEmbed = new EmbedBuilder()
                // .setTitle('Add Requirement')
                .setDescription('**How many minutes does the user need to have to gain this achievement?**\n' + `${Emojis.message} *Please reply with your selection, or reply \`cancel\`.*`)
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [voiceEmbed] });
            const voiceCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            voiceCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        //.setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Command cancelled.')
                        .setColor(Colors.success);
                    await collector.stop();
                    await voiceCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        // .setTitle('Error!')
                        .setDescription(Emojis.error + ' Your selection must be a number.')
                        .setColor(Colors.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    // .setTitle('Success!')
                    .setDescription(`Added the \`${type}\` requirement with an amount of \`${amount}\` to the \`${name}\` achievement.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                voiceCollector.stop();
            });
        } else if (c === 'reactions') {
            collector.stop();
            // check if reactions requirement already exists
            const reactionsRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'reactions'
            });
            if (reactionsRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ' The reactions requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }
            type = 'reactions';
            const reactionsEmbed = new EmbedBuilder()
                //.setTitle('Add Requirement')
                .setDescription('**How many reactions does the user need?**\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`*.")
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [reactionsEmbed] });
            const reactionsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            reactionsCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        //.setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Command cancelled.')
                        .setColor(Emojis.success);
                    await collector.stop();
                    await reactionsCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        //.setTitle('Error!')
                        .setDescription(Emojis.error + ' Your selection must be a number.')
                        .setColor(Emojis.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    // .setTitle('Success!')
                    .setDescription(Emojis.success + ` Added a \`${type}\` requirement with an amount of \`${amount}\` to the \`${name}\` achievement.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                reactionsCollector.stop();
            });
        } else if (c === 'rolenumber') {
            collector.stop();

            const rolenumberRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'roleNumber'
            });
            if (rolenumberRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    // .setTitle('Error!')
                    .setDescription(Emojis.error + ' The rolenumber requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }

            type = 'roleNumber';
            const roleNumberEmbed = new EmbedBuilder()
                // .setTitle('Add Requirement')
                .setDescription('**How many roles does the user need?**\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [roleNumberEmbed] });
            const roleNumberCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            roleNumberCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        //.setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Cancelled the command.')
                        .setColor(Colors.success);
                    await collector.stop();
                    await roleNumberCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        //.setTitle('Error!')
                        .setDescription(Emojis.error + ' The amount must be a number.')
                        .setColor(Colors.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    //.setTitle('Success!')
                    .setDescription(Emojis.success + ` Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                roleNumberCollector.stop();
            });
        } else if (c === 'role') {
            collector.stop();

            const roleRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'role'
            });
            if (roleRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ' The role requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }

            type = 'role';
            const roleEmbed = new EmbedBuilder()
                //.setTitle('Add Requirement')
                .setDescription('What role would you like to add?\n' + Emojis.message + " *Send a message containing your selection, or reply `cancel`.*")
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [roleEmbed] });
            const roleCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            roleCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        // .setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Command cancelled.')
                        .setColor(Colors.success);
                    await collector.stop();
                    await roleCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    //.setTitle('Success!')
                    .setDescription(Emojis.success + ` Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
                    .setColor(Emojis.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                roleCollector.stop();
            });
        } else if (c === 'boosts') {
            collector.stop();

            const boostsRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'boosts'
            });
            if (boostsRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    //.setTitle('Error!')
                    .setDescription(Emojis.error + ' The boosts requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }

            type = 'boosts';
            const boostsEmbed = new EmbedBuilder()
                // .setTitle('Add Requirement')
                .setDescription('How many boosts does the user need?\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                .setColor(Colors.awaiting);
            await interaction.followUp({ embeds: [boostsEmbed] });
            const boostsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            boostsCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        // .setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Cancelled the command.')
                        .setColor(Colors.success);
                    await collector.stop();
                    await boostsCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        // .setTitle('Error!')  buh moment
                        .setDescription(Emojis.error + ' The amount must be a number.')
                        .setColor(Colors.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    // .setTitle('Success!')
                    .setDescription(Emojis.success + ` Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                boostsCollector.stop();
            });
        } else if (c === 'invites') {
            collector.stop();

            const invitesRequirement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name,
                "achievements.requirements.type": 'invites'
            });
            if (invitesRequirement) {
                const alreadyExistsEmbed = new EmbedBuilder()
                    // .setTitle('Error!')
                    .setDescription(Emojis.error + ' The invites requirement already exists for this achievement.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
            }

            type = 'invites';
            const invitesEmbed = new EmbedBuilder()
                // .setTitle('Add Requirement')
                .setDescription('How many invites does the user need?\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                .setColor(randomColor);
            await interaction.followUp({ embeds: [invitesEmbed] });
            const invitesCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            invitesCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                amount = m.content.toLowerCase();
                if (amount == 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        // .setTitle('Cancelled')
                        .setDescription(Emojis.success + ' Cancelled the command.')
                        .setColor(Colors.success);
                    await collector.stop();
                    await invitesCollector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
                if (isNaN(amount)) {
                    const notNumberEmbed = new EmbedBuilder()
                        // .setTitle('Error!')
                        .setDescription(Emojis.error + ' The amount must be a number.')
                        .setColor(Colors.error);
                    return await interaction.followUp({ embeds: [notNumberEmbed] });
                }

                const requirements = {
                    type: type,
                    amount: amount
                };
            
                await achivment.findOneAndUpdate(
                    {
                        guildID: guild,
                        "achievements.name": name
                    },
                    {
                        $push: {
                            "achievements.$.requirements": requirements
                        }
                    }
                );
                const successEmbed = new EmbedBuilder()
                    // .setTitle('Success!')
                    .setDescription(Emojis.success + ` Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
                    .setColor(Colors.success);
                await interaction.followUp({ embeds: [successEmbed] });
                collector.stop();
                invitesCollector.stop();
            });
        } else if (c === 'cancel') {
            const cancelEmbed = new EmbedBuilder()
                // .setTitle('Cancelled')
                .setDescription(Emojis.success + ' Cancelled the command.')
                .setColor(Colors.success);
            await collector.stop();
            return await interaction.followUp({ embeds: [cancelEmbed] });
        }
    });
 }
}