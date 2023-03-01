const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const achivment = require( '../achivment-schema.js');
module.exports = { 
    data: new SlashCommandBuilder()
    .setName('create-achievement')
    .setDescription('Create an achievement that is available to get.')
    .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('The description of the achievement.').setRequired(true))
    .addRoleOption(option => option.setName('reward').setDescription('The reward for the achievement.').setRequired(true)),
    async execute(interaction) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    // check if have permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const reward = interaction.options.getRole('reward');

    const guild = interaction.guild;
    // first find out if the achievement already exists
    const achievement = await achivment.findOne({
        guildID: guild.id,
        achievements: {
            $elemMatch: {
                name: name
            }
        }
    });
    if (achievement) {
        const alreadyExistsEmbed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription(`The achievement \`${name}\` already exists in the database.`)
            .setColor(randomColor);
        return await interaction.reply({ embeds: [alreadyExistsEmbed] });
    }

    // add this to database (this data may or may not already exist)
    await achivment.findOneAndUpdate(
        {
          guildID: guild.id
        },
        {
          guildID: guild.id,
          $push: {
            achievements: {
              name: name,
              description: description,
              reward: reward,
              requirements: [],
            }
          }
        },
        {
          upsert: true
        }
      );

    const successEmbed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription(`Added the achievement \`${name}\` to the database. Make sure to add requirements to your achievement using \`/add-requirement\`.`)
        .setColor(randomColor);
    await interaction.reply({ embeds: [successEmbed] });
}
}