const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const achivment = require('../achivment-schema.js');
const personalAchivment = require('../personal-achivment-schema.js');

module.exports = { 
    name : discord.Events.MessageCreate, 
    async execute(message) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    if (message.author.bot) return;
    if (!message.guild) return;
    const guild = message.guild;
    const achivments = await achivment.findOne({ guildID: guild.id });
    if (!achivments) return;
    const achivmentList = achivments.achievements;
    if (!achivmentList) return;
    for (const achivment of achivmentList) {
        if (achivment.type === 'message') {
            let personalAchivments = await personalAchivment.findOne({ guildID: guild.id, userId: message.author.id });
            if (personalAchivments == null) {
                // Create new personal achivment
                const newPersonalAchivment = new personalAchivment({
                    guildID: guild.id,
                    userId: message.author.id,
                    stats: {
                        messages: 1,
                        completed: []
                    },
                });
                await newPersonalAchivment.save();
                personalAchivments = await personalAchivment.findOne({ guildID: guild.id, userID: message.author.id });
                continue;
            };
            const stats = personalAchivments.stats;
            if (!stats) return;
            let messages = stats.map(stat => stat.messages);
            messages = messages[0];
            if (!messages) return;
            if (messages >= achivment.amount && !stats.map(stat => stat.completed).includes(achivment.name)) {
                const role = guild.roles.cache.find(role => role.id === achivment.reward);
                if (!role) return;
                const member = guild.members.cache.find(member => member.id === message.author.id);
                if (!member) return;
                await member.roles.add(role);
                const embed = new EmbedBuilder()
                    .setTitle('Achievement Completed!')
                    .setDescription(`Congratulations! You have completed the achievement: \`${achivment.name}\`!`)
                    .setColor(randomColor)
                    .addFields(
                        { name: 'Description', value: `\`${achivment.description}\``},
                        { name: 'Reward', value: `\`${role.name}\``}
                    )
                    .setTimestamp()
                await message.channel.send({ embeds: [embed] });
                // add achivment to completed
                await personalAchivment.findOneAndUpdate(
                    {
                        guildID: guild.id,
                        userId: message.author.id
                    },
                    {
                        guildID: guild.id,
                        userId: message.author.id,
                        stats: {
                            $push: { "completed": achivment.name },
                        }
                    },
                    {
                        upsert: true
                    }
                );
            } else {
                await personalAchivment.findOneAndUpdate(
                    {
                        guildID: guild.id,
                        userId: message.author.id
                    },
                    {
                        guildID: guild.id,
                        userID: message.author.id,
                        stats: {
                            messages: messages + 1
                        }
                    },
                    {
                        upsert: true
                    }
                );
            }
        }
    }
}
}