const { Events} = require('discord.js');
const suggest = require('../suggestions-schema.js');
const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');
const { ActionRowBuilder } = require('discord.js');
const guilds = require('../guild-schema.js');
const verify = require('../verify-schema.js');
const linkSchema = require('../links-schema.js');
const personalLinkSchema = require('../personallink-schema.js');
const { Emojis, Colors, EmojiIds } = require('../statics.js');


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
				//.setTitle('Error!')
				.setDescription(Emojis.error + ' That suggestion does not exist.')
				.setColor(Colors.errpr)
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
							.setDescription(Emojis.error + ' You already voted on this suggestion.')
							.setColor(Colors.error)
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
							.setEmoji(EmojiIds.success)
							.setStyle(2),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji(EmojiIds.error)
							.setStyle(2),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						//.setTitle('Error!')
						.setDescription(Emojis.error + ' That suggestion does not exist.')
						.setColor(Emojis.error)
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
							// .setTitle('Error!')
							.setDescription(Emojis.error + ' You\'ve already voted for this suggestion.')
							.setColor(Colors.error)
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
							.setEmoji(EmojiIds.success)
							.setStyle(2),
						new ButtonBuilder()
							.setCustomId(`sug-${id}-no`)
							.setLabel(`${newVotes.no}`)
							.setEmoji(EmojiIds.error)
							.setStyle(2),
					);
				const message = await interaction.channel.messages.fetch(suggestion.messageId);
				if (!message) {
					const embed = new EmbedBuilder()
						// .setTitle('Error!')
						.setDescription(Emojis.error + ' That suggestion does not exist.')
						.setColor(Colors.error)
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
							.setColor(Colors.normal)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							// .setTitle('Error!')
							.setDescription(Emojis.error + ' That suggestion does not exist.') 
							.setColor(Colors.error)
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
						//.setTitle(`Suggestion from ${user.user.tag}`)
						.setDescription(suggestion.suggestion)// set avatar image as author
						.setAuthor({ name: `New suggestion from ${user.user.tag}`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
						.setTimestamp()
						.setColor(Colors.normal)
					const embed2 = new EmbedBuilder()
						//.setTitle('Information')
						.setAuthor({ name: `New suggestion from ${user.user.tag}`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
						.addFields({ name: 'Suggestion:', value: `${suggestion.suggestion}` })
						.setColor(Colors.normal)
						.setTimestamp()
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji(EmojiIds.success)
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji(EmojiIds.error)
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed2], components: [row] });
					const row1 = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-yes`)
								.setLabel(`${suggestion.votes.yes}`)
								.setEmoji(EmojiIds.success)
								.setStyle(2),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-no`)
								.setLabel(`${suggestion.votes.no}`)
								.setEmoji(EmojiIds.error)
								.setStyle(2)
						);
					await suggestionChannel.send({ embeds: [embed], components: [row1] });
					const msg = await suggestionChannel.messages.fetch({ limit: 1 });
					// add suggestion to database and also add the message id
					await suggest.findOneAndUpdate({ id: id }, { $set: { messageId: msg.first().id } });
					await interaction.reply({ content: Emojis.success + ' Successfully approved this suggestion!', ephemeral: true });
				} else if (vote === 'deny') {
					const id = interaction.customId.split('-')[1];
					const suggestion = await suggest.findOne({ id: id });
					if (!suggestion) {
						const embed = new EmbedBuilder()
							//.setTitle('Error!')
							.setDescription(Emojis.error + ' This suggestion does not exist.')
							.setColor(Colors.error)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const reviewmessage = await interaction.channel.messages.fetch(suggestion.reviewMessageId);
					if (!reviewmessage) {
						const embed = new EmbedBuilder()
							//.setTitle('Error!')
							.setDescription(Emojis.error + ' This suggestion does not exist.')
							.setColor(Colors.normal)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}
					const user = interaction.guild.members.cache.get(suggestion.author);
					const embed = new EmbedBuilder()
						.setTitle('Suggestion Denied')
						.setDescription(`Suggestion: ${suggestion.suggestion}`)
						.addFields(
							{ name: 'Denied by:', value: `${interaction.user.tag}` },
							{ name: 'Suggestion By:', value: `${user.user.tag}` },
							{ name: 'Denied at:', value: `${new Date().toLocaleString()}` },
						)
					.setColor(Colors.normal)
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`sug-${id}-approve`)
								.setLabel('Approve')
								.setEmoji(EmojiIds.success)
								.setStyle(3)
								.setDisabled(true),
							new ButtonBuilder()
								.setCustomId(`sug-${id}-deny`)
								.setLabel('Deny')
								.setEmoji(EmojiIds.error)
								.setStyle(4)
								.setDisabled(true),
						);
					await reviewmessage.edit({ embeds: [embed], components: [row] });
					await interaction.reply({ content: Emojis.error + ' Successfully denied this suggestion.', ephemeral: true });
				}
			}
	} else if (interaction.isButton() && interaction.customId.startsWith('verify-')) {
		const id = interaction.customId.split('-')[1];
		const verifySc = await verify.findOne({ specificId: id });
		if (!verifySc) {
			const embed = new EmbedBuilder()
				//.setTitle('Error!')
				.setDescription(Emojis.error + ' This verification panel doesn\'t exist.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		const message = await interaction.channel.messages.fetch(verifySc.messageId);
		if (!message) {
			const embed = new EmbedBuilder()
				//.setTitle('Error!')
				.setDescription(Emojis.buh + ' Uh oh! Something went wrong. Please have a server admin restart verification setup.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		// add role to user
		const role = interaction.guild.roles.cache.get(verifySc.roleId);
		if (!role) {
			const embed = new EmbedBuilder()
				// .setTitle('Error!')
				.setDescription(Emojis.error + ' The verification role previously configured doesn\'t exist.  Please have a server admin restart verification setup.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		await interaction.member.roles.add(role);
		const embed = new EmbedBuilder()
			// .setTitle('Congrats!')
			.setDescription(Emojis.success + ' You have been verified successfully.')
			.setColor(Colors.success)
		await interaction.reply({ embeds: [embed], ephemeral: true });
	} else if (interaction.isButton() && interaction.customId.startsWith("get-link")) {
		const linkName = interaction.customId.split('-')[2];
		const links = await linkSchema.findOne({ guildID: interaction.guild.id });

		if (!links || !links.links.length > 0) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' This server has no links configured.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const link = await links.links.find((l) => l.linkName === linkName);

		if (!link) {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' This Link Dispencer does not exist.')
				.setColor(Colors.error)
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		let personalLink = await personalLinkSchema.findOne({ userId: interaction.user.id, guildID: interaction.guild.id });

		if (!personalLink) {
			personalLink = await new personalLinkSchema({
				userId: interaction.user.id,
				guildID: interaction.guild.id,
				linksThisMonth: 0,
			}).save();
		}

		if (personalLink.linksThisMonth >= link.linkLimit) {
			let date = Date.now();
			date = new Date(date);

			const day = date.getDate();
			if (day === 1) {
				personalLink.linksThisMonth = 0;
				await personalLink.save();
			} else {
				const embed = new EmbedBuilder()
					.setDescription(Emojis.error + ' You have reached your link limit for this month.')
					.setColor(Colors.error)
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		const randomLink = link.links[Math.floor(Math.random() * link.links.length)];
		let remaining = link.linkLimit - (personalLink.linksThisMonth + 1);
		let message = remaining === 1 ? 'link' : 'links';
		
		const embed = new EmbedBuilder()
			.setTitle('Your link is here!')
			.addFields(
				{ name: `${Emojis.link} Link`, value: `${Emojis.reply} ${randomLink.link}` },
			)
			.setFooter({ text: `You have ${remaining} ${message} remaining!`, iconURL: 'https://cdn.discordapp.com/emojis/1091035673882009651.png?v=1'})
			.setColor(Colors.normal)

		try {
			const onItsway = new EmbedBuilder()
				.setDescription(Emojis.loading + ' Your link is on its way! (Check your DMs)')
				.setColor(Colors.normal)
			await interaction.reply({ embeds: [onItsway], ephemeral: true });
			await interaction.user.send({ embeds: [embed] });
			personalLink.linksThisMonth++;
			await personalLink.save();
		} catch {
			const embed = new EmbedBuilder()
				.setDescription(Emojis.error + ' I was unable to send you a DM. Please enable DMs from server members.')
				.setColor(Colors.error)
			personalLink.linksThisMonth--;
			await personalLink.save();
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}
	},
};