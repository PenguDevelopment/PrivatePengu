const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const achivment = require( '../achivment-schema.js');
module.exports = {
    data : new SlashCommandBuilder()
    .setName('add-requirement')
    .setDescription('Add a requirement to an achievement.')
    .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true)),
    async execute(interaction) {
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    // check if have permission
    interaction.reply({ content: 'This command is currently disabled.', ephemeral: true });
    // const guild = interaction.guild.id;
    // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    //     const noPermEmbed = new EmbedBuilder()
    //         .setTitle('Error!')
    //         .setDescription('You do not have permission to use this command.')
    //         .setColor(randomColor);
    //     return await interaction.reply({ embeds: [noPermEmbed] });
    // }
//     const name = interaction.options.getString('name');
//     const achievement = await achivment.findOne({
//         guildID: guild,
//         "achievements.name": name
//       });
//       if (!achievement) {
//         const noAchievementEmbed = new EmbedBuilder()
//             .setTitle('Error!')
//             .setDescription(`The achievement \`${name}\` does not exist in the database.`)
//             .setColor(randomColor);
//         return await interaction.reply({ embeds: [noAchievementEmbed] });
//     }
//     const startEmbed = new EmbedBuilder()
//         .setTitle('Add Requirement')
//         .setDescription('What type of requirement would you like to add? (Type it verbatim with the name. You can cancel at any time by typing `cancel`.)')
//         .addFields(
//             { name: 'Messages', value: 'This adds a message requirement to the achievement. This requirement requires the user to have a specific number of messages sent in the server.' },
//             { name: 'Voice', value: 'This adds a voice requirement to the achievement. This requirement requires the user to have a specific number of minutes spent in voice channels in the server.' },
//             { name: 'Reactions', value: 'This adds a reaction requirement to the achievement. This requirement requires the user to have a specific number of reactions added to messages in the server.' },
//             { name: 'Roles', value: 'This adds a role requirement to the achievement. This requirement requires the user to have a specific role in the server.' },
//             { name: 'RoleNumber', value: 'This adds a role number requirement to the achievement. This requirement requires the user to have a specific number of roles in the server.' },
//             { name: 'Boosts', value: 'This adds a boost requirement to the achievement. This requirement requires the user to have a specific number of boosts in the server.' },
//             { name: 'Invites', value: 'This adds an invite requirement to the achievement. This requirement requires the user to have a specific number of invites in the server.' },
//         )
//         .setColor(randomColor);
//     await interaction.reply({ embeds: [startEmbed] });
//     let type;
//     let amount;
//     const filter = m => m.author.id === interaction.user.id;
//     const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//     collector.on('collect', async (m) => {
//         if (m.author.bot) return;
//         let c = m.content.toLowerCase();
//         switch (c) {
//             case 'messages':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 for (const requirement of achievement.requirements) {
//                                     if (requirement.type == 'messages') {
//                                       const alreadyExistsEmbed = new EmbedBuilder()
//                                         .setTitle('Error!')
//                                         .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                         .setColor(randomColor);
//                                       collector.stop();
//                                       return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                   }                                  
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             case 'voice':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 await achievement.requirements.forEach(async requirement => {
//                                     if (await requirement.type == 'voice') {
//                                         const alreadyExistsEmbed = new EmbedBuilder()
//                                             .setTitle('Error!')
//                                             .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                             .setColor(randomColor);
//                                         collector.stop();
//                                         return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             case 'reactions':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 await achievement.requirements.forEach(async requirement => {
//                                     if (await requirement.type == 'reactions') {
//                                         const alreadyExistsEmbed = new EmbedBuilder()
//                                             .setTitle('Error!')
//                                             .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                             .setColor(randomColor);
//                                         collector.stop();
//                                         return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             case 'roles':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 await achievement.requirements.forEach(async requirement => {
//                                     if (await requirement.type == 'roles') {
//                                         const alreadyExistsEmbed = new EmbedBuilder()
//                                             .setTitle('Error!')
//                                             .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                             .setColor(randomColor);
//                                         collector.stop();
//                                         return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             case 'rolenumber':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 await achievement.requirements.forEach(async requirement => {
//                                     if (await requirement.type == 'rolenumber') {
//                                         const alreadyExistsEmbed = new EmbedBuilder()
//                                             .setTitle('Error!')
//                                             .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                             .setColor(randomColor);
//                                         collector.stop();
//                                         return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             case 'boosts':
//                 await achivment.findOne({
//                     guildID: guild,
//                     "achievements.name": name
//                 }, async (err, data) => {
//                     if (err) throw err;
//                     if (data) {
//                         await data.achievements.forEach(async achievement => {
//                             if (await achievement.name == name) {
//                                 await achievement.requirements.forEach(async requirement => {
//                                     if (await requirement.type == 'boosts') {
//                                         const alreadyExistsEmbed = new EmbedBuilder()
//                                             .setTitle('Error!')
//                                             .setDescription(`The achievement \`${name}\` already has a requirement of type \`${requirement.type}\`.`)
//                                             .setColor(randomColor);
//                                         collector.stop();
//                                         return await interaction.followUp({ embeds: [alreadyExistsEmbed] });
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }).clone();
//                 break;
//             }
        
//         if (c === 'messages') {
//             type = 'messages';
//             const messagesEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many messages does the user need to send?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [messagesEmbed] });
//             const messagesCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             messagesCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     collector.stop();
//                     messagesCollector.stop();
//                     return await interaction.followUp({ embeds: [cancelEmbed] });
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };

