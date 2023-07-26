const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('codes')
  .setDescription('Redeem PenguEmpire Codes.')
  .addStringOption(option =>
    option
      .setName('code')
      .setDescription('Enter the code you want to redeem.')
      .setRequired(true)
  );

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const prevCode = interaction.options.getString('code');
  const code = prevCode.toLowerCase();
  const reverseId = interaction.user.id.split('').reverse().join('');
  const codes = {
    pengu: 100,
    penguempire: 100,
    piplup7575: 200,
  };

  async function embed(code, amount) {
    const embed = new EmbedBuilder()
      .setTitle('Code Redeemed!')
      .setDescription(`You have successfully redeemed the code: ${code}, for <a:ice:999097979757678682> ${amount} `)
      .setColor(randomColor);

    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $inc: { balance: amount } });
    await pengu.findOneAndUpdate({ id: interaction.user.id }, { $push: { codesRedeemed: code } });

    return embed;
  }

  async function codeUsed(code) {
    const user = await pengu.findOne({ id: interaction.user.id });
    const codes = await user.codesRedeemed;

    if (codes) {
      for (let i = 0; i < codes.length; i++) {
        if (codes[i] === code) {
          return true;
        }
      }
    }
    return false;
  }

  if (await codeUsed(code)) {
    const alreadyUsed = new EmbedBuilder()
      .setTitle('Code Already Used!')
      .setDescription('You have already used this code.')
      .setColor(randomColor);

    await interaction.reply({ embeds: [alreadyUsed] });
  } else if (code === reverseId) {
    await interaction.reply({ content: "The path is closed for now... Be patient as it will open soon..." });
  } else if (codes[code]) {
    await interaction.reply({ embeds: [await embed(code, codes[code])] });
  } else {
    const notExist = new EmbedBuilder()
      .setTitle('Piplup Not Found!')
      .setDescription('The code you entered does not exist.')
      .setColor(randomColor);

    await interaction.reply({ embeds: [notExist] });
  }
};
module.exports.category = 'economy';