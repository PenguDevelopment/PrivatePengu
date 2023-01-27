const { Events, User } = require('discord.js');
const suggest = require('../suggestions-schema.js');
const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');
const { ActionRowBuilder } = require('discord.js');
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const guilds = require('../guild-schema.js');
const verify = require('../verify-schema.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	} else if (interaction.isButton() && interaction.customId.startsWith('sug-')) {
		const id = interaction.customId.split('-')[1];
		const vote = interaction.customId.split('-')[2];
		const suggestion = await suggest.findOne({ id: id });
		if (!suggestion) {
			const embed = new EmbedBuilder()
				.setTitle('Error!')
				.setDescription('That suggestion does not exist.')
				.setColor(randomColor)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			if (vote === 'yes') {
				const newVotes = suggestion.votes;
				const newAnswers = suggestion.answers;
				const action = interaction.customId.split('-')[2];
				const find = newAnswers.find(x => x.id == interaction.user.id);
				if (find) {
					if (action == find.type) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('You already voted on this suggestion.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					} else if (action == 'yes' && find.type == 'no') {
						newVotes.no = newVotes.no - 1;
						newAnswers.splice(newAnswers.indexOf(find), 1);
					}
				}
				newVotes.yes = newVotes.yes + 1;
				newAnswers.push({ id: `${interaction.user.id}`, type: 'yes' });
				await suggest.updateOne({ id: id }, { votes: newVotes, answers: newAnswers });	
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`sug-${id}-yes`)
							.setLabel(`${newVotes.yes}`)
							.setEmoji('👍')
							.setStyle(3),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji('👎')
							.setStyle(4),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						.setTitle('Error!')
						.setDescription('That suggestion does not exist.')
						.setColor(randomColor)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				await message.edit({ components: [row] });
				await interaction.reply({ content: 'You voted yes!', ephemeral: true });
			} else if (vote === 'no') {
				const newVotes = suggestion.votes;
				const newAnswers = suggestion.answers;
				const action = interaction.customId.split('-')[2];
				const find = newAnswers.find(x => x.id == interaction.user.id);
				if (find) {
					if (action == find.type) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('You already voted on this suggestion.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					} else if (action == 'no' && find.type == 'yes') {
						newVotes.yes = newVotes.yes - 1;
						newAnswers.splice(newAnswers.indexOf(find), 1);
					}
				}
				newVotes.no = newVotes.no + 1;
				newAnswers.push({ id: `${interaction.user.id}`, type: 'no' });
				await suggest.updateOne({ id: id }, { votes: newVotes, answers: newAnswers });
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`sug-${id}-yes`)
							.setLabel(`${newVotes.yes}`)
							.setEmoji('👍')
							.setStyle(3),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji('👎')
							.setStyle(4),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						.setTitle('Error!')
						.setDescription('That suggestion does not exist.')
						.setColor(randomColor)
					return interaction.reply({ embeds: [embed], ephemeral: true });
				}
				await message.edit({ components: [row] });
				await interaction.reply({ content: 'You voted no!', ephemeral: true });
				} else if (vote === 'approve') {
					const id = interaction.customId.split('-')[1];
					const suggestion = await suggest.findOne({ id: id });
					if (!suggestion) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('That suggestion does not exist.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('That suggestion does not exist.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					// get channel from guild
					const guild = await guilds.findOne({ guildID: interaction.guild.id });
					// find suggestionChannel
					const suggestionChannel = interaction.guild.channels.cache.get(`${guild.channelID}`);
					if (!suggestionChannel) {
						return interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });
					}
					const user = interaction.guild.members.cache.get(suggestion.author);

					const embed = new EmbedBuilder()
						.setTitle(`Suggestion From: ${user.user.tag}`)
						.setDescription(suggestion.suggestion)// set avatar image as author
						.setAuthor({ name: `New Suggestion!`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
						.setTimestamp()
						.setColor(randomColor)
					const embed2 = new EmbedBuilder()
						.setTitle('Information')
						.setAuthor({ name: "New Suggestion!", iconURL: user.user.avatarURL({ dynamic: true })})
						.setDescription(`Suggestion By: <@${user.user.id}>`)
						.addFields({ name: 'Suggestion:', value: `${suggestion.suggestion}` })
						.setColor(randomColor)
						.setTimestamp()
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji('✅')
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji('⛔')
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed2], components: [row] });
					const row1 = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-yes`)
								.setLabel(`${suggestion.votes.yes}`)
								.setEmoji('👍')
								.setStyle(3),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-no`)
								.setLabel(`${suggestion.votes.no}`)
								.setEmoji('👎')
								.setStyle(4)
						);
					await suggestionChannel.send({ embeds: [embed], components: [row1] });
					const msg = await suggestionChannel.messages.fetch({ limit: 1 });
					// add suggestion to database and also add the message id
					await suggest.findOneAndUpdate({ id: id }, { $set: { messageId: msg.first().id } });
					await interaction.reply({ content: 'You approved the suggestion!', ephemeral: true });
				} else if (vote === 'deny') {
					const id = interaction.customId.split('-')[1];
					const suggestion = await suggest.findOne({ id: id });
					if (!suggestion) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('That suggestion does not exist.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							.setTitle('Error!')
							.setDescription('That suggestion does not exist.')
							.setColor(randomColor)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const user = interaction.guild.members.cache.get(suggestion.author);
					const embed = new EmbedBuilder()
						.setTitle('Suggestion Denied!')
						.setDescription(`Suggestion: ${suggestion.suggestion}`)
						.addFields(
							{ name: 'Denied by:', value: `${interaction.user.tag}` },
							{ name: 'Suggestion By:', value: `${user.user.tag}` },
							{ name: 'Denied at:', value: `${new Date().toLocaleString()}` },
						)
					.setColor(randomColor)
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji('✅')
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji('❌')
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed], components: [row] });
					await interaction.reply({ content: 'Suggestion Denied!', ephemeral: true });
				}
			}
	} else if (interaction.isButton() && interaction.customId.startsWith('verify-')) {
		const id = interaction.customId.split('-')[1];
		const verifySc = await verify.findOne({ specificId: id });
		if (!verifySc) {
			const embed = new EmbedBuilder()
				.setTitle('Error!')
				.setDescription('That verification does not exist.')
				.setColor(randomColor)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		const message = await interaction.channel.messages.fetch(verifySc.messageId);
		if (!message) {
			const embed = new EmbedBuilder()
				.setTitle('Error!')
				.setDescription('Somethign went wrong. Ask an admin to delete the verification and make a new one.')
				.setColor(randomColor)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		// add role to user
		const role = interaction.guild.roles.cache.get(verifySc.roleId);
		if (!role) {
			const embed = new EmbedBuilder()
				.setTitle('Error!')
				.setDescription('Role does not exist. Ask an admin to reset the verification system.')
				.setColor(randomColor)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		await interaction.member.roles.add(role);
		const embed = new EmbedBuilder()
			.setTitle('Congrats!')
			.setDescription('You have been verified! You can now access the server!')
			.setColor(randomColor)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
	},
};