const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('give')
  .setDescription('Give money to another user.')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('Enter the user you want to give money to.')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('amount')
      .setDescription('Enter the amount you want to give.')
      .setRequired(true)
  );

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const amount = interaction.options.getInteger('amount');
  const user = await pengu.findOne({ id: interaction.user.id });
  const balance = await user.balance;
  const member = interaction.options.getMember('user');
  const memberData = await pengu.findOne({ id: member.id });

  if (amount > balance) {
    const notEnough = new EmbedBuilder()
      .setTitle('Not Enough Money!')
      .setDescription('You do not have enough money to give.')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
  } else if (member.id === interaction.user.id) {
    const notEnough = new EmbedBuilder()
      .setTitle("You can't give money to yourself!")
      .setDescription('If only the world worked like that...')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
  } else if (!memberData) {
    const notEnough = new EmbedBuilder()
      .setTitle('User not found!')
      .setDescription(
        'The user you are trying to give money to has not joined PenguEmpire yet.'
      )
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [notEnough] });
  } else {
    const embed = new EmbedBuilder()
      .setTitle('Give Successful!')
      .setDescription(
        `You have successfully given <a:ice:999097979757678682> ${amount} to ${member}.`
      )
      .setColor(randomColor)
      .setTimestamp();

    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: -amount } });
    await pengu.findOneAndUpdate({ id: member.id }, { $inc: { balance: amount } });

    await interaction.reply({ embeds: [embed] });
  }
};
module.exports.category = 'economy';