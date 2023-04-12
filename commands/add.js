const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const selfroles = require( '../selfroles-schema.js');
const { Emojis, Colors } = require('../statics.js');
const linksSchema = require('../links-schema.js');
const achivment = require('../achivment-schema.js');
const rainbowSchema = require('../rainbow-schema.js');

async function rainbowRole(role, delay) {
    const rainbow = new Array(12);

    for (var i = 0; i < 12; i++) {
        var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
        var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
        var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

        rainbow[i] = '#' + red + green + blue;
    }

    function sin_to_hex(i, phase) {
        var sin = Math.sin(Math.PI / 12 * 2 * i + phase);
        var int = Math.floor(sin * 127) + 128;
        var hex = int.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    }

    const duration = delay * 1000;

    let currentColor = role.color;
    currentColor = "#" + currentColor.toString(16);

    const currentIndex = rainbow.indexOf(currentColor);

    if (currentIndex === -1) {
        await role.setColor(rainbow[0]);
    }
    else {
        await role.setColor(rainbow[currentIndex + 1]);
    }

    setTimeout(() => {
        rainbowRole(role, delay);
    }
    , duration);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add something.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Add a role to a panel.')
                .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('The role to add to the panel.').setRequired(true))
                .addStringOption(option => option.setName('emoji').setDescription('The emoji to add to the panel.').setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('link')
                .setDescription('Add a link to a link dispenser.')
                .addStringOption(option => option.setName('link-name').setDescription('The name of the link dispenser.').setRequired(true))
                .addStringOption(option => option.setName('link').setDescription('The link to add to the link dispenser.').setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('requirement')
                .setDescription('Add a requirement to an achievement.')
                .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('fields')
                .setDescription('Add a field to a panel.')
                .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
                .addStringOption(option => option.setName('field-name').setDescription('The name of the field.').setRequired(true))
                .addStringOption(option => option.setName('field-value').setDescription('The value of the field.').setRequired(true))
                .addBooleanOption(option => option.setName('inline').setDescription('Whether the field is inline or not.').setRequired(true))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('rainbow-role')
                .setDescription('Add a role to the rainbow roles.')
                .addRoleOption(option => option.setName('role').setDescription('The role to add to the rainbow roles.').setRequired(true))
                .addIntegerOption(option => option.setName('delay').setDescription('The delay between each color change.').setRequired(true).addChoices(
                    { name: '12 hours', value: 43200 },
                    { name: '1 day', value: 86400 },
                ))
        ),
        async execute(interaction) {
            if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
                return;
            }
            if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
            
            const subcommand = interaction.options.getSubcommand();
            if (subcommand === 'role') {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ' You need the `Administrator` permission to use this command.')
                        .setColor(Colors.error);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                const panelName = interaction.options.getString('panel-name');
                const role = interaction.options.getRole('role');
                let emoji = interaction.options.getString('emoji');
                const guild = interaction.guild.id;

                const panel = await selfroles.findOne({ guildID: guild });
                if (!panel) {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ' There are no selfrole panels in this server.')
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
                
                if(emoji.startsWith(':') && emoji.endsWith(':')) {
                    const emojiFromCache = interaction.client.emojis.cache.find(emoji => emoji.name === emoji.slice(1, -1));
                    if (!emojiFromCache) {
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.error + ` The emoji \`${emoji}\` is invalid.`)
                            .setColor(Colors.error);
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                    emoji = emojiFromCache.toString();
                }
            
                for (const roler of targetPanel.roles) {
                    if (roler.roleID === role.id) {
                        const embed = new EmbedBuilder()
                            .setDescription(Emojis.error + ` The role \`${role.name}\` already exists in the \`${panelName}\` panel.`)
                            .setColor(Colors.error);
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                }
                // check if emoji is already in panel
                if (targetPanel.roles.find(r => r.emoji === emoji)) {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ` The emoji \`${emoji}\` already exists in the \`${panelName}\` panel.`)
                        .setColor(Colors.error);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                
                if (targetPanel.roles.length >= 20) {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ` The panel \`${panelName}\` already has 20 roles, and cannot add any more.`)
                        .setColor(Colors.error);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                await selfroles.updateOne({
                    guild,
                    'panels.panelName': panelName
                }, {
                    $push: {
                        'panels.$.roles': {
                            roleID: role.id,
                            emoji: emoji
                        }
                    }
                })
            const successEmbed = new EmbedBuilder()
                .setDescription(Emojis.error + ` Added the \`${role.name}\` role to the \`${panelName}\` panel.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
        } else if (subcommand === 'link') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You need the `Administrator` permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const linkName = interaction.options.getString('link-name');
            const link = interaction.options.getString('link');
            const guild = interaction.guild.id;

            const links = await linksSchema.findOne({ guildID: guild });
            if (!links) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' This server has no link dispensers.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            let targetLink;
            for(let i = 0; i< links.links.length; i++) {
                if(links.links[i].linkName === linkName) {
                    targetLink = links.links[i];
                    break;
                }
            }
            if(!targetLink) {
                const embed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The link dispenser \`${linkName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            for (const link of targetLink.links) {
                if (link.link === link) {
                    const embed = new EmbedBuilder()
                        .setDescription(Emojis.error + ` \`${link}\` already exists in \`${linkName}\` dispenser.`)
                        .setColor(Colors.error);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
            
            await linksSchema.updateOne({
                guild,
                'links.linkName': linkName
            }, {
                $push: {
                    'links.$.links': { 
                        link
                    }
                }
            })
            const successEmbed = new EmbedBuilder()
                .setDescription(`\`${link}\` was added to the link \`${linkName}\` dispenser.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } else if (subcommand === 'requirement') {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);

            const guild = interaction.guild.id;
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const noPermEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
            }

            const name = interaction.options.getString('name');
            const achievement = await achivment.findOne({
                guildID: guild,
                "achievements.name": name
              });
              if (!achievement) {
                const noAchievementEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The achievement \`${name}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [noAchievementEmbed], ephemeral: true });
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
            try {
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
                                .setDescription(Emojis.success + ' Cancelled the command.')
                                .setColor(Colors.success);
                            collector.stop();
                            messagesCollector.stop();
                            return await interaction.followUp({ embeds: [cancelEmbed] });
                        }
                        if (isNaN(amount)) {
                            const notNumberEmbed = new EmbedBuilder()
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
                            .setDescription(`Added the \`${type}\` requirement with an amount of \`${amount}\` to the \`${name}\` achievement.`)
                            .setColor(Colors.success);
                        await interaction.followUp({ embeds: [successEmbed] });
                        collector.stop();
                        voiceCollector.stop();
                    });
                } else if (c === 'reactions') {
                    collector.stop();
                    const reactionsRequirement = await achivment.findOne({
                        guildID: guild,
                        "achievements.name": name,
                        "achievements.requirements.type": 'reactions'
                    });
                    if (reactionsRequirement) {
                        const alreadyExistsEmbed = new EmbedBuilder()
                            .setDescription(Emojis.error + ' The reactions requirement already exists for this achievement.')
                            .setColor(Colors.error);
                        return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
                    }
                    type = 'reactions';
                    const reactionsEmbed = new EmbedBuilder()
                        .setDescription('**How many reactions does the user need?**\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`*.")
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [reactionsEmbed] });
                    const reactionsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    reactionsCollector.on('collect', async (m) => {
                        if (m.author.bot) return;
                        amount = m.content.toLowerCase();
                        if (amount == 'cancel') {
                            const cancelEmbed = new EmbedBuilder()
                                .setDescription(Emojis.success + ' Command cancelled.')
                                .setColor(Emojis.success);
                            await collector.stop();
                            await reactionsCollector.stop();
                            return await interaction.followUp({ embeds: [cancelEmbed] });
                        }
                        if (isNaN(amount)) {
                            const notNumberEmbed = new EmbedBuilder()
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
                            .setDescription(Emojis.error + ' The rolenumber requirement already exists for this achievement.')
                            .setColor(Colors.error);
                        return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
                    }
        
                    type = 'roleNumber';
                    const roleNumberEmbed = new EmbedBuilder()
                        .setDescription('**How many roles does the user need?**\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [roleNumberEmbed] });
                    const roleNumberCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    roleNumberCollector.on('collect', async (m) => {
                        if (m.author.bot) return;
                        amount = m.content.toLowerCase();
                        if (amount == 'cancel') {
                            const cancelEmbed = new EmbedBuilder()
                                .setDescription(Emojis.success + ' Cancelled the command.')
                                .setColor(Colors.success);
                            await collector.stop();
                            await roleNumberCollector.stop();
                            return await interaction.followUp({ embeds: [cancelEmbed] });
                        }
                        if (isNaN(amount)) {
                            const notNumberEmbed = new EmbedBuilder()
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
                        .setDescription('What role would you like to add?\n' + Emojis.message + " *Send a message containing your selection, or reply `cancel`.*")
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [roleEmbed] });
                    const roleCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    roleCollector.on('collect', async (m) => {
                        if (m.author.bot) return;
                        amount = m.content.toLowerCase();
                        if (amount == 'cancel') {
                            const cancelEmbed = new EmbedBuilder()
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
                            .setDescription(Emojis.error + ' The boosts requirement already exists for this achievement.')
                            .setColor(Colors.error);
                        return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
                    }
        
                    type = 'boosts';
                    const boostsEmbed = new EmbedBuilder()
                        .setDescription('How many boosts does the user need?\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                        .setColor(Colors.awaiting);
                    await interaction.followUp({ embeds: [boostsEmbed] });
                    const boostsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    boostsCollector.on('collect', async (m) => {
                        if (m.author.bot) return;
                        amount = m.content.toLowerCase();
                        if (amount == 'cancel') {
                            const cancelEmbed = new EmbedBuilder()
                                .setDescription(Emojis.success + ' Cancelled the command.')
                                .setColor(Colors.success);
                            await collector.stop();
                            await boostsCollector.stop();
                            return await interaction.followUp({ embeds: [cancelEmbed] });
                        }
                        if (isNaN(amount)) {
                            const notNumberEmbed = new EmbedBuilder()
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
                            .setDescription(Emojis.error + ' The invites requirement already exists for this achievement.')
                            .setColor(Colors.error);
                        return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
                    }
        
                    type = 'invites';
                    const invitesEmbed = new EmbedBuilder()
                        .setDescription('How many invites does the user need?\n' + Emojis.message + " *Send a message containing your selection, or type `cancel`.*")
                        .setColor(randomColor);
                    await interaction.followUp({ embeds: [invitesEmbed] });
                    const invitesCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                    invitesCollector.on('collect', async (m) => {
                        if (m.author.bot) return;
                        amount = m.content.toLowerCase();
                        if (amount == 'cancel') {
                            const cancelEmbed = new EmbedBuilder()
                                .setDescription(Emojis.success + ' Cancelled the command.')
                                .setColor(Colors.success);
                            await collector.stop();
                            await invitesCollector.stop();
                            return await interaction.followUp({ embeds: [cancelEmbed] });
                        }
                        if (isNaN(amount)) {
                            const notNumberEmbed = new EmbedBuilder()
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
                            .setDescription(Emojis.success + ` Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
                            .setColor(Colors.success);
                        await interaction.followUp({ embeds: [successEmbed] });
                        collector.stop();
                        invitesCollector.stop();
                    });
                } else if (c === 'cancel') {
                    const cancelEmbed = new EmbedBuilder()
                        .setDescription(Emojis.success + ' Cancelled the command.')
                        .setColor(Colors.success);
                    await collector.stop();
                    return await interaction.followUp({ embeds: [cancelEmbed] });
                }
            });
        } catch (e) {
            if (e.message === 'Missing Permissions') {
                const noPermissionsEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' Something went wrong. Please make sure I have permissions.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [noPermissionsEmbed] }).catch(() => {});
            }
        }
        } else if (subcommand === 'fields') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const noPermissionsEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [noPermissionsEmbed], ephemeral: true });
            }
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const panelName = interaction.options.getString('panel-name');
            const fieldName = interaction.options.getString('field-name');
            const fieldValue = interaction.options.getString('field-value');
            const inline = interaction.options.getBoolean('inline');
            const guild = interaction.guild.id;
            // find panel
            const panel = await selfroles.findOne({ guildID: guild });
            if (!panel) {
                const noPanelsEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' There are no panels in your guild.')
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [noPanelsEmbed], ephemeral: true });
            }
            let targetPanel;
            for(let i = 0; i< panel.panels.length; i++) {
                if(panel.panels[i].panelName === panelName) {
                    targetPanel = panel.panels[i];
                    break;
                }
            }
            if(!targetPanel) {
                const noPanelEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ` The panel \`${panelName}\` does not exist.`)
                    .setColor(Colors.error);
                return await interaction.followUp({ embeds: [noPanelEmbed], ephemeral: true });
            }
            // add field with update one
            await selfroles.updateOne({
                guild,
                'panels.panelName': panelName
            }, {
                $push: {
                    'panels.$.fields': {
                        fieldName,
                        fieldValue,
                        inline
                    }
                }
            });
            
            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ` Added the field \`${fieldName}\` to the panel \`${panelName}\`.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'rainbow-role') {
            let guild = interaction.guild.id;
            let role = interaction.options.getRole('role');
            let delay = interaction.options.getInteger('delay');

            if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' I do not have permission to manage roles.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
            }

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const noPermsEmbed = new EmbedBuilder()
                    .setDescription(Emojis.error + ' You do not have permission to use this command.')
                    .setColor(Colors.error);
                return await interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
            }

            let rainbowRoles = await rainbowSchema.findOne({ guildID: guild });

            if (!rainbowRoles) {
                rainbowRoles = new rainbowSchema({
                    guildID: guild,
                    rainbowRoles: []
                });
                await rainbowRoles.save();
            }

            for (let i = 0; i < rainbowRoles.rainbowRoles.length; i++) {
                if (rainbowRoles.rainbowRoles[i] === role.id) {
                    const alreadyExistsEmbed = new EmbedBuilder()
                        .setDescription(Emojis.error + ' This role is already a rainbow role.')
                        .setColor(Colors.error);
                    return await interaction.reply({ embeds: [alreadyExistsEmbed], ephemeral: true });
                }
            }

            await rainbowSchema.findOneAndUpdate(
                {
                    guildID: guild
                },
                {
                    $push: {
                        'rainbowRoles': {
                            roleID: role.id,
                            delay: delay
                        },
                    }
                }
            );

            const successEmbed = new EmbedBuilder()
                .setDescription(Emojis.success + ` Added the role \`${role.name}\` to the rainbow roles.`)
                .setColor(Colors.success);
            await interaction.reply({ embeds: [successEmbed] });
            rainbowRole(role, delay);
        }
    }
}

