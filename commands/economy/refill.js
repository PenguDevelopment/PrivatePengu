const { EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const user = await pengu.findOne({ id: interaction.user.id });
  const turns = user.clanturns;
  let date = Date.now();
  let lastRefill = user.lastRefill;
  let timeDiff = date - lastRefill;
  let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days < 1) {
    const embed = new EmbedBuilder()
      .setTitle('Refill')
      .setDescription(`You have already refilled your turns today.`)
      .setColor(randomColor)
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  }

  if (turns === 10) {
    const embed = new EmbedBuilder()
      .setTitle('Refill')
      .setDescription(`You already have all your turns today.`)
      .setColor(randomColor)
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  }

  await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { lastRefill: date } });
  let embed = new EmbedBuilder()
    .setTitle('Refill')
    .setDescription(`You have refilled your turns.`)
    .setColor(randomColor)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
  await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { clanturns: 10 } });
};
module.exports.subCommand = "economy.refill";