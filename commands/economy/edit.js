const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('edit-job')
  .setDescription('Edit your profile')
  .addSubcommand(subcommand =>
    subcommand.setName('job').setDescription('Edit your job')
  );

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const user = await pengu.findOne({ id: interaction.user.id });

  if (!user.job) {
    const jobEmbed = new EmbedBuilder()
      .setTitle("You don't have a job!")
      .setDescription("Here are the current available jobs:")
      .setColor(randomColor)
      .addFields(
        { name: 'Farmer', value: 'Earns <a:ice:999097979757678682>100. Required Job Level: 1', inline: true },
        { name: 'Youtuber', value: 'Earns <a:ice:999097979757678682>200. Required Job Level: 2', inline: true },
        { name: 'Programmer', value: 'Earns <a:ice:999097979757678682>300. Required Job Level: 3', inline: true },
        { name: 'Discord Mod', value: 'Earns <a:ice:999097979757678682>400. Required Job Level: 4', inline: true }
      )
      .setTimestamp();

    const jobRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setLabel('Farmer').setStyle(1).setCustomId('farmer'),
        new ButtonBuilder().setLabel('Youtuber').setStyle(2).setCustomId('youtuber').setDisabled(user.jobLevel < 2 ? false : true),
        new ButtonBuilder().setLabel('Programmer').setStyle(3).setCustomId('programmer').setDisabled(user.jobLevel < 3 ? false : true),
        new ButtonBuilder().setLabel('Discord Mod').setStyle(4).setCustomId('discordmod').setDisabled(user.jobLevel < 4 ? false : true)
      );

    await interaction.reply({ embeds: [jobEmbed], components: [jobRow] });
  } else {
    const jobEmbed = new EmbedBuilder()
      .setTitle('Change your job! (Bad boss??)')
      .setDescription('Here are the current available jobs:')
      .setColor(randomColor)
      .addFields(
        { name: 'Farmer', value: 'Earns <a:ice:999097979757678682>100. Required Job Level: 1', inline: true },
        { name: 'Youtuber', value: 'Earns <a:ice:999097979757678682>200. Required Job Level: 2', inline: true },
        { name: 'Programmer', value: 'Earns <a:ice:999097979757678682>300. Required Job Level: 3', inline: true },
        { name: 'Discord Mod', value: 'Earns <a:ice:999097979757678682>400. Required Job Level: 4', inline: true }
      )
      .setTimestamp();

    const jobRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setLabel('Farmer').setStyle(1).setCustomId('farmer'),
        new ButtonBuilder().setLabel('Youtuber').setStyle(2).setCustomId('youtuber').setDisabled(user.jobLevel < 2 ? true : false),
        new ButtonBuilder().setLabel('Programmer').setStyle(3).setCustomId('programmer').setDisabled(user.jobLevel < 3 ? true : false),
        new ButtonBuilder().setLabel('Discord Mod').setStyle(4).setCustomId('discordmod').setDisabled(user.jobLevel <= 4 ? true : false)
      );

    await interaction.reply({ embeds: [jobEmbed], components: [jobRow] });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'farmer') {
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Farmer' } });
        const embed = new EmbedBuilder()
          .setTitle('You are now a farmer!')
          .setDescription('To get to the job menu again just run /edit job')
          .setColor(randomColor)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], components: [] });
      } else if (i.customId === 'youtuber') {
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Youtuber' } });
        const embed = new EmbedBuilder()
          .setTitle('You are now a youtuber!')
          .setDescription('To get to the job menu again just run /edit job')
          .setColor(randomColor)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], components: [] });
      } else if (i.customId === 'programmer') {
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'Programmer' } });
        const embed = new EmbedBuilder()
          .setTitle('You are now a programmer!')
          .setDescription('To get to the job menu again just run /edit job')
          .setColor(randomColor)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], components: [] });
      } else if (i.customId === 'discordmod') {
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { job: 'DiscordMod' } });
        const embed = new EmbedBuilder()
          .setTitle('You are now a discordmod!')
          .setDescription('To get to the job menu again just run /edit job')
          .setColor(randomColor)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed], components: [] });
      }
    });
  }
};
module.exports.category = 'economy';