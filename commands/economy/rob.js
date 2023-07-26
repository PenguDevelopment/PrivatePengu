const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pengu = require('../../modals/pengu-schema.js');

let data = new SlashCommandBuilder()
  .setName("rob")
  .setDescription("Rob someone for money.")
  .addUserOption((option) => option
    .setName("user")
    .setDescription("Enter the user you want to rob.")
    .setRequired(true));

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  const user = await pengu.findOne({ id: interaction.user.id });
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const robCooldown = 300000;
  const robCooldownTime = user.robCooldown;
  const robCooldownTimeLeft = robCooldown - (Date.now() - robCooldownTime);
  const robCooldownTimeLeftSeconds = robCooldownTimeLeft / 1000;
  const robCooldownTimeLeftMinutes = robCooldownTimeLeftSeconds / 60;

  if (robCooldownTimeLeft > 0) {
    const robCooldownEmbed = new EmbedBuilder()
      .setTitle("Rob Cooldown!")
      .setDescription(`You cannot rob someone for another ${robCooldownTimeLeftMinutes.toFixed(2)} minutes.`)
      .setColor(randomColor)
      .setTimestamp();

    return await interaction.reply({ embeds: [robCooldownEmbed] });
  } else {
    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $set: { robCooldown: Date.now() } });

    const robUser = await pengu.findOne({ id: interaction.options.getUser("user").id });
    const chance = Math.floor(Math.random() * 100);

    if (!robUser) {
      const noUser = new EmbedBuilder()
        .setTitle(await convertor(chance))
        .setDescription("This user does not have an account.")
        .setColor(randomColor)
        .setTimestamp();

      return await interaction.reply({ embeds: [noUser] });
    } else if (robUser.id === interaction.user.id) {
      const noSelf = new EmbedBuilder()
        .setTitle("You Cannot Rob Yourself!")
        .setDescription("...why would you want to rob yourself?")
        .setColor(randomColor)
        .setTimestamp();

      return await interaction.reply({ embeds: [noSelf] });
    }

    async function convertor(number) {
      if (number === 100) {
        return "Piplup Not Found!";
      } else {
        return "User Not Found!";
      }
    }

    const robBalance = Math.floor(Math.random() * (robUser.balance * 0.4 - robUser.balance * 0.01) + robUser.balance * 0.01);
    const robChance = Math.floor(Math.random() * 100);

    if (robBalance < 1) {
      const noMoney = new EmbedBuilder()
        .setTitle("No Money!")
        .setDescription("This user does not have any money to rob.")
        .setColor(randomColor)
        .setTimestamp();

      await interaction.reply({ embeds: [noMoney] });
    } else {
      if (robChance < 50) {
        const penalty = Math.floor(Math.random() * (robUser.balance * 0.05 - robUser.balance * 0.01) + robUser.balance * 0.01);
        const failed = new EmbedBuilder()
          .setTitle("Rob Failed!")
          .setDescription(`You have failed to rob this user and lost <a:ice:999097979757678682> ${penalty}.`)
          .setColor(randomColor)
          .setTimestamp();

        await interaction.reply({ embeds: [failed] });
        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: -penalty } });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Rob Successful!")
          .setDescription(`You have successfully robbed <a:ice:999097979757678682> ${robBalance} from ${interaction.options.getUser("user").username}.`)
          .setColor(randomColor)
          .setTimestamp();

        await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: robBalance } });
        await pengu.findOneAndUpdate({ id: interaction.options.getUser("user").id }, { $inc: { balance: -robBalance } });
        await interaction.reply({ embeds: [embed] });
      }
    }
  }
};
module.exports.category = 'economy';