//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 messagesCollector.stop();
//             });
//         } else if (c === 'voice') {
//             type = 'voice';
//             const voiceEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many minutes does the user need?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [voiceEmbed] });
//             const voiceCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             voiceCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && voiceCollector.stop();
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 voiceCollector.stop();
//             });
//         } else if (c === 'reactions') {
//             type = 'reactions';
//             const reactionsEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many reactions does the user need?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [reactionsEmbed] });
//             const reactionsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             reactionsCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && reactionsCollector.stop();
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 reactionsCollector.stop();
//             });
//         } else if (c === 'rolenumber') {
//             type = 'roleNumber';
//             const roleNumberEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many roles does the user need?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [roleNumberEmbed] });
//             const roleNumberCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             roleNumberCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && roleNumberCollector.stop();
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 roleNumberCollector.stop();
//             });
//         } else if (c === 'role') {
//             type = 'role';
//             const roleEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('What role would you like to add?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [roleEmbed] });
//             const roleCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             roleCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && roleCollector.stop();
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 roleCollector.stop();
//             });
//         } else if (c === 'boosts') {
//             type = 'boosts';
//             const boostsEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many boosts does the user need?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [boostsEmbed] });
//             const boostsCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             boostsCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && boostsCollector.stop();
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 boostsCollector.stop();
//             });
//         } else if (c === 'invites') {
//             type = 'invites';
//             const invitesEmbed = new EmbedBuilder()
//                 .setTitle('Add Requirement')
//                 .setDescription('How many invites does the user need?')
//                 .setColor(randomColor);
//             await interaction.followUp({ embeds: [invitesEmbed] });
//             const invitesCollector = interaction.channel.createMessageCollector({ filter, time: 60000 });
//             invitesCollector.on('collect', async (m) => {
//                 if (m.author.bot) return;
//                 amount = m.content.toLowerCase();
//                 if (amount == 'cancel') {
//                     const cancelEmbed = new EmbedBuilder()
//                         .setTitle('Cancelled')
//                         .setDescription('Cancelled the command.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop() && invitesCollector.stop();
//                 }
//                 if (isNaN(amount)) {
//                     const notNumberEmbed = new EmbedBuilder()
//                         .setTitle('Error!')
//                         .setDescription('The amount must be a number.')
//                         .setColor(randomColor);
//                     return await interaction.followUp({ embeds: [notNumberEmbed] });
//                 }

//                 const requirements = {
//                     type: type,
//                     amount: amount
//                 };
            
//                 await achivment.findOneAndUpdate(
//                     {
//                         guildID: guild,
//                         "achievements.name": name
//                     },
//                     {
//                         $push: {
//                             "achievements.$.requirements": requirements
//                         }
//                     }
//                 );
//                 const successEmbed = new EmbedBuilder()
//                     .setTitle('Success!')
//                     .setDescription(`Added the requirement \`${type}\` with an amount of \`${amount}\` to the achievement \`${name}\`.`)
//                     .setColor(randomColor);
//                 await interaction.followUp({ embeds: [successEmbed] });
//                 collector.stop();
//                 invitesCollector.stop();
//             });
//         } else if (c === 'cancel') {
//             const cancelEmbed = new EmbedBuilder()
//                 .setTitle('Cancelled')
//                 .setDescription('Cancelled the command.')
//                 .setColor(randomColor);
//             return await interaction.followUp({ embeds: [cancelEmbed] }) && collector.stop();
//         }
//     });
 }
}