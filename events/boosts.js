const { Events, EmbedBuilder } = require('discord.js');
const AchivmentModel = require('../achivment-schema.js');
const PersonalAchivmentModel = require('../personal-achivment-schema.js');
const alert = require('../alert-schema.js');

module.exports = {
    name: Events.GuildMemberBoost,
    async execute(member) {
        if (member.user.bot) return;
        if (member.guild.type === 'DM') return;
        const boostAlert = alert.findOne({ guildID: member.guild.id });
        if (!boostAlert) return;
        for (let i = 0; i < boostAlert.boost.length; i++) {
            let pingRole = boostAlert.boost[i].pingRole;
            let channelId = boostAlert.boost[i].channelId;
            let title = boostAlert.boost[i].title;
            let description = boostAlert.boost[i].description;
            let color = boostAlert.boost[i].color;
            let channel = member.guild.channels.cache.get(channelId);
            if (!channel) return;
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);
            function colorSorter(color) {
                // change color to hex
                switch (color) {
                    case 'random':
                        return randomColor;
                    case 'red':
                        return '#ff0000';
                    case 'green':
                        return '#00ff00';
                    case 'blue':
                        return '#0000ff';
                    case 'yellow':
                        return '#ffff00';
                    case 'purple':
                        return '#800080';
                    case 'pink':
                        return '#ffc0cb';
                    case 'orange':
                        return '#ffa500';
                    case 'black':
                        return '#000000';
                    case 'white':
                        return '#ffffff';
                    case 'grey':
                        return '#808080';
                    case 'cyan':
                        return '#00ffff';
                    case 'lime':
                        return '#00ff00';
                    case 'brown':
                        return '#a52a2a';
                    case 'teal':
                        return '#008080';
                    case 'silver':
                        return '#c0c0c0';
                    case 'gold':
                        return '#ffd700';
                    case 'magenta':
                        return '#ff00ff';
                    case 'maroon':
                        return '#800000';
                    case 'olive':
                        return '#808000';
                    case 'navy':
                        return '#000080';
                }
    
            }
            title = title.replace('{member}', member.user.tag);
            description = description.replace('{member}', member.user.tag);
            
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(colorSorter(color))
                .setTimestamp()
            if (pingRole !== 'none') {
                channel.send({ embeds: [embed], content: `<@&${pingRole}>` });
            } else {
                channel.send({ embeds: [embed] });
            }
        }
        
        const achievement = AchivmentModel.findOne({ guildID: member.guild.id });
        if (!achievement) return;

        let personalAchievement = await PersonalAchivmentModel.findOne({
            guildID: member.guild.id,
            userId: member.id
        });

        if (!personalAchievement) {
            let newPersonalAchievement = new PersonalAchivmentModel({
                guildID: member.guild.id,
                userId: member.id,
                achievements: [],
                stats: {
                    messages: 0,
                    reactions: 0,
                    voice: 0,
                    boosts: 0,
                    invites: 0,
                    roleNumber: 0,
                },
            });
            await newPersonalAchievement.save();
            personalAchievement = newPersonalAchievement;
        }
        // update stats with +1 boosts
        await PersonalAchivmentModel.findOneAndUpdate(
            {
                guildID: member.guild.id,
                userId: member.id,
            },
            {
                $inc: {
                    'stats.boosts': 1,
                },
            }
        );
    }
}