const { Events, EmbedBuilder } = require('discord.js');
const AchivmentModel = require('../modals/achivment-schema.js');
const PersonalAchivmentModel = require('../modals/personal-achivment-schema.js');

module.exports = {
    name: Events.GuildMemberBoost,
    async execute(member) {
        if (member.user.bot) return;
        if (member.guild.type === 'DM') return;
        
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