const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily rewards by beating a random minigame. (currently in development)');

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let user = await pengu.findOne({ id: interaction.user.id });
  let date = Date.now();
  let lastDaily = user.lastDaily;
  let timeDiff = date - lastDaily;
  let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days < 1) {
    let remainingHours = 24 - timeDiff / (1000 * 60 * 60);
    remainingHours = Math.floor(remainingHours);

    const embed = new EmbedBuilder()
      .setTitle('Daily')
      .setDescription(`You have already tried to get your daily reward today. Try again in ${remainingHours} hours.`)
      .setColor(randomColor)
      .setTimestamp();

    return await interaction.reply({ embeds: [embed] });
  }

  await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { lastDaily: date } });

  const embed = new EmbedBuilder()
    .setTitle('Daily')
    .setDescription('You have successfully claimed your daily reward!')
    .setColor(randomColor)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
  await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: 100 } });
};
module.exports.category = 'economy';