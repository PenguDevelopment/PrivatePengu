const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const Welcome = require('../modals/welcome-schema.js');
module.exports = {
    name: discord.Events.GuildMemberAdd,
    async execute(member) {
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        const welcome = await Welcome.findOne({ guildID: member.guild.id });
        if (!welcome) return;
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === welcome.welcomeChannel.slice(2, -1));
        if (!welcomeChannel) return console.log('welcome channel not found');
        let message = welcome.welcomeMessage.replace('{memberCount}', member.guild.memberCount);
        let title = welcome.welcomeTitle.replace('{memberCount}', member.guild.memberCount);

        if (message.includes("{user}")) {
            message = message.replace('{user}', member.user);
        }
        if (title.includes("{user}")) {
            title = title.replace('{user}', member.user.tag);
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(welcome.welcomeColor == 'random' ? randomColor : welcome.welcomeColor)
            .setTimestamp()
        if (welcome.outsideMention) {
            await welcomeChannel.send({ content: `${member.user}`});
            await welcomeChannel.send({ embeds: [embed] });
        } else {
            await welcomeChannel.send({ embeds: [embed] });
        }
    }
}
