const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pengu = require('../../modals/pengu-schema.js');

const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join the Empire.');

module.exports.data = data;

module.exports.execute = async function execute(interaction) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);

  if (await pengu.findOne({ id: interaction.user.id })) {
    const already = new EmbedBuilder()
      .setTitle('What are you trying to pull here?')
      .setDescription('You are already in the Empire!')
      .setColor(randomColor)
      .setTimestamp();

    interaction.reply({ embeds: [already], ephemeral: true });
  } else {
    const embed = new EmbedBuilder()
      .setDescription('You have successfully joined the Penguin Empire.')
      .setColor(randomColor)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await new pengu({
      id: interaction.user.id,
      guild: interaction.guild.id,
      balance: 10,
      bank: 0,
      inventory: ['Welcome Paper'],
      faction: 'None',
      members: 1,
      clanname: `${interaction.user.username}'s Clan`,
      clanimage: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
      memberslist: `${interaction.user.username}`,
      leafs: 10,
      meat: 10,
      fish: 10,
      insects: 10,
      clanturns: 10,
      clanbanner: 'https://cdn.discordapp.com/attachments/1006991525810540631/1047301921351942205/wallpaper.png',
      level: 0,
      xp: 0,
      xpneeded: 100,
      clanlevel: 0,
      clanxp: 0,
      clanxpneeded: 100,
    }).save();
  }
};
