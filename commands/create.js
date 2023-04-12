const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const achivment = require( '../achivment-schema.js'); //ok ima go work
const { Emojis, Colors } = require("../statics.js")
const selfroles = require('../selfroles-schema.js');
const linksSchema = require('../links-schema.js');

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create something.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('achievement')
        .setDescription('Create an achievement.')
        .addStringOption(option => option.setName('name').setDescription('The name of the achievement.').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description of the achievement.').setRequired(true))
        .addRoleOption(option => option.setName('reward').setDescription('The reward for the achievement.').setRequired(true))
    ).addSubcommand(subcommand =>
        subcommand
        .setName('panel')
        .setDescription('Create a self roles panel.')
        .addStringOption(option => option.setName('panel-name').setDescription('The name of the panel.').setRequired(true))
        .addStringOption(option => option.setName('panel-description').setDescription('The description of the panel.').setRequired(true))
        .addStringOption(option => option.setName('panel-color').setDescription('The color of the panel.').setRequired(true).addChoices(
            { name: 'Random', value: 'random' },
            { name: 'Red', value: 'red' },
            { name: 'Green', value: 'green' },
            { name: 'Blue', value: 'blue' },
            { name: 'Yellow', value: 'yellow' },
            { name: 'Purple', value: 'purple' },
            { name: 'Pink', value: 'pink' },
            { name: 'Orange', value: 'orange' },
            { name: 'Black', value: 'black' },
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey' },
            { name: 'Cyan', value: 'cyan' },
            { name: 'Lime', value: 'lime' },
            { name: 'Brown', value: 'brown' },
            { name: 'Teal', value: 'teal' },
            { name: 'Silver', value: 'silver' },
            { name: 'Gold', value: 'gold' },
            { name: 'Magenta', value: 'magenta' },
            { name: 'Maroon', value: 'maroon' },
            { name: 'Olive', value: 'olive' },
            { name: 'Navy', value: 'navy' },
        ))
    ).addSubcommand(subcommand =>
        subcommand
        .setName('link')
        .setDescription('Create a link dispenser.')
        .addStringOption(option => option.setName('name').setDescription('The name of the link dispenser. (Remember this name! You\'ll need it to add links!)').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description of the link dispenser.').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The color of the link dispenser.').setRequired(true).addChoices(
            { name: 'Random', value: 'random' },
            { name: 'Red', value: 'red' },
            { name: 'Green', value: 'green' },
            { name: 'Blue', value: 'blue' },
            { name: 'Yellow', value: 'yellow' },
            { name: 'Purple', value: 'purple' },
            { name: 'Pink', value: 'pink' },
            { name: 'Orange', value: 'orange' },
            { name: 'Black', value: 'black' },
            { name: 'White', value: 'white' },
            { name: 'Grey', value: 'grey' },
            { name: 'Cyan', value: 'cyan' },
            { name: 'Lime', value: 'lime' },
            { name: 'Brown', value: 'brown' },
            { name: 'Teal', value: 'teal' },
            { name: 'Silver', value: 'silver' },
            { name: 'Gold', value: 'gold' },
            { name: 'Magenta', value: 'magenta' },
            { name: 'Maroon', value: 'maroon' },
            { name: 'Olive', value: 'olive' },
            { name: 'Navy', value: 'navy' },
        ))
        .addIntegerOption(option => option.setName('limit').setDescription('The number of links a person can get per month.').setRequired(false))
    ),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.flags.SendMessages)) {
            return;
        }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === 'achievement') {
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const reward = interaction.options.getRole('reward');
    
        const guild = interaction.guild;

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
                .setDescription(Emojis.error + ` The achievement \`${name}\` already exists in this guild.`)
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [alreadyExistsEmbed], ephemeral: true });
        }
    
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
            .setDescription(Emojis.success + ` Successfully created the achievement \`${name}\` You can add requirements for this achievement using the \`/add requirement\` command.`)
            .setColor(Colors.success);
        await interaction.reply({ embeds: [successEmbed] });
      } else if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }
        const panelName = interaction.options.getString('panel-name');
        const panelDescription = interaction.options.getString('panel-description');
        const panelColor = interaction.options.getString('panel-color');
        const guild = await interaction.guild;

        // if already exist
        const alreadyExist = await selfroles.findOne({
            guildID: guild.id,
            panels: {
                $elemMatch: {
                    panelName: panelName,
                }
            }
        });

        if (alreadyExist) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' A panel already exists with this name.')
                .setColor(Colors.error)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const panelEmbed = new EmbedBuilder()
            .setDescription(Emojis.success + ` Successfully created the \`${panelName}\` panel.`)
            .setColor(Colors.success)
            .setTimestamp()
        
        await interaction.reply({ embeds: [panelEmbed] });

        await selfroles.findOneAndUpdate(
            {
                guildID: guild.id,
            },
            {
                guildID: guild.id,
                $push: {
                    panels: {
                        panelName: panelName,
                        panelDescription: panelDescription,
                        panelColor: panelColor,
                        roles: [],
                        fields: [],
                    }
                }
            },
            {
                upsert: true,
            }
        );
      } else if (subcommand === 'link') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command. (Requires `ADMINISTRATOR`)')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        const linkName = interaction.options.getString('name');
        const linkDescription = interaction.options.getString('description');
        const linkColor = interaction.options.getString('color');
        const linkLimit = interaction.options.getInteger('limit') ? interaction.options.getInteger('limit') : "none";
        const guild = await interaction.guild.id;
        
        const alreadyExist = await linksSchema.findOne({
            guildID: guild,
            links: {
                $elemMatch: {
                    linkName: linkName,
                }
            }
        });

        if (alreadyExist) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' A link dispenser already exists with this name.')
                .setColor(Colors.error)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const linkEmbed = new EmbedBuilder()
            .setDescription(Emojis.success + ` Successfully created the \`${linkName}\` link dispenser.`)
            .setColor(Colors.success)
            .setTimestamp()
        await interaction.reply({ embeds: [linkEmbed] });
        await linksSchema.findOneAndUpdate(
            {
                guildID: guild,
            },
            {
                guildID: guild,
                $push: {
                    links: {
                        linkName: linkName,
                        linkDescription: linkDescription,
                        linkColor: linkColor,
                        linkLimit: linkLimit,
                        links: [],
                    }
                }
            },
            {
                upsert: true,
            }
        );
      }
  }
}