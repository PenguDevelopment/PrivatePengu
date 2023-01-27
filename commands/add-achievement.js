const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const achivment = require( '../achivment-schema.js');
module.exports = { 
    data : new SlashCommandBuilder()
    .setName('add-achievement')
    .setDescription('Add an achievement that is available to get.')
    .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('The description of the achievement.').setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('The type of achievement.').setRequired(true).addChoices(
        { name: 'Messages', value: 'message' },
    ))
    .addRoleOption(option => option.setName('reward').setDescription('The role to give when the achievement is completed. (only for role type)').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of needed to get the achivment. Ex: 400 messages. 1 boost.')),
    // .addRoleOption(option => option.setName('role').setDescription('The role needed to get. (only for role type.)')),
    async execute(interaction) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    // check if have permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const type = interaction.options.getString('type');
    const amount = interaction.options.getInteger('amount');
    // const role = interaction.options.getRole('role');
    const reward = interaction.options.getRole('reward');
    // if (type === 'role' && amount) {
    //     return await interaction.reply({ content: 'You cannot provide an amount when the type is role.', ephemeral: true });
    // }
    const guild = interaction.guild;

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
                    type: type,
                    amount: amount ? amount : null,
                    role: role ? role.id : null,
                    reward: reward.id
                }
            }
        },
        {
            upsert: true
        }
    );
    const successEmbed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription(`Added the achievement \`${name}\` to the database.`)
        .setColor(randomColor);
    await interaction.reply({ embeds: [successEmbed] });
}
}