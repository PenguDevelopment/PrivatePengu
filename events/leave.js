const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const Leave = require('../leave-schema.js');
const selfroles = require('../selfroles-schema.js');

module.exports = {
    name: discord.Events.GuildMemberRemove,
    async execute(member) {
        const leave = await Leave.findOne({ guildID: member.guild.id });
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        if (!leave) return;
        const leaveChannel = member.guild.channels.cache.find(channel => channel.id === leave.leaveChannel.slice(2, -1));
        if (!leaveChannel) return console.log('leave channel not found');
        let message = leave.leaveMessage.replace('{memberCount}', member.guild.memberCount);
        let title = leave.leaveTitle.replace('{memberCount}', member.guild.memberCount);

        if (message.includes("{user}")) {
            message = message.replace('{user}', member.user);
        }
        if (title.includes("{user}")) {
            title = title.replace('{user}', member.user.tag);
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(message)
            .setColor(leave.leaveColor == 'random' ? randomColor : leave.leaveColor)
            .setTimestamp()
        await leaveChannel.send({ embeds: [embed] });
    },
    async init(client) {
        client.on('ready', async () => {
            const guilds = client.guilds.cache;
            for (const guild of guilds.values()) {
                await guild.members.fetch();
            }
            console.log("Fetched all members.")
        });
    }
}
