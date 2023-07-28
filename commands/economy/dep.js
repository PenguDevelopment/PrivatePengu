const { EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let amount = interaction.options.getString('amount');

  if (amount.toLowerCase() === 'all') {
    const user = await pengu.findOne({ id: interaction.user.id });
    const balance = await user.balance;
    amount = balance;
  } else if (!amount.match(/^\d+$/)) {
    const notEnough = new EmbedBuilder()
      .setTitle('Invalid Amount!')
      .setDescription('You have entered an invalid amount.')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
    return;
  }

  amount = parseInt(amount, 10);

  if (amount < 1) {
    const notEnough = new EmbedBuilder()
      .setTitle('Invalid Amount!')
      .setDescription('You have entered an amount less than 1.')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
    return;
  }

  const user = await pengu.findOne({ id: interaction.user.id });
  const balance = await user.balance;

  if (amount > balance) {
    const notEnough = new EmbedBuilder()
      .setTitle('Not Enough Money!')
      .setDescription('You do not have enough money to deposit.')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
  } else {
    const embed = new EmbedBuilder()
      .setTitle('Deposit Successful!')
      .setDescription(`You have successfully deposited <a:ice:999097979757678682> ${amount} into your bank.`)
      .setColor(randomColor)
      .setTimestamp();

    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: -amount } });
    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { bank: amount } });

    await interaction.reply({ embeds: [embed] });
  }
};
module.exports.subCommand = "economy.dep";