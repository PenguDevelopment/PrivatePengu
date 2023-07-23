const { EmbedBuilder, Events } = require('discord.js');
const AchivmentModel = require('../modals/achivment-schema.js');
const PersonalAchivmentModel = require('../modals/personal-achivment-schema.js');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;
    const achievements = await AchivmentModel.findOne({ guildID: message.guild.id });
    if (!achievements) return;

    let personalAchievement = await PersonalAchivmentModel.findOne({
        guildID: message.guild.id,
        userId: message.author.id
    });
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    if (!personalAchievement) {
        let newPersonalAchievement = new PersonalAchivmentModel({
            guildID: message.guild.id,
            userId: message.author.id,
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
    };
    // update stats with +1 messages
    await PersonalAchivmentModel.findOneAndUpdate(
        {
            guildID: message.guild.id,
            userId: message.author.id,
        },
        {
            $inc: {
                'stats.messages': 1,
            },
        }
    );

    for (let achievement of achievements.achievements) {
        let hasAchievement = false;
        for (let i = 0; i < personalAchievement.achievements.length; i++) {
            if (personalAchievement.achievements[i].name === achievement.name) {
                hasAchievement = true;
                break;
            }
        }
        if (!hasAchievement) {
            let requirementsMet = true;
            if (achievement.requirements.length === 0) continue;
            for (let i = 0; i < achievement.requirements.length; i++) {
                let requirement = achievement.requirements[i];
                if (requirement.type === 'messages') {
                    if (personalAchievement.stats.messages < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
                if (requirement.type === 'reactions') {
                    if (personalAchievement.stats.reactions < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
                if (requirement.type === 'voice') {
                    if (personalAchievement.stats.voice < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
                if (requirement.type === 'boosts') {
                    if (personalAchievement.stats.boosts < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
                if (requirement.type === 'invites') {
                    if (personalAchievement.stats.invites < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
                if (requirement.type === 'roleNumber') {
                    //check how many roles the user has
                    let roleNumber = 0;
                    for (let i = 0; i < message.member.roles.cache.size; i++) {
                        roleNumber++;
                    }
                    if (roleNumber < requirement.amount) {
                        requirementsMet = false;
                        break;
                    }
                }
            }
            if (requirementsMet) {
                await PersonalAchivmentModel.findOneAndUpdate(
                    {
                        guildID: message.guild.id,
                        userId: message.author.id,
                    },
                    {
                        $push: {
                            achievements: {
                                name: achievement.name,
                                description: achievement.description,
                                reward: achievement.reward,
                            },
                        },
                    }
                );
                const embed = new EmbedBuilder()
                    .setTitle(`New achievement!`)
                    .setDescription(`You have unlocked the achievement: **${achievement.name}**!`)
                    .setColor(randomColor)
                    .setTimestamp()
                await message.channel.send({ embeds: [embed] });
            }
        }
    }
  }
};

