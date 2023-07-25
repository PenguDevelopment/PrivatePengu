const { SlashCommandBuilder, PermissionsBitField, ButtonStyle, ChannelType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');
const { ActionRowBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const verify = require('../modals/verify-schema');
const { Emojis, Colors, EmojisIds } = require("../statics.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Set up a verification system for your server.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("channel-captcha")
                .setDescription("A captcha menu will be sent to a channel of your choice.")
                .addChannelOption(option => option.setName('channel').setDescription('The channel to send the captcha menu to.').setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addStringOption(option => option.setName('role').setDescription('The role to give to users who verify.').setRequired(true))
                .addStringOption(option => option.setName('type').setDescription('The type of captcha to use.').setRequired(true).addChoices(
                  { name: 'PenguCaptcha', value: 'pengu' },
                  { name: 'HaileyCaptcha', value: 'hailey' },
                  { name: 'InstantVerify', value: 'instant'}
                  )))
        .addSubcommand(subcommand =>
            subcommand
                .setName("dm-captcha")
                .setDescription("A captcha menu will be sent to the user's DMs.")
                .addChannelOption(option => option.setName('channel').setDescription('The channel to send the captcha menu to.').setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addStringOption(option => option.setName('role').setDescription('The role to give to users who verify.').setRequired(true))
                .addStringOption(option => option.setName('type').setDescription('The type of captcha to use.').setRequired(true).addChoices(
                  { name: 'PenguCaptcha', value: 'pengu' },
                  { name: 'HaileyCaptcha', value: 'hailey' },
                ))),
    async execute(interaction) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply('I need the `Embed Links` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply('I need the `Manage Roles` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply('I need the `Manage Messages` permission to run this command.');
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.AddReactions)) return interaction.reply('I need the `Add Reactions` permission to run this command.');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        let subcommand = interaction.options.getSubcommand();
        let type = interaction.options.getString('type');

        function genId(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            return result;
        }
        var specificId = genId(8);

        let channel = interaction.options.getChannel('channel');
        if (channel.type != 0) return interaction.reply('The channel you provided is not a text channel.');
        
        const alreadyVerify = await verify.findOne({
          guildId: interaction.guild.id,
          channelId: channel.id,
        });

        if (alreadyVerify) {
          // first check if message exists
          try {
            const message = await channel.messages.fetch(alreadyVerify.messageId);
            if (!message) {
              await verify.findOneAndDelete({
                guildId: interaction.guild.id,
                channelId: channel.id,
              });
            } else {
              const embed = new EmbedBuilder()
                  .setDescription(Emojis.error + ' There is already a verification system in that channel.')
                  .setColor(Colors.error);
              return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
          } catch (err) {
            await verify.findOneAndDelete({
              guildId: interaction.guild.id,
              channelId: channel.id,
            });
          }
        };

        let roleUnparsed = interaction.options.getString('role');
        let role = roleUnparsed.replace(/\D/g, '');
        if (!interaction.guild.roles.cache.get(role)) {
          const embed = new EmbedBuilder()
              .setDescription(Emojis.error + ' The role you provided is invalid.')
              .setColor(Colors.error);
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let guildName = interaction.guild.name;

        const embed = new EmbedBuilder()
            .setTitle('Verification')
            .addFields(
              { name: `${Emojis.space}${Emojis.error} To access \`${guildName}\`, you need to complete verification first. `, value: `${Emojis.space}${Emojis.space}${Emojis.click} Click on the button below to start.`, inline: false },
            )
            .setColor(Colors.normal)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`verify-${specificId}`)
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Success)
            )
        const responseEmbed = new EmbedBuilder()
            .setTitle('Success!')
            .setDescription(`You have successfully created a verification system in ${channel}.`)
            .setColor(Colors.success)
            .setTimestamp()
        await interaction.reply({
            embeds: [responseEmbed],
            ephemeral: true
        });
        const message = await channel.send({
            embeds: [embed],
            components: [row]
        });

        const newVerify = new verify({
          guildId: interaction.guild.id,
          channelId: channel.id,
          roleId: role,
          type: subcommand,
          specificId: specificId,
          messageId: message.id,
          captchaType: type,
        })
        newVerify.save()
    }
}