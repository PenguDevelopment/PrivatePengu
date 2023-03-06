const { Events, EmbedBuilder } = require('discord.js');
const alertSchema = require('../alert-schema.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.user.bot) return;
        if (oldMember.guild.type === 'DM') return;
        const roleAlerts = await alertSchema.findOne({ guildID: oldMember.guild.id });
        if (!roleAlerts.roles.length) return;
        for (let i = 0; i < roleAlerts.roles.length; i++) {
            const roleAlert = roleAlerts.roles[i];
            let pingRole = roleAlert.pingRole;
            let channelId = roleAlert.channelId;
            let title = roleAlert.title;
            let description = roleAlert.description;
            let color = roleAlert.color;
            let channel = newMember.guild.channels.cache.get(channelId);
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
                    default:
                        return '#ffffff';
                }
            }
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(colorSorter(color))
                .setTimestamp()
                .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL()})
                .setThumbnail(oldMember.user.displayAvatarURL())
                .setFooter({ text: `ID: ${oldMember.id}`});
            if (pingRole == 'none') {
                await channel.send({ embeds: [embed] });
            } else {
                await channel.send(`<@&${pingRole}>`, { embeds: [embed] });
            }
        }
}
}