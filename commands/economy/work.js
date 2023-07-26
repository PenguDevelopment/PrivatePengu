const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('work')
  .setDescription('Work for money');

async function execute(interaction) {
    const user = await pengu.findOne({ id: interaction.user.id });
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const farmerJobMessages = [
        'You did some farm stuff!',
        'You pulled up some cabbage and gave it to some random penguin!',
        'You farmed!',
        'You wrote a book about farming!',
        'You did some farming!',
        'You emailed some farmers.',
        'You reached 100 cpm!',
        'You got 100 cabages! Big W!',
    ];
    const youtuberJobMessages = [
        'You posted a video without editing it!',
        'You posted a video while editing it!',
        'You posted a video with edits!',
        'You posted an edited video!',
        "You posted a video that wasn't yours! Big W!",
        'You did a typing test live stream!',
        'You posted about your changed views on DBS!',
    ];
    const programmerJobMessages = [
        'You wrote a new javascript framework!',
        'You tried the latest javascript framework!',
        'You asked ChatGPT to help with a question on stackoverflow.',
        'You asked something on stackoverflow.',
        'You got banned from stackoverflow. Big W!',
        'You hacked into roblox to give yourself +1 robuck!',
        'You made a new discord bot!',
    ];
    const discordJobMessages = [
        'You warned a member for spamming!',
        'You banned a member for spamming!',
        'You muted a member for spamming!',
        'You kicked a member for spamming!',
        'You gave a member a warning for spamming!',
        'You gave a member a mute for spamming!',
        'You gave a member a kick for spamming!',
        'You ate a lot of food! (After warning someone for spamming!)',
        'You turned on light mode for fun! And instantly regretted it! So you banned someone for spamming!',
    ];
    const farmerMessage = farmerJobMessages[Math.floor(Math.random() * farmerJobMessages.length)];
    const youtuberMessage = youtuberJobMessages[Math.floor(Math.random() * youtuberJobMessages.length)];
    const programmerMessage = programmerJobMessages[Math.floor(Math.random() * programmerJobMessages.length)];
    const discordMessage = discordJobMessages[Math.floor(Math.random() * discordJobMessages.length)];
    let hour = 3600000;
    let lastWork = user.lastWork;
    let hoursSinceLastWork = (Date.now() - lastWork) / hour;
    let minutes = Math.floor(60 - hoursSinceLastWork * 60);
    if (hoursSinceLastWork < 1) {
        const workEmbed = new EmbedBuilder()
            .setTitle("You're on cooldown!")
            .setDescription('You can work again in ' + minutes + ' minutes.')
            .setColor(randomColor)
            .setTimestamp();
        return await interaction.reply({ embeds: [workEmbed] });
    }
    if (!user.job) {
        const jobEmbed = new EmbedBuilder()
            .setTitle("You don't have a job!")
            .setDescription('Here are the current available jobs:')
            .setColor(randomColor)
            .addFields({
            name: 'Farmer',
            value: 'Earns <a:ice:999097979757678682>100. Required Job Level: 1',
            inline: true,
        }, {
            name: 'Youtuber',
            value: 'Earns <a:ice:999097979757678682>200. Required Job Level: 2',
            inline: true,
        }, {
            name: 'Programmer',
            value: 'Earns <a:ice:999097979757678682>300. Required Job Level: 3',
            inline: true,
        }, {
            name: 'Discord Mod',
            value: 'Earns <a:ice:999097979757678682>400. Required Job Level: 4',
            inline: true,
        })
            .setTimestamp();
        const jobRow = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setLabel('Farmer')
            .setStyle(1)
            .setCustomId('farmer'), new ButtonBuilder()
            .setLabel('Youtuber')
            .setStyle(2)
            .setCustomId('youtuber')
            .setDisabled(user.jobLevel < 2 ? false : true), new ButtonBuilder()
            .setLabel('Programmer')
            .setStyle(3)
            .setCustomId('programmer')
            .setDisabled(user.jobLevel < 3 ? false : true), new ButtonBuilder()
            .setLabel('Discord Mod')
            .setStyle(4)
            .setCustomId('discordmod')
            .setDisabled(user.jobLevel < 4 ? false : true));
        await interaction.reply({ embeds: [jobEmbed], components: [jobRow] });
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 60000,
        });
        collector.on('collect', async (i) => {
            if (i.customId == 'farmer') {
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Farmer', jobLevel: 1 } });
                const embed = new EmbedBuilder()
                    .setTitle('You are now a farmer!')
                    .setDescription('To get to the job menu again just run /edit job')
                    .setColor(randomColor)
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed], components: [] });
            }
            else if (i.customId == 'youtuber') {
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Youtuber' } });
                const embed = new EmbedBuilder()
                    .setTitle('You are now a youtuber!')
                    .setDescription('To get to the job menu again just run /edit job')
                    .setColor(randomColor)
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed], components: [] });
            }
            else if (i.customId == 'programmer') {
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Programmer' } });
                const embed = new EmbedBuilder()
                    .setTitle('You are now a programmer!')
                    .setDescription('To get to the job menu again just run /edit job')
                    .setColor(randomColor)
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed], components: [] });
            }
            else if (i.customId == 'discordmod') {
                await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Discord Mod' } });
                const embed = new EmbedBuilder()
                    .setTitle('You are now a discord mod!')
                    .setDescription('To get to the job menu again just run /edit job')
                    .setColor(randomColor)
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed], components: [] });
            }
        });
        collector.on('end', async (collected) => {
            const disabledRow = new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setLabel('Farmer')
                .setStyle(1)
                .setCustomId('farmer')
                .setDisabled(true), new ButtonBuilder()
                .setLabel('Youtuber')
                .setStyle(2)
                .setCustomId('youtuber')
                .setDisabled(true), new ButtonBuilder()
                .setLabel('Programmer')
                .setStyle(3)
                .setCustomId('programmer')
                .setDisabled(true), new ButtonBuilder()
                .setLabel('Discord Mod')
                .setStyle(4)
                .setCustomId('discordmod')
                .setDisabled(true));
            await interaction.editReply({
                embeds: [jobEmbed],
                components: [disabledRow],
            });
        });
    }
    else if (user.job == 'Farmer') {
        const farmerEmbed = new EmbedBuilder()
            .setTitle(farmerMessage)
            .setDescription('You earned <a:ice:999097979757678682>100!')
            .setColor(randomColor)
            .setTimestamp();
        await interaction.reply({ embeds: [farmerEmbed] });
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { xp: 100, balance: 100 }, $set: { lastWork: Date.now() } });
        if (user.xp >= 1000) {
            await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { jobLevel: 1, xp: -1000 } });
            const levelUpEmbed = new EmbedBuilder()
                .setTitle('You leveled up!')
                .setDescription(`You are now level ${user.jobLevel + 1}!`)
                .setColor(randomColor)
                .setTimestamp();
            await interaction.followUp({
                embeds: [levelUpEmbed],
                ephemeral: true,
            });
        }
    }
    else if (user.job == 'Youtuber') {
        const youtuberEmbed = new EmbedBuilder()
            .setTitle(youtuberMessage)
            .setDescription('You earned <a:ice:999097979757678682>200!')
            .setColor(randomColor)
            .setTimestamp();
        await interaction.reply({ embeds: [youtuberEmbed] });
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { xp: 100, balance: 100 }, $set: { lastWork: Date.now() } });
        if (user.xp >= 1000) {
            await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { jobLevel: 1, xp: -1000 } });
            const levelUpEmbed = new EmbedBuilder()
                .setTitle('You leveled up!')
                .setDescription(`You are now level ${user.jobLevel + 1}!`)
                .setColor(randomColor)
                .setTimestamp();
            await interaction.followUp({
                embeds: [levelUpEmbed],
                ephemeral: true,
            });
        }
    }
    else if (user.job == 'Programmer') {
        const programmerEmbed = new EmbedBuilder()
            .setTitle(programmerMessage)
            .setDescription('You earned <a:ice:999097979757678682>300!')
            .setColor(randomColor)
            .setTimestamp();
        await interaction.reply({ embeds: [programmerEmbed] });
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { xp: 100, balance: 100 }, $set: { lastWork: Date.now() } });
        if (user.xp >= 1000) {
            await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { jobLevel: 1, xp: -1000 } });
            const levelUpEmbed = new EmbedBuilder()
                .setTitle('You leveled up!')
                .setDescription(`You are now level ${user.jobLevel + 1}!`)
                .setColor(randomColor)
                .setTimestamp();
            await interaction.followUp({
                embeds: [levelUpEmbed],
                ephemeral: true,
            });
        }
    }
    else if (user.job == 'DiscordMod') {
        const discordModEmbed = new EmbedBuilder()
            .setTitle(discordMessage)
            .setDescription('You earned <a:ice:999097979757678682>400!')
            .setColor(randomColor)
            .setTimestamp();
        await interaction.reply({ embeds: [discordModEmbed] });
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { xp: 100, balance: 100 }, $set: { lastWork: Date.now() } });
        if (user.xp >= 1000) {
            await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { jobLevel: 1, xp: -1000 } });
            const levelUpEmbed = new EmbedBuilder()
                .setTitle('You leveled up!')
                .setDescription(`You are now level ${user.jobLevel + 1}!`)
                .setColor(randomColor)
                .setTimestamp();
            await interaction.followUp({
                embeds: [levelUpEmbed],
                ephemeral: true,
            });
        }
    }
}
module.exports = {
    data,
    execute,
  };
  module.exports.category = 'economy';