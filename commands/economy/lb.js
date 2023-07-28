const { EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

module.exports.execute = async function execute(interaction) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const type = interaction.options.getString('type');
    let sort = interaction.options.getString('sort');
    if (sort == 'Balance')
        sort = 'Networth';
    const embed = new EmbedBuilder()
        .setTitle(`${sort} Leaderboard`)
        .setColor(randomColor)
        .setTimestamp();
    sort = sort.toLowerCase();
    let top5;
    if (type === 'global') {
        if (sort === 'networth') {
            let networthArray = [];
            const top5 = await pengu.find().limit(5);
            top5.forEach((doc) => {
                networthArray.push(doc.balance + (doc.bank || 0));
            });
            networthArray.sort((a, b) => b - a);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${networthArray[i]}`,
                });
            }
        }
        else if (sort === 'members') {
            const top5 = await pengu
                .find()
                .sort({ [sort]: -1 })
                .limit(5);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${top5[i][sort]}`,
                });
            }
        }
        else if (sort === 'leafs') {
            const top5 = await pengu
                .find()
                .sort({ [sort]: -1 })
                .limit(5);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${top5[i][sort]}`,
                });
            }
        }
        else if (sort === 'meat') {
            const top5 = await pengu
                .find()
                .sort({ [sort]: -1 })
                .limit(5);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${top5[i][sort]}`,
                });
            }
        }
        else if (sort === 'fish') {
            const top5 = await pengu
                .find()
                .sort({ [sort]: -1 })
                .limit(5);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${top5[i][sort]}`,
                });
            }
        }
        else if (sort === 'insects') {
            const top5 = await pengu
                .find()
                .sort({ [sort]: -1 })
                .limit(5);
            for (let i = 0; i < top5.length; i++) {
                const user = await interaction.client.users.fetch(top5[i].id);
                embed.addFields({
                    name: `${user.tag}`,
                    value: `${top5[i][sort]}`,
                });
            }
        }
        else {
            embed.setDescription('Please choose a valid sort type.');
        }
    }
    else if (type === 'guild') {
        embed.setDescription('This feature is not yet available.');
    }
    else {
        embed.setDescription('Please choose a valid type.');
    }
    await interaction.reply({ embeds: [embed] });
}
module.exports.subCommand = "economy.lb";