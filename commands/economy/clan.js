const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');
let targetUser;
let member;
var page = 1;
let data = new SlashCommandBuilder()
    .setName('clan')
    .setDescription('Check your clan.')
    .addUserOption(option => option.setName('user').setDescription('The user\'s clan you want to see.'));
module.exports.data = data;
async function execute(interaction) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    targetUser = interaction.options.getUser('user');
    member = await interaction.guild.members.cache.get(targetUser ? targetUser.id : interaction.user.id);
    const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
    const embed = new EmbedBuilder()
        .setTitle(`${member.user.username}'s Clan`)
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addFields({ name: '**Clan Name**', value: `${user.clanname}`, inline: false }, { name: '**Members**', value: `${user.memberslist}`, inline: false }, { name: '**Total Number Of Members**', value: `${user.members}`, inline: false })
        .setColor(randomColor);
    const row = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
        .setCustomId('page-select')
        .setPlaceholder('Choose a page!')
        .addOptions([
        {
            label: 'Balance',
            description: 'Check your balance.',
            value: 'balance',
            emoji: '💳',
        },
        {
            label: 'Clan',
            description: 'Check your clan.',
            value: 'clan',
            emoji: '👥',
        },
        {
            label: 'Inventory',
            description: 'Check your inventory.',
            value: 'inventory',
            emoji: '🎒',
        },
    ]));
    interaction.reply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();
    const collector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60 * 1000 });
    async function update(selected, interaction) {
        if (selected == 'clan') {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            if (!user) {
                const userNotFound = new EmbedBuilder()
                    .setTitle('User Not Found')
                    .setDescription('This user does not have a profile yet.')
                    .setColor(randomColor);
                return await interaction.reply({ embeds: [userNotFound] });
            }
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Clan`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Clan Name**', value: `${user.clanname}`, inline: false }, { name: '**Members**', value: `${user.memberslist}`, inline: false }, { name: '**Total Number Of Members**', value: `${user.members}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('page-select')
                .setPlaceholder('Choose a page!')
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                },
                {
                    label: 'Clan',
                    description: 'Check your clan.',
                    value: 'clan',
                    emoji: '👥',
                },
                {
                    label: 'Inventory',
                    description: 'Check your inventory.',
                    value: 'inventory',
                    emoji: '🎒',
                },
            ]));
            interaction.update({ embeds: [embed], components: [row] });
        }
        else if (selected == 'inventory') {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Inventory`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Inventory**', value: `${user.inventory}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('page-select')
                .setPlaceholder('Choose a page!')
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                },
                {
                    label: 'Clan',
                    description: 'Check your clan.',
                    value: 'clan',
                    emoji: '👥',
                },
                {
                    label: 'Inventory',
                    description: 'Check your inventory.',
                    value: 'inventory',
                    emoji: '🎒',
                },
            ]));
            interaction.update({ embeds: [embed], components: [row] });
        }
        else if (selected == 'balance') {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Balance`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Balance**', value: `<a:ice:999097979757678682> ${user.balance}`, inline: false }, { name: '**Bank**', value: `${user.bank} 💳`, inline: false }, { name: '**Meat**', value: `${user.meat} 🥩`, inline: false }, { name: '**Fish**', value: `${user.fish} 🐟`, inline: false }, { name: '**Insects**', value: `${user.insects} 🐛`, inline: false }, { name: '**Plants**', value: `${user.leafs} 🍃`, inline: false }, { name: '**Net Worth**', value: `<a:ice:999097979757678682> ${user.bank + user.balance}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('page-select')
                .setPlaceholder('Choose a page!')
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                },
                {
                    label: 'Clan',
                    description: 'Check your clan.',
                    value: 'clan',
                    emoji: '👥',
                },
                {
                    label: 'Inventory',
                    description: 'Check your inventory.',
                    value: 'inventory',
                    emoji: '🎒',
                },
            ]));
            interaction.update({ embeds: [embed], components: [row] });
        }
    }
    collector.on('collect', async (i) => {
        if (i.user.id === interaction.user.id) {
            if (i.customId != 'page-select')
                return;
            const selected = i.values[0];
            if (selected == 'clan') {
                update(selected, i);
                page = 1;
            }
            if (selected === 'balance') {
                update(selected, i);
                page = 2;
            }
            else if (selected === 'inventory') {
                update(selected, i);
                page = 3;
            }
        }
        else {
            const embed = new EmbedBuilder()
                .setTitle('What are you trying to pull here?')
                .setDescription('These are not your buttons! Get your own!')
                .setColor(randomColor);
            i.reply({ embeds: [embed], components: [], ephemeral: true });
        }
    });
    collector.on('end', async (collected) => {
        if (page == 1) {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Clan`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Clan Name**', value: `${user.clanname}`, inline: false }, { name: '**Members**', value: `${user.memberslist}`, inline: false }, { name: '**Total Number Of Members**', value: `${user.members}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('disabled')
                .setPlaceholder('Choose a page!')
                .setDisabled(true)
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                }
            ]));
            message.edit({ embeds: [embed], components: [row] });
        }
        else if (page == 2) {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Balance`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Balance**', value: `<a:ice:999097979757678682> ${user.balance}`, inline: false }, { name: '**Bank**', value: `${user.bank} 💳`, inline: false }, { name: '**Meat**', value: `${user.meat} 🥩`, inline: false }, { name: '**Fish**', value: `${user.fish} 🐟`, inline: false }, { name: '**Insects**', value: `${user.insects} 🐛`, inline: false }, { name: '**Plants**', value: `${user.leafs} 🍃`, inline: false }, { name: '**Net Worth**', value: `<a:ice:999097979757678682> ${user.bank + user.balance}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('disabled')
                .setPlaceholder('Choose a page!')
                .setDisabled(true)
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                }
            ]));
            message.edit({ embeds: [embed], components: [row] });
        }
        else if (page == 3) {
            const user = await pengu.findOne({ id: targetUser ? targetUser.id : interaction.user.id });
            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username}'s Inventory`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields({ name: '**Inventory**', value: `${user.inventory}`, inline: false })
                .setColor(randomColor);
            const row = new ActionRowBuilder()
                .addComponents(new StringSelectMenuBuilder()
                .setCustomId('disabled')
                .setPlaceholder('Choose a page!')
                .setDisabled(true)
                .addOptions([
                {
                    label: 'Balance',
                    description: 'Check your balance.',
                    value: 'balance',
                    emoji: '💳',
                }
            ]));
            message.edit({ embeds: [embed], components: [row] });
        }
    });
}
;

module.exports.execute = execute;
module.exports.category = 'economy';